# HomeoAssist - Testing 

## Frontend Integration

- Integrated the frontend authentication service with the backend API.
- Updated `AuthService.ts` for backend authentication.
- Added `AuthService.mock.ts` for authentication-related development/testing.
- Integrated the patient doctor-search functionality with the backend.
- Updated `FindDoctorsView.tsx` to retrieve and display doctors through the backend.

## Backend Testing and Verification

I performed systematic testing of the HomeoAssist backend APIs and database-related functionality using PowerShell, REST API requests, Node.js scripts, and PostgreSQL queries.

Testing included:

- Authentication and login verification.
- Admin login verification.
- Patient authentication/password verification.
- Admin password verification and reset.
- Database column and schema verification.
- Appointment API testing.
- Appointment booking and status-update testing.
- Payment-related appointment testing.
- Patient ownership and authorization checks.
- Doctor-specific access checks.
- Admin deletion/management checks.
- Prescription API testing and verification.
- Database record verification.

## Testing Scripts Added

The following scripts were added to document and support backend testing and verification:

- `Backend/check-columns.js`
- `Backend/checkAdmin.js`
- `Backend/check_admin_password.js`
- `Backend/check_patient_password.js`
- `Backend/reset-admin.js`
- `Backend/testAdminLogin.js`

## Testing Approach

The backend was tested by running the server locally and sending API requests with different user roles and test data. Database queries were also used to verify that API operations produced the expected database records and that authorization rules were functioning correctly.

## Issues Identified During Testing

During testing, several issues were investigated and resolved or documented, including authentication credential problems, password verification, database data verification, and access-control behavior.

A review-system endpoint/table was also found to be absent from the available backend implementation, so review testing was not claimed as completed.

The backend testing scripts and this document provide additional evidence of the testing and verification work performed for the project.
