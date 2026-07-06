-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  edu_domain text not null,
  display_name text not null,
  pronouns text,
  year text check (year in ('25','26','27','28','grad')),
  major text,
  photo_url text,
  photo_blurhash text,
  bio text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Modes
create table if not exists modes (
  id text primary key check (id in ('study','hackathon','gym'))
);
insert into modes values ('study'),('hackathon'),('gym')
  on conflict do nothing;

-- User modes with quiz vectors
create table if not exists user_modes (
  user_id uuid references profiles(id) on delete cascade,
  mode_id text references modes(id),
  active boolean default true,
  quiz_vector vector(32),
  quiz_answers jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, mode_id)
);

-- Swipes
create table if not exists swipes (
  swiper_id uuid references profiles(id) on delete cascade,
  swipee_id uuid references profiles(id) on delete cascade,
  mode_id text references modes(id),
  decision text check (decision in ('like','pass','super')),
  created_at timestamptz default now(),
  primary key (swiper_id, swipee_id, mode_id)
);

-- Matches
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references profiles(id) on delete cascade,
  user_b uuid references profiles(id) on delete cascade,
  mode_id text references modes(id),
  matched_at timestamptz default now(),
  last_message_at timestamptz,
  unique (user_a, user_b, mode_id)
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Allowed domains
create table if not exists allowed_domains (
  domain text primary key,
  campus_name text,
  active boolean default true
);

insert into allowed_domains (domain, campus_name) values
  ('berkeley.edu', 'UC Berkeley'),
  ('mit.edu', 'MIT'),
  ('uchicago.edu', 'University of Chicago'),
  ('stanford.edu', 'Stanford University'),
  ('ac.uk', 'UK Universities'),
  ('edu', 'Generic .edu')
on conflict do nothing;

-- Waitlist
create table if not exists waitlist (
  email text primary key,
  domain text,
  created_at timestamptz default now()
);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table user_modes enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table allowed_domains enable row level security;
alter table waitlist enable row level security;

-- profiles: anyone can read public fields, only self can write
create policy "profiles_select_public" on profiles
  for select using (true);
create policy "profiles_insert_self" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_self" on profiles
  for update using (auth.uid() = id);
create policy "profiles_delete_self" on profiles
  for delete using (auth.uid() = id);

-- user_modes: self or mutual match partner
create policy "user_modes_select" on user_modes
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from matches m
      where (m.user_a = auth.uid() or m.user_b = auth.uid())
        and (m.user_a = user_modes.user_id or m.user_b = user_modes.user_id)
    )
  );
create policy "user_modes_write_self" on user_modes
  for all using (auth.uid() = user_id);

-- swipes: self only
create policy "swipes_self" on swipes
  for all using (auth.uid() = swiper_id);

-- matches: only participants
create policy "matches_select" on matches
  for select using (auth.uid() = user_a or auth.uid() = user_b);

-- messages: only match participants
create policy "messages_select" on messages
  for select using (
    exists (
      select 1 from matches m
      where m.id = messages.match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );
create policy "messages_insert" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches m
      where m.id = messages.match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

-- allowed_domains: public read
create policy "allowed_domains_read" on allowed_domains
  for select using (true);

-- waitlist: anyone can insert their own
create policy "waitlist_insert" on waitlist
  for insert with check (true);

-- ─── Functions ──────────────────────────────────────────────────────────────

-- Create match if mutual (SECURITY DEFINER — bypasses RLS)
create or replace function create_match_if_mutual()
returns trigger
language plpgsql
security definer
as $$
declare
  v_match_id uuid;
begin
  -- Only fire on like or super
  if new.decision not in ('like','super') then
    return new;
  end if;

  -- Check for reciprocal swipe
  if exists (
    select 1 from swipes
    where swiper_id = new.swipee_id
      and swipee_id = new.swiper_id
      and mode_id   = new.mode_id
      and decision in ('like','super')
  ) then
    -- Insert match (user_a always the lexicographically smaller uuid)
    insert into matches (user_a, user_b, mode_id)
    values (
      least(new.swiper_id, new.swipee_id),
      greatest(new.swiper_id, new.swipee_id),
      new.mode_id
    )
    on conflict do nothing
    returning id into v_match_id;
  end if;

  return new;
end;
$$;

create trigger on_swipe_insert
  after insert on swipes
  for each row execute function create_match_if_mutual();

-- Discovery: ranked candidates by quiz vector similarity
create or replace function get_candidates(
  p_user_id uuid,
  p_mode_id text,
  p_limit int default 20
)
returns table (
  profile_id uuid,
  display_name text,
  year text,
  major text,
  photo_url text,
  photo_blurhash text,
  pronouns text,
  compatibility float
)
language sql
security invoker
stable
as $$
  select
    p.id as profile_id,
    p.display_name,
    p.year,
    p.major,
    p.photo_url,
    p.photo_blurhash,
    p.pronouns,
    (
      1 - (um.quiz_vector <=> (
        select quiz_vector from user_modes
        where user_id = p_user_id and mode_id = p_mode_id
      ))
    ) as compatibility
  from profiles p
  join user_modes um on um.user_id = p.id and um.mode_id = p_mode_id
  where
    p.id <> p_user_id
    and um.active = true
    and p.id not in (
      select swipee_id from swipes
      where swiper_id = p_user_id and mode_id = p_mode_id
    )
  order by compatibility desc
  limit p_limit;
$$;

-- Enable realtime on messages
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table matches;
