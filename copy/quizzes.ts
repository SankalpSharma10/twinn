export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const quizzes: Record<string, QuizQuestion[]> = {
  study: [
    {
      id: 'study_location',
      question: 'Bhai, padhai kahan karni hai?',
      options: [
        { label: 'Library (Pin drop silence pls)', value: 'library_silent' },
        { label: 'Cafeteria (Thoda shor chalta hai)', value: 'cafeteria_noise' },
        { label: 'Hostel room (Apni vibe me)', value: 'room_solo' },
        { label: 'J6 stairs pe baith ke', value: 'stairs_casual' }
      ]
    },
    {
      id: 'study_style',
      question: 'Exam se ek raat pehle aapka scene kya hota hai?',
      options: [
        { label: 'Full panic, ratta maro', value: 'panic_cram' },
        { label: 'Chill, syllabus done hai boss', value: 'chill_prepared' },
        { label: 'Dost se samajh lenge subah', value: 'depend_friends' },
        { label: 'Main hi woh dost hoon jo padhata hai', value: 'the_tutor' }
      ]
    },
    {
      id: 'study_break',
      question: 'Break time! Kya chal raha hai?',
      options: [
        { label: 'Maggi aur chai tapri pe', value: 'maggi_chai' },
        { label: 'Reels scrolling endlessly', value: 'reels_doom' },
        { label: 'Power nap (jo 3 ghante ki ho gayi)', value: 'long_nap' },
        { label: 'Bahar gedi maar ke aate hain', value: 'walk_outside' }
      ]
    },
    {
      id: 'study_music',
      question: 'Padhte time background mein kya bajta hai?',
      options: [
        { label: 'Lofi beats to study/relax to', value: 'lofi_chill' },
        { label: 'Hardcore Punjabi/Rap to stay awake', value: 'hype_rap' },
        { label: 'Complete silence bro', value: 'silence' },
        { label: 'White noise / Rain sounds', value: 'white_noise' }
      ]
    },
    {
      id: 'study_goal',
      question: 'CGPA ka kya scene hai?',
      options: [
        { label: '9+ chahiye, full placement focus', value: 'high_cgpa' },
        { label: '8 tak theek hai, zyada load nahi', value: 'mid_cgpa' },
        { label: 'Bhai pass kara do bas', value: 'just_pass' },
        { label: 'Skills matter bro, marks don\'t', value: 'skills_over_marks' }
      ]
    }
  ],
  gym: [
    {
      id: 'gym_goal',
      question: 'Gym aane ka main motive kya hai bro?',
      options: [
        { label: 'Aesthetics (Summer body prep)', value: 'aesthetics' },
        { label: 'Strength (Powerlifting szn)', value: 'strength' },
        { label: 'Health / Cardio / Endurance', value: 'health_cardio' },
        { label: 'Bas breakup ka gussa nikalna hai', value: 'revenge_body' }
      ]
    },
    {
      id: 'gym_time',
      question: 'Workout ka time kab set hota hai?',
      options: [
        { label: 'Subah subah, empty gym vibes', value: 'morning_empty' },
        { label: 'Shaam ko, full bheed mein', value: 'evening_crowd' },
        { label: 'Late night stealth mode', value: 'late_night' },
        { label: 'Jab mood kare', value: 'random_time' }
      ]
    },
    {
      id: 'gym_music',
      question: 'Headphones mein kya baj raha hai set ke beech?',
      options: [
        { label: 'Phonk / Hardstyle', value: 'phonk_hard' },
        { label: 'Sidhu Moosewala on loop', value: 'punjabi_hype' },
        { label: 'Pop / Hip-hop vibes', value: 'pop_hiphop' },
        { label: 'Podcast sunta hoon (sigma grindset)', value: 'podcast_grind' }
      ]
    },
    {
      id: 'gym_split',
      question: 'Tera workout split kya hai?',
      options: [
        { label: 'Bro split (Chest day everyday)', value: 'bro_split' },
        { label: 'Push Pull Legs (The optimal way)', value: 'ppl' },
        { label: 'Upper / Lower', value: 'upper_lower' },
        { label: 'Full body circuit', value: 'full_body' }
      ]
    },
    {
      id: 'gym_partner',
      question: 'Gym partner kaisa chahiye?',
      options: [
        { label: 'Jo spot de aur motivate kare', value: 'spotter_hype' },
        { label: 'Silent killer, bas kaam pe focus', value: 'silent_focus' },
        { label: 'Form correct kare, knowledgeable ho', value: 'form_police' },
        { label: 'Mujhe akele hi theek lagta hai', value: 'solo_wolf' }
      ]
    }
  ],
  hackathon: [
    {
      id: 'hack_role',
      question: 'Team mein tera role kya hota hai bhai?',
      options: [
        { label: 'Frontend dev (UI/UX god)', value: 'frontend_god' },
        { label: 'Backend dev (API ninja)', value: 'backend_ninja' },
        { label: 'AI/ML Guy (ChatGPT wrapper)', value: 'ai_ml_guy' },
        { label: 'PPT aur Pitch sambhal lunga (The Talker)', value: 'pitch_guy' }
      ]
    },
    {
      id: 'hack_stack',
      question: 'Tech stack of choice?',
      options: [
        { label: 'MERN stack all the way', value: 'mern' },
        { label: 'Next.js + Supabase/Firebase', value: 'next_supa' },
        { label: 'Python / Django / FastApi', value: 'python_backend' },
        { label: 'Whatever works under pressure', value: 'anything_works' }
      ]
    },
    {
      id: 'hack_energy',
      question: '3 AM baj gaye hain, energy kaise maintain ho rahi hai?',
      options: [
        { label: 'Redbull aur Monster ka over-dose', value: 'energy_drinks' },
        { label: 'Chai / Coffee tapri wali', value: 'chai_coffee' },
        { label: 'Pure stress aur panic se', value: 'stress_panic' },
        { label: 'Power nap le raha hoon', value: 'power_nap' }
      ]
    },
    {
      id: 'hack_ide',
      question: 'VS Code theme kaunsi hai?',
      options: [
        { label: 'Dark mode (obviously)', value: 'dark_mode' },
        { label: 'Light mode (Psychopath behavior)', value: 'light_mode' },
        { label: 'High contrast neon hacker vibes', value: 'neon_hacker' },
        { label: 'Default pe hi chala raha hoon', value: 'default_theme' }
      ]
    },
    {
      id: 'hack_goal',
      question: 'Hackathon mein main aim kya hai?',
      options: [
        { label: 'Jeetna hai bhai, prize money chahiye', value: 'prize_money' },
        { label: 'Networking aur free swags', value: 'swags_networking' },
        { label: 'Resume me project add karna hai', value: 'resume_project' },
        { label: 'Maje karne aaye hain dost ke sath', value: 'just_fun' }
      ]
    }
  ]
};
