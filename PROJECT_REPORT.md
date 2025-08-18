# Clinic Management System

## Project Overview
A web-based Clinic Management System designed to streamline patient registration, billing, and doctor-patient interactions. The application supports role-based access for receptionists and doctors, and is built using HTML, CSS, JavaScript, and Firebase (Firestore, Auth, Hosting).

## Features
- **User Authentication:** Secure login and registration using Firebase Auth.
- **Role-Based UI:** Receptionist and Doctor see different interfaces and features.
- **Add Patient:** Receptionist can add new patients with name, age, gender, and auto-generated token.
- **Patient List:** Receptionist and Doctor can view all patients for the day in a responsive table.
- **Billing:** Receptionist can generate bills for patients via a modal popup.
- **Patient History:** Both roles can view patient history in a modal popup.
- **Doctor Actions:** Doctor can check patients and add/edit prescriptions.
- **Logging:** All major actions are logged to Firestore for audit.
- **Responsive Design:** Works on both desktop and mobile browsers.

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Hosting:** Firebase Hosting

## Folder Structure
```
clinic_management_system/
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   ├── firebase.js
│   └── logger.js
├── .firebaserc
├── firebase.json
└── README.md
```

## Setup & Deployment
1. **Clone the repository** and navigate to the project folder.
2. **Firebase Setup:**
   - Create a Firebase project.
   - Enable Firestore and Authentication (Email/Password).
   - Update `firebase.js` with your Firebase config.
3. **Local Development:**
   - Use `firebase serve` to run locally.
4. **Deployment:**
   - Use `firebase deploy` to deploy to Firebase Hosting.

## Usage
- **Receptionist:**
  - Add new patients using the form on the left.
  - View all patients in a table on the right.
  - Click a patient row to generate a bill (modal popup).
- **Doctor:**
  - View today's patients.
  - Check patients and add/edit prescriptions.
  - View patient history.

## Security & Best Practices
- All sensitive operations require authentication.
- Firestore security rules should restrict access by user role.
- All actions are logged for traceability.

## Screenshots
> Add screenshots of the login page, receptionist dashboard, doctor dashboard, and modals here.

## Contributors
- [Your Name]

## License
This project is licensed under the MIT License.
