
# Project Report - Clinic Management System

## Introduction
The Clinic Management System is a web-based application designed to streamline the daily operations of a clinic. It provides an easy-to-use interface for receptionists and doctors to manage patient registration, billing, and medical records, while ensuring secure access and data integrity using Firebase services.

## Problem Statement
Traditional clinics often rely on manual processes for patient registration, token management, billing, and prescription handling. This leads to inefficiencies, errors, and lack of real-time data access. There is a need for a digital solution that automates these workflows, supports role-based access, and provides a responsive experience on both desktop and mobile devices.

## Solution Design
The solution is a single-page web application with:
- **Role-based authentication** (doctor, receptionist) using Firebase Auth.
- **Patient management**: Receptionists can add new patients, view all patients, and generate bills.
- **Token management**: Each patient is assigned a unique token for the day.
- **Prescription management**: Doctors can check patients, add/edit prescriptions, and view patient history.
- **Billing**: Receptionists can generate bills for patients via a modal popup.
- **Logging**: All actions are logged to Firestore for audit and traceability.
- **Responsive UI**: The layout adapts for both desktop and mobile browsers.

## System Architecture
The system uses a serverless architecture with the following components:

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

### Architecture Diagram
```mermaid
flowchart TD
	User[User (Doctor/Receptionist)]
	Browser[Web Browser]
	Frontend[HTML/CSS/JS (Frontend)]
	FirebaseAuth[Firebase Auth]
	Firestore[Firebase Firestore]
	Hosting[Firebase Hosting]

	User -->|HTTP/HTTPS| Browser
	Browser -->|UI| Frontend
	Frontend -->|Auth API| FirebaseAuth
	Frontend -->|Data API| Firestore
	Frontend -->|Static Files| Hosting
	FirebaseAuth <--> Firestore
```

## Optimization
- **UI Responsiveness**: Uses CSS flexbox and media queries for mobile/desktop layouts.
- **Efficient Data Access**: Firestore queries are indexed and optimized for daily patient lists.
- **Minimal Reloads**: Most UI updates are dynamic, reducing page reloads and improving user experience.
- **Security**: Firestore security rules restrict access by user role and authentication state.

## Test Cases
| Test Case | Steps | Expected Result |
|-----------|-------|----------------|
| Login as Receptionist | Enter valid credentials | Receptionist dashboard loads |
| Add Patient | Fill form, submit | Patient appears in list with new token |
| Generate Bill | Click patient row, enter amount | Bill is saved and shown in table |
| Login as Doctor | Enter valid credentials | Doctor dashboard loads |
| Add/Edit Prescription | Check patient, enter/edit prescription | Prescription saved and shown |
| View History | Click 'View History' | Modal shows patient history |
| Responsive UI | Resize browser or use mobile | Layout adapts, all features usable |

## Conclusion
The Clinic Management System successfully digitizes and streamlines clinic workflows, reducing manual errors and improving efficiency. The use of Firebase ensures scalability, security, and real-time data access. The responsive design makes the system accessible on any device, supporting both staff and patient needs.
