export const PENDING_DOCTORS = [
  {
    name: 'Dr. Sameer Kapoor', initials: 'SK', qual: 'BHMS, MD (Homeopathy)',
    reg: 'UP-HOM-2847', specialty: 'Paediatric Homeopathy', exp: 6,
    city: 'Delhi, India', submitted: '9 Jul 2025', docs: true,
    note: 'Registered with Delhi Homeopathic Council. 6 years at Kapoor Wellness Clinic.',
  },
  {
    name: 'Dr. Nisha Pillai', initials: 'NP', qual: 'BHMS',
    reg: 'KA-HOM-1934', specialty: 'Dermatology & Skin', exp: 4,
    city: 'Bangalore, India', submitted: '10 Jul 2025', docs: true,
    note: 'Karnataka Medical Council registered. Specialises in chronic skin conditions.',
  },
  {
    name: 'Dr. Tanvir Ahmed', initials: 'TA', qual: 'MD (Homeopathy)',
    reg: 'MH-HOM-3621', specialty: 'General & Acute Homeopathy', exp: 8,
    city: 'Mumbai, India', submitted: '11 Jul 2025', docs: false,
    note: 'Documents partially uploaded. Certificate of practice pending.',
  },
]

export const VERIFIED_DOCTORS = [
  { name: 'Dr. Priya Sharma',  initials: 'PS', reg: 'HOM-4821', specialty: 'Allergies & Respiratory', exp: 12, patients: 247, joined: '15 Jan 2025', status: 'active'    },
  { name: 'Dr. Amit Joshi',    initials: 'AJ', reg: 'HOM-3614', specialty: 'Digestive & IBS',         exp: 9,  patients: 189, joined: '20 Feb 2025', status: 'active'    },
  { name: 'Dr. Leela Nair',    initials: 'LN', reg: 'HOM-5027', specialty: 'Women\'s Health',          exp: 15, patients: 312, joined: '8 Mar 2025',  status: 'active'    },
  { name: 'Dr. Rohan Mehta',   initials: 'RM', reg: 'HOM-2891', specialty: 'Skin & Dermatology',       exp: 7,  patients: 124, joined: '1 Apr 2025',  status: 'active'    },
  { name: 'Dr. Shalini Verma', initials: 'SV', reg: 'HOM-6102', specialty: 'Paediatrics',              exp: 11, patients: 201, joined: '12 May 2025', status: 'active'    },
  { name: 'Dr. Karan Bose',    initials: 'KB', reg: 'HOM-1743', specialty: 'Arthritis & Joints',       exp: 18, patients: 298, joined: '3 Jun 2025',  status: 'suspended' },
]

export const ALL_PATIENTS = [
  { name: 'Anjali Mehta',    initials: 'AM', id: 'P-00124', age: 34, gender: 'F', city: 'Mumbai',    plan: 'Pro',    joined: '3 Mar 2025',  visits: 8,  status: 'active'  },
  { name: 'Rajesh Kumar',    initials: 'RK', id: 'P-00118', age: 52, gender: 'M', city: 'Delhi',     plan: 'Basic',  joined: '18 Jan 2025', visits: 14, status: 'active'  },
  { name: 'Preethi Sharma',  initials: 'PS', id: 'P-00131', age: 28, gender: 'F', city: 'Chennai',   plan: 'Pro',    joined: '7 Apr 2025',  visits: 5,  status: 'active'  },
  { name: 'Suresh Nair',     initials: 'SN', id: 'P-00109', age: 45, gender: 'M', city: 'Kochi',     plan: 'Basic',  joined: '5 Dec 2024',  visits: 11, status: 'active'  },
  { name: 'Kavitha Reddy',   initials: 'KR', id: 'P-00142', age: 39, gender: 'F', city: 'Hyderabad', plan: 'Pro',    joined: '22 May 2025', visits: 7,  status: 'active'  },
  { name: 'Arjun Patel',     initials: 'AP', id: 'P-00088', age: 61, gender: 'M', city: 'Ahmedabad', plan: 'Clinic', joined: '2 Oct 2024',  visits: 22, status: 'active'  },
  { name: 'Meera Singh',     initials: 'MS', id: 'P-00149', age: 22, gender: 'F', city: 'Jaipur',    plan: 'Basic',  joined: '10 Jul 2025', visits: 2,  status: 'pending' },
  { name: 'Vikram Desai',    initials: 'VD', id: 'P-00096', age: 48, gender: 'M', city: 'Pune',      plan: 'Pro',    joined: '14 Nov 2024', visits: 9,  status: 'active'  },
]

export const COMPLAINTS = [
  {
    id: 'TKT-20250711-041', from: 'Dr. Priya Sharma',  role: 'doctor',  type: 'bug',
    priority: 'high',   status: 'in-review',
    subject: 'Medicine search extremely slow',
    message: 'The medicine search results take over 10 seconds to load when the connection is moderate. This delays consultations. Happens on Chrome desktop.',
    submitted: '11 Jul · 09:15 AM', adminNote: 'Escalated to engineering team. DB query optimisation in progress.',
  },
  {
    id: 'TKT-20250711-042', from: 'Anjali Mehta',     role: 'patient', type: 'bug',
    priority: 'medium', status: 'open',
    subject: 'AI chat history lost on refresh',
    message: 'When I refreshed the browser during an AI symptom chat, all my previous messages disappeared. I had to start over from scratch.',
    submitted: '11 Jul · 10:42 AM', adminNote: '',
  },
  {
    id: 'TKT-20250710-038', from: 'Dr. Amit Joshi',    role: 'doctor',  type: 'feature',
    priority: 'low',    status: 'open',
    subject: 'Voice notes in patient records',
    message: 'Would love to be able to record short voice notes during consultation instead of typing lengthy observations. Could save significant time.',
    submitted: '10 Jul · 04:30 PM', adminNote: '',
  },
  {
    id: 'TKT-20250709-034', from: 'Kavitha Reddy',    role: 'patient', type: 'bug',
    priority: 'high',   status: 'resolved',
    subject: 'Payment gateway timeout during booking',
    message: 'Payment timed out twice in a row while trying to book with Dr. Rohan Mehta. Amount was debited but booking was not confirmed. Very stressful.',
    submitted: '9 Jul · 02:18 PM', adminNote: 'Payment gateway issue fixed. Refund processed. Patient notified.',
  },
  {
    id: 'TKT-20250708-031', from: 'Arjun Patel',      role: 'patient', type: 'bug',
    priority: 'medium', status: 'in-review',
    subject: 'Prescription QR code fails to scan',
    message: 'The QR code on my prescription PDF does not scan on my older Android phone (Samsung A32). Tried three different scanning apps.',
    submitted: '8 Jul · 11:05 AM', adminNote: 'QR rendering issue on low DPI screens identified. Fix in next release.',
  },
  {
    id: 'TKT-20250707-028', from: 'Dr. Leela Nair',    role: 'doctor',  type: 'feedback',
    priority: 'low',    status: 'open',
    subject: 'AI summary — excellent feature!',
    message: 'The AI symptom summary is incredibly helpful before consultations. Would love to see a PDF export option for the summary to attach to physical records.',
    submitted: '7 Jul · 03:55 PM', adminNote: '',
  },
  {
    id: 'TKT-20250706-025', from: 'Meera Singh',       role: 'patient', type: 'feature',
    priority: 'low',    status: 'open',
    subject: 'Dark mode request',
    message: 'I often use the app late at night before sleep. A dark mode option would reduce eye strain significantly. Even a simple toggle would help.',
    submitted: '6 Jul · 09:40 PM', adminNote: '',
  },
  {
    id: 'TKT-20250705-022', from: 'Dr. Karan Bose',    role: 'doctor',  type: 'bug',
    priority: 'high',   status: 'resolved',
    subject: 'Double-booking conflict in scheduler',
    message: 'Two patients were booked at the same time slot (11:00 AM, 5 Jul) when my assistant and I were booking simultaneously from different devices.',
    submitted: '5 Jul · 12:30 PM', adminNote: 'Concurrency locking fix deployed. Scheduler now uses row-level locking.',
  },
]

export const PLANS = [
  { name: 'Basic',  price: 499,  subscribers: 312, revenue: 155688,  features: ['2 AI chats/month', 'Standard booking', 'Prescription access'] },
  { name: 'Pro',    price: 999,  subscribers: 487, revenue: 486513,  features: ['Unlimited AI chats', 'Priority booking', 'Emergency SOS', '20% off fees'] },
  { name: 'Clinic', price: 2499, subscribers: 28,  revenue: 69972,   features: ['Team access', 'Unlimited everything', 'Dedicated support', 'Analytics'] },
]

export const RECENT_PAYMENTS = [
  { patient: 'Preethi Sharma', plan: 'Pro',    amount: 999,  date: '11 Jul 2025', gateway: 'UPI' },
  { patient: 'Meera Singh',    plan: 'Basic',  amount: 499,  date: '10 Jul 2025', gateway: 'Card' },
  { patient: 'Vikram Desai',   plan: 'Pro',    amount: 999,  date: '10 Jul 2025', gateway: 'UPI' },
  { patient: 'Anjali Mehta',   plan: 'Pro',    amount: 999,  date: '1 Jul 2025',  gateway: 'Card' },
  { patient: 'Arjun Patel',    plan: 'Clinic', amount: 2499, date: '2 Jun 2025',  gateway: 'NEFT' },
]
