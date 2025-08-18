# Low Level Design (LLD) - Clinic Management System

*Describe the detailed design of each module, data flow, and interactions here.*

## Modules
- Authentication (Doctor, Receptionist)
- Token Management
- Patient Management
- Prescription Management
- Billing
- Logging


## Sequence Diagrams

### 1. Login Flow
```mermaid
sequenceDiagram
	participant User
	participant UI
	participant FirebaseAuth
	User->>UI: Enter email, password, role
	UI->>FirebaseAuth: signInWithEmailAndPassword()
	FirebaseAuth-->>UI: Auth result
	UI->>UI: Show dashboard based on role
```

### 2. Add Patient (Receptionist)
```mermaid
sequenceDiagram
	participant Receptionist
	participant UI
	participant Firestore
	Receptionist->>UI: Fill patient form
	UI->>Firestore: Add patient document
	Firestore-->>UI: Success/Fail
	UI->>UI: Show updated patient list
```

### 3. Generate Bill (Receptionist)
```mermaid
sequenceDiagram
	participant Receptionist
	participant UI
	participant Firestore
	Receptionist->>UI: Select patient row
	UI->>UI: Show bill modal
	Receptionist->>UI: Enter amount, submit
	UI->>Firestore: Update patient bill
	Firestore-->>UI: Success/Fail
	UI->>UI: Refresh patient list
```

### 4. Add/Edit Prescription (Doctor)
```mermaid
sequenceDiagram
	participant Doctor
	participant UI
	participant Firestore
	Doctor->>UI: Select patient, enter prescription
	UI->>Firestore: Update patient doc (prescription, history)
	Firestore-->>UI: Success/Fail
	UI->>UI: Refresh patient list
```

## Class Diagrams

```mermaid
classDiagram
	class User {
		string uid
		string email
		string role
	}
	class Patient {
		string id
		string name
		int age
		string gender
		int token
		string date
		string status
		string prescription
		float bill
		History[] history
	}
	class History {
		string date
		string prescription
	}
	class LogEntry {
		string action
		object details
		string timestamp
		string user
	}
	User <|-- Receptionist
	User <|-- Doctor
	Patient "1" o-- "*" History
```

## Detailed Logic

### Authentication
- Uses Firebase Auth (email/password)
- On login/register, user role is checked from Firestore `users` collection
- UI updates based on role (doctor or receptionist)

### Token Management
- Each patient gets a unique token for the day
- Token = max(token) for today + 1

### Patient Management
- Receptionist adds patient (name, age, gender)
- Patient is stored in Firestore with token, date, status, and empty history
- Patient list is shown in a table, updated in real time after add

### Prescription Management
- Doctor can check a patient and add a prescription
- Doctor can edit prescription for any patient
- Each prescription is appended to the patient's history array

### Billing
- Receptionist selects a patient row to open bill modal
- Enters amount, which updates the patient's `bill` field in Firestore
- Bill info is shown in the patient list

### Logging
- All actions (login, add patient, bill, prescription, etc.) are logged to Firestore `logs` collection
- Log includes action, details, timestamp, and user
