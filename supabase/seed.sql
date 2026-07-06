-- Seed: 3 campuses, 10 profiles each
-- Note: In a real setup, use auth.users + profiles. Here we insert demo profiles.
-- These UUIDs are fixed for reproducible seed data.

insert into allowed_domains (domain, campus_name) values
  ('berkeley.edu', 'UC Berkeley'),
  ('mit.edu', 'MIT'),
  ('uchicago.edu', 'University of Chicago')
on conflict do nothing;

-- UC Berkeley profiles (10)
do $$ declare begin
  insert into profiles (id, email, edu_domain, display_name, pronouns, year, major, photo_blurhash, verified) values
    ('11111111-1111-1111-1111-000000000001', 'alex@berkeley.edu',   'berkeley.edu', 'Alex Chen',      'they/them', '26', 'CS',              'L5H2EC=PM+yV0g-mq.wG9c01JPRj', true),
    ('11111111-1111-1111-1111-000000000002', 'maya@berkeley.edu',   'berkeley.edu', 'Maya Patel',     'she/her',   '25', 'Data Science',    'LGF5?xYk^6#M@-5c,1J5@[or[Q6.', true),
    ('11111111-1111-1111-1111-000000000003', 'jordan@berkeley.edu', 'berkeley.edu', 'Jordan Kim',     'he/him',    '27', 'Electrical Eng',  'LIH;uFWB?w%2D*o#t7ay_4RiRijs', true),
    ('11111111-1111-1111-1111-000000000004', 'sam@berkeley.edu',    'berkeley.edu', 'Sam Rivera',     'she/her',   '26', 'Statistics',      'LKO2?U%2Tw=w]~RBVZRi};RPxuwH', true),
    ('11111111-1111-1111-1111-000000000005', 'priya@berkeley.edu',  'berkeley.edu', 'Priya Nair',     'she/her',   '28', 'Pre-Med',         'LBD]Rs00^lxu_3WBt7WB00~qM{WB', true),
    ('11111111-1111-1111-1111-000000000006', 'tom@berkeley.edu',    'berkeley.edu', 'Tom Walsh',      'he/him',    'grad','ML Research',   'L~I#MXofofof~qofoffQofj[WBay', true),
    ('11111111-1111-1111-1111-000000000007', 'zara@berkeley.edu',   'berkeley.edu', 'Zara Ahmed',     'she/her',   '25', 'Design',          'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true),
    ('11111111-1111-1111-1111-000000000008', 'leo@berkeley.edu',    'berkeley.edu', 'Leo Santos',     'he/him',    '26', 'CS + Econ',       'LAHLh;of00ay~qWBt7j[ayRjM|fQ', true),
    ('11111111-1111-1111-1111-000000000009', 'nina@berkeley.edu',   'berkeley.edu', 'Nina Wu',        'she/her',   '27', 'Bioengineering',  'LJF~Qa00RjWB~qofRjj[j[ofWBj[', true),
    ('11111111-1111-1111-1111-000000000010', 'kai@berkeley.edu',    'berkeley.edu', 'Kai Thompson',   'they/them', '25', 'Philosophy+CS',   'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true)
  on conflict do nothing;

  -- MIT profiles (10)
  insert into profiles (id, email, edu_domain, display_name, pronouns, year, major, photo_blurhash, verified) values
    ('22222222-2222-2222-2222-000000000001', 'ara@mit.edu',    'mit.edu', 'Ara Petrosyan',   'she/her',   '26', 'EECS',            'L5H2EC=PM+yV0g-mq.wG9c01JPRj', true),
    ('22222222-2222-2222-2222-000000000002', 'ben@mit.edu',    'mit.edu', 'Ben Goldstein',   'he/him',    '25', 'Physics',         'LGF5?xYk^6#M@-5c,1J5@[or[Q6.', true),
    ('22222222-2222-2222-2222-000000000003', 'cleo@mit.edu',   'mit.edu', 'Cleo Nakamura',   'she/her',   '27', 'AeroAstro',       'LIH;uFWB?w%2D*o#t7ay_4RiRijs', true),
    ('22222222-2222-2222-2222-000000000004', 'dax@mit.edu',    'mit.edu', 'Dax Okonkwo',     'he/him',    '26', 'MechE',           'LKO2?U%2Tw=w]~RBVZRi};RPxuwH', true),
    ('22222222-2222-2222-2222-000000000005', 'elena@mit.edu',  'mit.edu', 'Elena Vasquez',   'she/her',   '28', 'Brain+Cog Sci',   'LBD]Rs00^lxu_3WBt7WB00~qM{WB', true),
    ('22222222-2222-2222-2222-000000000006', 'finn@mit.edu',   'mit.edu', 'Finn Larsen',     'he/him',    'grad','CS+Math',       'L~I#MXofofof~qofoffQofj[WBay', true),
    ('22222222-2222-2222-2222-000000000007', 'gia@mit.edu',    'mit.edu', 'Gia Moretti',     'she/her',   '25', 'Architecture',    'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true),
    ('22222222-2222-2222-2222-000000000008', 'hiro@mit.edu',   'mit.edu', 'Hiro Tanaka',     'he/him',    '26', 'Robotics',        'LAHLh;of00ay~qWBt7j[ayRjM|fQ', true),
    ('22222222-2222-2222-2222-000000000009', 'ines@mit.edu',   'mit.edu', 'Ines Dumont',     'she/her',   '27', 'Materials Sci',   'LJF~Qa00RjWB~qofRjj[j[ofWBj[', true),
    ('22222222-2222-2222-2222-000000000010', 'jack@mit.edu',   'mit.edu', 'Jack Osei',       'he/him',    '25', 'Nuclear Eng',     'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true)
  on conflict do nothing;

  -- UChicago profiles (10)
  insert into profiles (id, email, edu_domain, display_name, pronouns, year, major, photo_blurhash, verified) values
    ('33333333-3333-3333-3333-000000000001', 'ada@uchicago.edu',   'uchicago.edu', 'Ada Monroe',     'she/her',   '26', 'Economics',       'L5H2EC=PM+yV0g-mq.wG9c01JPRj', true),
    ('33333333-3333-3333-3333-000000000002', 'baz@uchicago.edu',   'uchicago.edu', 'Baz Al-Amin',    'he/him',    '25', 'Political Sci',   'LGF5?xYk^6#M@-5c,1J5@[or[Q6.', true),
    ('33333333-3333-3333-3333-000000000003', 'cal@uchicago.edu',   'uchicago.edu', 'Cal Brennan',    'he/him',    '27', 'Math',            'LIH;uFWB?w%2D*o#t7ay_4RiRijs', true),
    ('33333333-3333-3333-3333-000000000004', 'devi@uchicago.edu',  'uchicago.edu', 'Devi Krishnan',  'she/her',   '26', 'Statistics',      'LKO2?U%2Tw=w]~RBVZRi};RPxuwH', true),
    ('33333333-3333-3333-3333-000000000005', 'ezra@uchicago.edu',  'uchicago.edu', 'Ezra Cohen',     'he/him',    '28', 'Philosophy',      'LBD]Rs00^lxu_3WBt7WB00~qM{WB', true),
    ('33333333-3333-3333-3333-000000000006', 'flo@uchicago.edu',   'uchicago.edu', 'Flo Adeyemi',    'she/her',   'grad','Sociology',    'L~I#MXofofof~qofoffQofj[WBay', true),
    ('33333333-3333-3333-3333-000000000007', 'gem@uchicago.edu',   'uchicago.edu', 'Gem Yuen',       'they/them', '25', 'Art History',     'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true),
    ('33333333-3333-3333-3333-000000000008', 'hadi@uchicago.edu',  'uchicago.edu', 'Hadi Mansouri',  'he/him',    '26', 'Public Policy',   'LAHLh;of00ay~qWBt7j[ayRjM|fQ', true),
    ('33333333-3333-3333-3333-000000000009', 'iris@uchicago.edu',  'uchicago.edu', 'Iris Johansson', 'she/her',   '27', 'Linguistics',     'LJF~Qa00RjWB~qofRjj[j[ofWBj[', true),
    ('33333333-3333-3333-3333-000000000010', 'jay@uchicago.edu',   'uchicago.edu', 'Jay Park',       'he/him',    '25', 'CS',              'LDCi~Jxu~q%M?bayWBax9Ft7Rjof', true)
  on conflict do nothing;

end $$;
