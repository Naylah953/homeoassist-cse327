export const PATIENTS = [
  { id: 1, name: 'Raisa Hossain',    age: 34, gender: 'F', condition: 'Chronic Sinusitis',        lastVisit: '2 Jul 2025',  nextVisit: '16 Jul 2025', status: 'active',   visits: 8  },
  { id: 2, name: 'Shourob Ahmed',    age: 52, gender: 'M', condition: 'Hypertension & Anxiety',   lastVisit: '5 Jul 2025',  nextVisit: '19 Jul 2025', status: 'active',   visits: 14 },
  { id: 3, name: 'Fahmida Akter',  age: 28, gender: 'F', condition: 'Hormonal Imbalance',       lastVisit: '7 Jul 2025',  nextVisit: '21 Jul 2025', status: 'active',   visits: 5  },
  { id: 4, name: 'Ratul Haque',     age: 45, gender: 'M', condition: 'Irritable Bowel Syndrome', lastVisit: '1 Jul 2025',  nextVisit: '15 Jul 2025', status: 'follow-up',visits: 11 },
  { id: 5, name: 'Farzana Ferdous',   age: 39, gender: 'F', condition: 'Eczema & Skin Allergy',    lastVisit: '8 Jul 2025',  nextVisit: '22 Jul 2025', status: 'active',   visits: 7  },
  { id: 6, name: 'Jihanur Hasan',     age: 61, gender: 'M', condition: 'Rheumatoid Arthritis',     lastVisit: '3 Jul 2025',  nextVisit: '17 Jul 2025', status: 'active',   visits: 22 },
  { id: 7, name: 'Jannatul Islam',     age: 22, gender: 'F', condition: 'Acne & Hormonal Imbalance',lastVisit: '9 Jul 2025',  nextVisit: '23 Jul 2025', status: 'new',      visits: 2  },
  { id: 8, name: 'Iktedar Alam',    age: 48, gender: 'M', condition: 'Migraine',                 lastVisit: '6 Jul 2025',  nextVisit: '20 Jul 2025', status: 'active',   visits: 9  },
]

export const SCHEDULE = [
  { time: '09:00', patient: 'Raisa Hossain',   condition: 'Follow-up: Sinusitis',         status: 'completed',  type: 'consultation' },
  { time: '09:45', patient: 'Shourob Ahmed',   condition: 'Hypertension review',          status: 'completed',  type: 'consultation' },
  { time: '10:30', patient: 'Fahmida Akter', condition: 'Hormonal profile discussion',  status: 'in-progress',type: 'new'          },
  { time: '11:15', patient: 'Jannatul Islam',    condition: 'Initial consultation',         status: 'upcoming',   type: 'new'          },
  { time: '12:00', patient: 'Ratul Haque',    condition: 'IBS follow-up',                status: 'upcoming',   type: 'consultation' },
  { time: '14:30', patient: 'Farzana Ferdous',  condition: 'Eczema — progress review',     status: 'upcoming',   type: 'consultation' },
  { time: '15:15', patient: 'Jihanur Hasan',    condition: 'Joint pain management',        status: 'upcoming',   type: 'consultation' },
  { time: '16:00', patient: 'Iktedar Alam',   condition: 'Migraine — new triggers',      status: 'upcoming',   type: 'consultation' },
]

export const MEDICINES = [
  {
    name: 'Arsenicum Album', potency: '30C', score: 92,
    indications: ['Burning pain relieved by warmth', 'Restlessness & anxiety', 'Watery nasal discharge', 'Worsens after midnight'],
    dosage: '4 pills, 3×/day · 14 days',
    note: 'Best for anxious, chilly patients with burning sensations'
  },
  {
    name: 'Nux Vomica', potency: '200C', score: 84,
    indications: ['Irritability & stress-related symptoms', 'Digestive disturbances', 'Oversensitivity', 'Worse in morning'],
    dosage: '4 pills, 2×/day · 7 days',
    note: 'Suited to type-A personalities, urban stress pattern'
  },
  {
    name: 'Lycopodium Clavatum', potency: '30C', score: 77,
    indications: ['Flatulence and bloating', 'Right-sided symptoms', 'Worse 4–8 PM', 'Low self-confidence'],
    dosage: '4 pills, 2×/day · 10 days',
    note: 'Deep-acting constitutional remedy for digestive axis'
  },
  {
    name: 'Pulsatilla Nigricans', potency: '30C', score: 71,
    indications: ['Symptoms change frequently', 'Thirstless despite dryness', 'Emotional, weeping', 'Better in open air'],
    dosage: '4 pills, 2×/day · 10 days',
    note: 'Particularly suited to women with hormonal complaints'
  },
  {
    name: 'Sulphur', potency: '30C', score: 65,
    indications: ['Burning heat in skin', 'Morning diarrhoea', 'Unhealthy-looking skin', 'Worse from bathing'],
    dosage: '4 pills, once/day · 14 days',
    note: 'Excellent for skin conditions and constitutional clearing'
  },
]

export const PRESCRIBED_PRESCRIPTIONS = [
  { id: 'RX-2025-0089', patient: 'Raisa Hossain',   date: '2 Jul 2025', medicines: 'Arsenicum Album 30C, Allium Cepa 6C',      status: 'dispensed', verified: true  },
  { id: 'RX-2025-0088', patient: 'Shourob Ahmed',   date: '5 Jul 2025', medicines: 'Nux Vomica 200C, Crataegus Q',             status: 'dispensed', verified: true  },
  { id: 'RX-2025-0087', patient: 'Fahmida Akter', date: '7 Jul 2025', medicines: 'Pulsatilla 30C, Sepia 200C',               status: 'active',    verified: true  },
  { id: 'RX-2025-0086', patient: 'Ratul Haque',    date: '1 Jul 2025', medicines: 'Lycopodium 30C, Carbo Veg 30C',            status: 'active',    verified: false },
  { id: 'RX-2025-0085', patient: 'Farzana Ferdous',  date: '8 Jul 2025', medicines: 'Sulphur 30C, Graphites 6C',                status: 'active',    verified: true  },
  { id: 'RX-2025-0084', patient: 'Jihanur Hasan',    date: '3 Jul 2025', medicines: 'Rhus Toxicodendron 200C, Bryonia 30C',     status: 'dispensed', verified: true  },
]

export const CHAT_MESSAGES = [
  { role: 'ai',      text: "Good morning! I'm the HomeoAssist AI. I'll help collect your symptoms before your consultation with Dr. Anika Rahman. Can you start by describing what's been bothering you?", time: '08:42' },
  { role: 'patient', text: "I've been having a blocked nose for about 3 weeks. It started as a cold but the congestion just won't go away.", time: '08:43' },
  { role: 'ai',      text: 'Thank you. Is the discharge watery, thick, or coloured? And does it affect one side of the nose more than the other?', time: '08:43' },
  { role: 'patient', text: 'Mostly watery and clear, sometimes a bit yellowish in the morning. Both sides are blocked but left is worse.', time: '08:45' },
  { role: 'ai',      text: 'Understood. Do you notice any change — better or worse — at a particular time of day, or in cold vs warm environments?', time: '08:45' },
  { role: 'patient', text: 'Definitely worse in cold air and in the morning. Warm rooms seem to help a bit.', time: '08:47' },
  { role: 'ai',      text: 'Are you experiencing any associated symptoms — sneezing, facial pressure, headache, or burning sensations?', time: '08:47' },
  { role: 'patient', text: "Yes, quite a bit of sneezing, especially in the morning. Some pressure around my nose and forehead. No headache though.", time: '08:49' },
  { role: 'ai',      text: 'How is your energy level and sleep? And have you noticed any change in your sense of smell or taste?', time: '08:49' },
  { role: 'patient', text: "Sleep is okay but I feel a bit tired in the afternoons. My smell is reduced — I can barely smell my food.", time: '08:51' },
]

export const PATIENT_EXTRACTED_SYMPTOMS = [
  'Nasal congestion — bilateral (left dominant)',
  'Watery clear discharge; yellowish in morning',
  'Worse: cold air, mornings on waking',
  'Better: warm environments',
  'Sneezing — particularly on waking',
  'Facial pressure — nasal and frontal sinuses',
  'Reduced sense of smell',
  'Afternoon fatigue',
]

export const EMERGENCY_CALLS = [
  { id: 'EC-004', patient: 'Iram Ahmed', time: '10:12', priority: 'high',   symptom: 'Severe chest tightness', status: 'routing',   doctor: 'Dr. Anika Rahman' },
  { id: 'EC-003', patient: 'Nazifa Neera',   time: '09:55', priority: 'medium', symptom: 'Acute anxiety attack',   status: 'connected', doctor: 'Dr. Rahim Uddin'  },
  { id: 'EC-002', patient: 'Nishat Taslima',     time: '09:30', priority: 'low',    symptom: 'Worsening skin rash',    status: 'resolved',  doctor: 'Dr. Anika Rahman' },
]
