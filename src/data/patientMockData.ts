export const DOCTORS = [
  {
    name: 'Dr. Anika Rahman',
    specialty: 'Allergies & Respiratory',
    qualifications: 'MD Homeopathy (BHMS, Gold Medalist)',
    regNo: '#HOM-4821',
    bio: 'Specialist in chronic respiratory conditions, severe allergic sinusitis, and constitutional homeopathic care with over 12 years of clinical practice.',
    exp: 12,
    rating: 4.9,
    reviews: 214,
    fee: 800,
    available: true,
    slots: ['09:00', '11:30', '14:00'],
    img: 'AR'
  },
  {
    name: 'Dr. Rahim Uddin',
    specialty: 'Digestive & IBS',
    qualifications: 'BHMS, MD (Homeo Gastro)',
    regNo: '#HOM-3910',
    bio: 'Focused on holistic gastrointestinal recovery, chronic acid reflux, IBS, and metabolic digestive disorders.',
    exp: 9,
    rating: 4.7,
    reviews: 156,
    fee: 700,
    available: true,
    slots: ['10:00', '13:30', '16:00'],
    img: 'RU'
  },
  {
    name: 'Dr. Reema Chowdhury',
    specialty: "Women's Health",
    qualifications: 'BHMS, FCMH (Gynecology)',
    regNo: '#HOM-5102',
    bio: 'Dedicated to women’s hormonal health, PCOS/PCOD management, and natural constitutional wellness care.',
    exp: 15,
    rating: 4.8,
    reviews: 302,
    fee: 900,
    available: false,
    slots: [],
    img: 'RC'
  },
  {
    name: 'Dr. Imran Shah',
    specialty: 'Skin & Dermatology',
    qualifications: 'BHMS, Dip. Homeopathic Dermatology',
    regNo: '#HOM-2891',
    bio: 'Expert in non-suppressive treatments for eczema, psoriasis, chronic acne, and allergic skin diseases.',
    exp: 7,
    rating: 4.6,
    reviews: 98,
    fee: 650,
    available: true,
    slots: ['09:30', '12:00'],
    img: 'IS'
  },
  {
    name: 'Dr. Shahida Shereen',
    specialty: 'Paediatrics',
    qualifications: 'BHMS, MD (Paediatric Homeopathy)',
    regNo: '#HOM-6019',
    bio: 'Gentle, safe, and holistic care for children, recurring childhood infections, and pediatric immunity boost.',
    exp: 11,
    rating: 4.8,
    reviews: 187,
    fee: 750,
    available: true,
    slots: ['10:30', '15:00', '17:00'],
    img: 'SS'
  },
  {
    name: 'Dr. Karim Khan',
    specialty: 'Joint & Arthritis',
    qualifications: 'BHMS, MD (Homeopathic Rheumatology)',
    regNo: '#HOM-1108',
    bio: 'Senior practitioner specializing in osteoarthritis, rheumatoid stiffness, and chronic musculoskeletal conditions.',
    exp: 18,
    rating: 4.9,
    reviews: 341,
    fee: 1000,
    available: false,
    slots: [],
    img: 'KK'
  },
]

export const APPOINTMENTS = [
  { id: 'APT-0031', doctor: 'Dr. Anika Rahman', specialty: 'Allergies & Respiratory', date: '16 Jul 2025', time: '09:00 AM', type: 'online',  status: 'upcoming', fee: 800,  paid: true  },
  { id: 'APT-0030', doctor: 'Dr. Rahim Uddin',   specialty: 'Digestive & IBS',         date: '7 Jul 2025',  time: '10:00 AM', type: 'in-person',status: 'completed',fee: 700,  paid: true  },
  { id: 'APT-0029', doctor: 'Dr. Anika Rahman', specialty: 'Allergies & Respiratory', date: '2 Jul 2025',  time: '09:00 AM', type: 'online',  status: 'completed',fee: 800,  paid: true  },
  { id: 'APT-0028', doctor: 'Dr. Reema Chowdhury',   specialty: 'Women\'s Health',          date: '19 Jun 2025', time: '11:00 AM', type: 'in-person',status: 'completed',fee: 900,  paid: true  },
]

export const PRESCRIPTIONS = [
  { id: 'RX-2025-0089', doctor: 'Dr. Anika Rahman', date: '2 Jul 2025',  diagnosis: 'Chronic Sinusitis',   medicines: 'Arsenicum Album 30C, Allium Cepa 6C',  status: 'active',    verified: true  },
  { id: 'RX-2025-0087', doctor: 'Dr. Anika Rahman', date: '15 Jun 2025', diagnosis: 'Allergic Rhinitis',   medicines: 'Natrum Muriaticum 30C, Sabadilla 6C',   status: 'completed', verified: true  },
  { id: 'RX-2025-0081', doctor: 'Dr. Rahim Uddin',   date: '3 Jun 2025',  diagnosis: 'IBS — Acute Episode', medicines: 'Lycopodium 30C, Nux Vomica 200C',        status: 'completed', verified: true  },
]

export const CHAT_HISTORY = [
  { role: 'ai',      text: "Hello, Raisa! I'm your HomeoAssist AI. I'm here to help you describe your symptoms before your appointment with Dr. Rahman. What's been troubling you?", time: '08:42' },
  { role: 'patient', text: "I've had a blocked nose for about 3 weeks. Started after a cold but it's not going away.", time: '08:43' },
  { role: 'ai',      text: "I understand — persistent post-viral congestion can be quite uncomfortable. Is the discharge watery or thick? Does one side feel more blocked than the other?", time: '08:43' },
  { role: 'patient', text: "Mostly watery and clear. Sometimes yellowish in the morning. Left side is worse.", time: '08:45' },
  { role: 'ai',      text: "Thank you. Does the congestion improve in warm environments or worsen in the cold? And do you notice it being worse at any particular time of day?", time: '08:46' },
  { role: 'patient', text: "Much worse in the morning and in cold air. Warm rooms definitely help.", time: '08:47' },
  { role: 'ai',      text: "Are you also experiencing sneezing, facial pressure around the nose or forehead, or any change in your sense of smell?", time: '08:48' },
  { role: 'patient', text: "Yes — lots of sneezing when I wake up, some pressure around my nose, and my sense of smell has dropped a lot.", time: '08:50' },
]

export const EXTRACTED_SYMPTOMS = [
  'Bilateral nasal congestion (left > right)',
  'Watery discharge, yellowish in morning',
  'Worse: cold air, morning on waking',
  'Better: warm environments',
  'Sneezing — predominantly on waking',
  'Frontal facial pressure',
  'Reduced olfaction',
]

export const ON_CALL_DOCTORS = [
  { name: 'Dr. Reema Chowdhury',  specialty: 'General', status: 'available', wait: '< 2 min' },
  { name: 'Dr. Imran Shah', specialty: 'General', status: 'available', wait: '< 5 min' },
  { name: 'Dr. Karim Khan',  specialty: 'General', status: 'busy',      wait: '~12 min' },
]