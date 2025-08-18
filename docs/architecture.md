# System Architecture - Clinic Management System

*Describe the overall system architecture, components, and wireframes here.*

## Overview
- Frontend: HTML, CSS, JS
- Backend: Firebase (Auth, Firestore)
- Hosting: Firebase Hosting


## Architecture Diagram

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

## Wireframes

### Receptionist Dashboard (Desktop)

```
-------------------------------------------------------------
|  Add Patient (left)   |   Today's Patients (right)         |
|-----------------------|------------------------------------|
| Name:  [__________]   |  | Token | Name | Age | ... |      |
| Age:   [__________]   |  |---------------------------------|
| Gender:[__________]   |  |  1    | ...  | ... | ... |      |
| [Add Patient]         |  |  2    | ...  | ... | ... |      |
-------------------------------------------------------------
```

### Doctor Dashboard (Desktop)

```
---------------------------------------------
|  Today's Patients                        |
|-------------------------------------------|
| Token | Name | Age | Status | Actions     |
|-------------------------------------------|
|  1    | ...  | ... | waiting| [Check]     |
|  2    | ...  | ... | checked| [Edit Rx]   |
---------------------------------------------
```

### Mobile Layout (Receptionist/Doctor)

```
-----------------------------
| Add Patient               |
|---------------------------|
| Name:  [__________]       |
| Age:   [__________]       |
| Gender:[__________]       |
| [Add Patient]             |
-----------------------------
| Today's Patients          |
|---------------------------|
| Token | Name | ...        |
|---------------------------|
|  1    | ...  | ...        |
|  2    | ...  | ...        |
-----------------------------
```

---
