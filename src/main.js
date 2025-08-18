
// Main JS for Clinic Management System
// Handles login, registration, and role-based UI
document.addEventListener('DOMContentLoaded', function() {
  // Add modal for generating bill
  const billModalDiv = document.createElement('div');
  billModalDiv.id = 'bill-modal';
  billModalDiv.style.display = 'none';
  billModalDiv.style.position = 'fixed';
  billModalDiv.style.top = '0';
  billModalDiv.style.left = '0';
  billModalDiv.style.width = '100vw';
  billModalDiv.style.height = '100vh';
  billModalDiv.style.background = 'rgba(0,0,0,0.4)';
  billModalDiv.style.zIndex = '1001';
  billModalDiv.innerHTML = `
    <div id="bill-modal-content" style="background:#fff;max-width:400px;margin:10vh auto;padding:2em;border-radius:8px;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
      <button id="close-bill-modal" style="position:absolute;top:10px;right:10px;font-size:1.2em;">&times;</button>
      <div id="bill-modal-body"></div>
    </div>
  `;
  document.body.appendChild(billModalDiv);
  document.getElementById('close-bill-modal').onclick = function() {
    billModalDiv.style.display = 'none';
  };
  // Add modal for viewing history
  const modalDiv = document.createElement('div');
  modalDiv.id = 'history-modal';
  modalDiv.style.display = 'none';
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100vw';
  modalDiv.style.height = '100vh';
  modalDiv.style.background = 'rgba(0,0,0,0.4)';
  modalDiv.style.zIndex = '1000';
  modalDiv.innerHTML = `
    <div id="history-modal-content" style="background:#fff;max-width:400px;margin:10vh auto;padding:2em;border-radius:8px;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
      <button id="close-history-modal" style="position:absolute;top:10px;right:10px;font-size:1.2em;">&times;</button>
      <div id="history-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modalDiv);
  document.getElementById('close-history-modal').onclick = function() {
    modalDiv.style.display = 'none';
  };
  // Get error message divs
  const loginErrorDiv = document.getElementById('login-error-message');

  document.getElementById('login-form').addEventListener('submit', async (e) => {
  // Hide error on login attempt
  if (loginErrorDiv) loginErrorDiv.style.display = 'none';
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    try {
      const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
      window.logAction('login', { email, role });
      // Do not call showMainSection here; let onAuthStateChanged handle UI
    } catch (err) {
      alert('Login failed: ' + err.message);
      window.logAction('login_failed', { email, role, error: err.message });
    }
  });

  // Show registration form when Register is clicked
  document.getElementById('register-btn').addEventListener('click', () => {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
  });

  // Back to login from registration
  document.getElementById('back-to-login').addEventListener('click', () => {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  });

  // Handle registration form submit
  document.getElementById('register-form').addEventListener('submit', async (e) => {
  // Hide error on register attempt
  if (loginErrorDiv) loginErrorDiv.style.display = 'none';
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    if (email && password && (role === 'doctor' || role === 'receptionist')) {
      try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        await window.db.collection('users').doc(userCredential.user.uid).set({ email, role });
        window.logAction('register', { email, role });
        // alert('Registration successful!');
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
      } catch (err) {
        alert('Registration failed: ' + err.message);
        window.logAction('register_failed', { email, role, error: err.message });
      }
    } else {
      alert('Invalid registration details.');
    }
  });

  // Listen for auth state changes to handle logout and login UI
  window.auth.onAuthStateChanged(async (user) => {
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-section');
    // Always hide main section and show login by default
    mainSection.style.display = 'none';
    mainSection.innerHTML = '';
    loginSection.style.display = 'block';

    if (user) {
      // Get user role from Firestore
      const userDocRef = window.db.collection('users').doc(user.uid);
      let userDoc;
      try {
        userDoc = await userDocRef.get();
      } catch (err) {
        console.error('Error fetching user doc:', err);
        return;
      }
      console.log('Firestore userDoc.exists:', userDoc.exists);
      if (userDoc.exists) {
        console.log('Firestore userDoc.data():', userDoc.data());
        let role = userDoc.data().role;
        console.log('Detected role:', role);
        if (!role) {
          // Prompt for role if missing
          role = prompt('Your role is missing. Please enter your role (doctor or receptionist):');
          if (role && (role === 'doctor' || role === 'receptionist')) {
            await userDocRef.set({ ...userDoc.data(), role }, { merge: true });
            window.logAction('role_updated', { email: user.email, role });
            console.log('Role updated in Firestore:', role);
          } else {
            alert('Invalid role. Logging out.');
            await window.auth.signOut();
            return;
          }
        }
        // Only show main section if role is valid
        if (role === 'doctor' || role === 'receptionist') {
          showMainSection(role);
          loginSection.style.display = 'none';
          mainSection.style.display = 'block';
        } else {
          // If role is not valid, stay on login page
          await window.auth.signOut();
        }
      } else {
        // If userDoc does not exist, show error below login/register
        if (loginErrorDiv) {
          loginErrorDiv.innerText = 'Details not found, please register.';
          loginErrorDiv.style.display = 'block';
        }
        loginSection.style.display = 'block';
        mainSection.style.display = 'none';
        mainSection.innerHTML = '';
        await window.auth.signOut();
      }
    }
  });

});

function showMainSection(role) {
  document.getElementById('login-section').style.display = 'none';
  const main = document.getElementById('main-section');
  main.style.display = 'block';
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <button id="logout-btn">Logout</button>
    </div>
  `;
  if (role === 'receptionist') {
    html += `
      <div style="display:flex;gap:2em;align-items:flex-start;width:100vw;padding:0 2vw 0 2vw;box-sizing:border-box;">
        <div style="flex:1;min-width:260px;">
          <h3>Add New Patient</h3>
          <form id="add-patient-form">
            <input type="text" id="patient-name" placeholder="Patient Name" required />
            <input type="number" id="patient-age" placeholder="Age" required />
            <input type="text" id="patient-gender" placeholder="Gender" required />
            <button type="submit">Add Patient</button>
          </form>
        </div>
        <div style="flex:2;min-width:340px;">
          <h3>Today's Patients</h3>
          <div id="patients-list" style="margin-bottom:1.5em;"></div>
        </div>
      </div>
    `;
  } else if (role === 'doctor') {
    html += `
      <h3>Today's Patients</h3>
      <div id="patients-list"></div>
    `;
  }
  main.innerHTML = html;

  // Attach logout event listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('Attaching logout event listener');
    logoutBtn.addEventListener('click', async () => {
      console.log('Logout clicked');
      await window.auth.signOut();
      window.logAction('logout', {});
      document.getElementById('main-section').style.display = 'none';
      document.getElementById('main-section').innerHTML = '';
      document.getElementById('login-section').style.display = 'block';
    });
  } else {
    console.error('Logout button not found when trying to attach event listener');
  }

  if (role === 'receptionist') {
    document.getElementById('add-patient-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value;
      const age = document.getElementById('patient-age').value;
      const gender = document.getElementById('patient-gender').value;
      const today = new Date().toISOString().slice(0, 10);
      const snapshot = await window.db.collection('patients')
        .where('date', '==', today)
        .orderBy('token', 'desc')
        .limit(1)
        .get();
      let token = 1;
      if (!snapshot.empty) {
        token = snapshot.docs[0].data().token + 1;
      }
      const patient = { name, age, gender, token, date: today, status: 'waiting', history: [] };
      await window.db.collection('patients').add(patient);
      window.logAction('add_patient', { name, age, gender, token });
    //   alert(`Patient added with token #${token}`);
      showPatientsList();
    });
    // Always show patient list on load
    showPatientsList();
  } else if (role === 'doctor') {
    showPatientsList(true);
  }
}

async function showPatientsList(forDoctor = false) {
  const today = new Date().toISOString().slice(0, 10);
  const snapshot = await window.db.collection('patients')
    .where('date', '==', today)
    .orderBy('token')
    .get();
  const listDiv = document.getElementById('patients-list');
  if (snapshot.empty) {
    listDiv.innerHTML = '<p>No patients yet.</p>';
    return;
  }
  let html = `<table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f4f4f4;">
        <th style="border:1px solid #ccc;padding:8px;">Token</th>
        <th style="border:1px solid #ccc;padding:8px;">Name</th>
        <th style="border:1px solid #ccc;padding:8px;">Age</th>
        <th style="border:1px solid #ccc;padding:8px;">Gender</th>
        <th style="border:1px solid #ccc;padding:8px;">Bill</th>
        <th style="border:1px solid #ccc;padding:8px;">Prescription</th>
        <th style="border:1px solid #ccc;padding:8px;">Actions</th>
      </tr>
    </thead>
    <tbody>`;
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    html += `<tr class='patient-row' data-id='${docSnap.id}'>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.token}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.name}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.age}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.gender}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.bill ? `₹${p.bill}` : ''}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">${p.prescription ? p.prescription : ''}</td>`;
    html += `<td style="border:1px solid #ccc;padding:8px;">`;
    if (forDoctor && p.status === 'waiting') {
      html += `<button onclick=\"window.handleCheckPatient('${docSnap.id}')\">Check</button> `;
    }
    if (forDoctor && p.prescription) {
      html += `<button onclick=\"window.editPrescription('${docSnap.id}')\">Edit Prescription</button> `;
    }
    html += `<button onclick=\"window.viewHistory('${docSnap.id}')\">View History</button>`;
    html += `</td>`;
    html += `</tr>`;
  });
// Doctor: Edit prescription for a patient
window.editPrescription = async function(patientId) {
  const patientRef = window.db.collection('patients').doc(patientId);
  const patientSnap = await patientRef.get();
  const patient = patientSnap.data();
  const newPrescription = prompt('Edit prescription:', patient.prescription || '');
  if (newPrescription === null) return;
  await patientRef.update({
    prescription: newPrescription,
    history: (patient.history || []).concat({ date: new Date().toISOString(), prescription: newPrescription })
  });
  window.logAction('edit_prescription', { patient: patient.name, newPrescription });
//   alert('Prescription updated!');
  showPatientsList(true);
}
  html += '</tbody></table>';
  listDiv.innerHTML = html;

  // Receptionist: add click event to patient rows to show bill form
  if (!forDoctor) {
    const rows = listDiv.querySelectorAll('.patient-row');
    rows.forEach(row => {
      row.addEventListener('click', function(e) {
        // Prevent triggering on action button clicks
        if (e.target.tagName === 'BUTTON') return;
        const patientId = row.getAttribute('data-id');
        showBillForm(patientId);
      });
    });
  }

// Receptionist: Show bill form for selected patient
function showBillForm(patientId) {
  const billModalDiv = document.getElementById('bill-modal');
  const billModalBody = document.getElementById('bill-modal-body');
  billModalDiv.style.display = 'block';
  billModalBody.innerHTML = '<div>Loading...</div>';
  window.db.collection('patients').doc(patientId).get().then(docSnap => {
    const p = docSnap.data();
    billModalBody.innerHTML = `
      <h3>Generate Bill for ${p.name} (Token #${p.token})</h3>
      <form id="bill-form">
        <input type="number" id="bill-amount" placeholder="Amount" required />
        <button type="submit">Generate Bill</button>
      </form>
      <div id="bill-result"></div>
    `;
    document.getElementById('bill-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('bill-amount').value);
      await window.db.collection('patients').doc(patientId).update({ bill: amount });
      window.logAction('generate_bill', { token: p.token, amount });
      document.getElementById('bill-result').innerText = `Bill generated for token #${p.token}: ₹${amount}`;
      // Close the modal after bill is generated
      document.getElementById('bill-modal').style.display = 'none';
      // Optionally, refresh the patient list
      showPatientsList();
    });
  });
}
}

// View patient history
window.viewHistory = async function(patientId) {
  const patientRef = window.db.collection('patients').doc(patientId);
  const patientSnap = await patientRef.get();
  const patient = patientSnap.data();
  let historyHtml = `<h3>History for ${patient.name} (Token #${patient.token})</h3><ul style='padding-left:1.2em;'>`;
  if (patient.history && patient.history.length > 0) {
    patient.history.forEach(h => {
      historyHtml += `<li><b>${h.date.split('T')[0]}</b>: ${h.prescription}</li>`;
    });
  } else {
    historyHtml += '<li>No history found.</li>';
  }
  historyHtml += '</ul>';
  const modalBody = document.getElementById('history-modal-body');
  modalBody.innerHTML = historyHtml;
  document.getElementById('history-modal').style.display = 'block';
}

// Doctor checks patient and adds prescription
window.handleCheckPatient = async function(patientId) {
  const prescription = prompt('Enter prescription:');
  if (!prescription) return;
  const patientRef = window.db.collection('patients').doc(patientId);
  const patientSnap = await patientRef.get();
  const patient = patientSnap.data();
  // Update prescription and history array
  await patientRef.update({
    prescription,
    status: 'checked',
    history: (patient.history || []).concat({ date: new Date().toISOString(), prescription })
  });
  logAction('add_prescription', { patient: patient.name, prescription });
//   alert('Prescription added!');
  showPatientsList(true);
}