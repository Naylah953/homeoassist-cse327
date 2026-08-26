# HomeoAssist — Backend API

Node.js + Express + PostgreSQL REST API.

---

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
copy .env.example .env
```
Edit `.env` with your PostgreSQL credentials.

### 3. Create the database
```bash
psql -U postgres -c "CREATE DATABASE homeoassist;"
```

### 4. Run schema (creates all tables)
```bash
psql -U postgres -d homeoassist -f schema.sql
```

### 5. Seed data (medicines, rubrics, doctors, admin, patients)
```bash
npm run migrate
```
Or seed medicines/rubrics directly via SQL:
```bash
psql -U postgres -d homeoassist -f medicines_seed.sql
psql -U postgres -d homeoassist -f rubrics_seed.sql
```

### 6. Start the server
```bash
npm run dev       # development (nodemon)
npm start         # production
```
Server runs on **http://localhost:5000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (role: admin/doctor/patient) |
| POST | `/api/auth/register/patient` | Register patient |
| POST | `/api/auth/register/doctor` | Register doctor |
| GET  | `/api/auth/me` | Get current user from token |

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | List all (search, featured, page, limit) |
| GET | `/api/medicines/:id` | Get single medicine |
| POST | `/api/medicines` | Add medicine (admin) |
| PATCH | `/api/medicines/:id` | Update medicine (admin) |
| DELETE | `/api/medicines/:id` | Delete medicine (admin) |

### Symptom Rubrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rubrics` | List all 38 rubric categories |
| GET | `/api/rubrics/:id` | Get single rubric |
| POST | `/api/rubrics` | Add rubric (admin) |
| PATCH | `/api/rubrics/:id` | Update rubric (admin) |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List verified doctors (search, specialty, available) |
| GET | `/api/doctors/:id` | Get doctor profile |
| PATCH | `/api/doctors/:id` | Update own profile (doctor/admin) |
| PATCH | `/api/doctors/:id/password` | Change password |
| PATCH | `/api/doctors/:id/verify` | Verify doctor (admin) |
| DELETE | `/api/doctors/:id` | Delete doctor (admin) |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients (admin) |
| GET | `/api/patients/:id` | Get patient profile |
| PATCH | `/api/patients/:id` | Update profile |
| PATCH | `/api/patients/:id/password` | Change password |
| DELETE | `/api/patients/:id` | Delete patient (admin) |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List (filtered by role automatically) |
| GET | `/api/appointments/:id` | Get single appointment |
| POST | `/api/appointments` | Book appointment (patient/admin) |
| PATCH | `/api/appointments/:id/status` | Update status |
| PATCH | `/api/appointments/:id/pay` | Mark as paid |
| DELETE | `/api/appointments/:id` | Delete (admin) |

### Prescriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prescriptions` | List with medicines (filtered by role) |
| GET | `/api/prescriptions/:id` | Get full prescription |
| POST | `/api/prescriptions` | Create prescription (doctor/admin) |
| PATCH | `/api/prescriptions/:id/status` | Update status |
| DELETE | `/api/prescriptions/:id` | Delete (admin) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | List (admin sees all; users see own) |
| GET | `/api/complaints/:id` | Get single complaint |
| POST | `/api/complaints` | File a complaint |
| PATCH | `/api/complaints/:id/status` | Update status (admin) |
| DELETE | `/api/complaints/:id` | Delete (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/revenue` | Monthly revenue breakdown |
| GET | `/api/admin/doctors` | All doctors including unverified |
| GET | `/api/admin/profile` | Admin profile |
| PATCH | `/api/admin/profile` | Update admin profile |
| PATCH | `/api/admin/password` | Change admin password |

---

## Default Credentials (after migration)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@homeoassist.com | admin123 |
| Doctor | anika@homeoassist.com | doctor123 |
| Patient | raisa@email.com | patient123 |

---

## Authentication

All protected routes require:
```
Authorization: Bearer <token>
```
Token is returned on login/register.
