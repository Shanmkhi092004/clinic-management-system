import { renderMainSection } from '../ui/ui.js';

export function showMainSection(role) {
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
          <div style="display:flex;align-items:center;gap:1em;margin-bottom:8px;">
            <button id="current-patients-btn" style="background:#1976d2;color:#fff;">Current</button>
            <button id="older-patients-btn" style="background:#fff;color:#1976d2;border:1px solid #1976d2;">Older</button>
          </div>
          <h3 id="patients-list-title">Today's Patients</h3>
          <div id="patients-list" style="margin-bottom:1.5em;"></div>
        </div>
      </div>
    `;
  } else if (role === 'doctor') {
    html += `
      <div style="display:flex;align-items:center;gap:1em;margin-bottom:8px;">
  <button id="current-patients-btn" style="background:#1976d2;color:#fff;">Current</button>
  <button id="older-patients-btn" style="background:#fff;color:#1976d2;border:1px solid #1976d2;">Older</button>
      </div>
      <h3 id="patients-list-title">Today's Patients</h3>
      <div id="patients-list"></div>
    `;
  }
  setTimeout(() => {
    const currentBtn = document.getElementById('current-patients-btn');
    const olderBtn = document.getElementById('older-patients-btn');
    const listTitle = document.getElementById('patients-list-title');
    if (olderBtn && currentBtn && listTitle) {
      olderBtn.onclick = function() {
        olderBtn.style.background = '#1976d2';
        olderBtn.style.color = '#fff';
        olderBtn.style.border = 'none';
        currentBtn.style.background = '#fff';
        currentBtn.style.color = '#1976d2';
        currentBtn.style.border = '1px solid #1976d2';
        listTitle.textContent = "Older Patients";
        showOlderPatientsList();
      };
      currentBtn.onclick = function() {
        currentBtn.style.background = '#1976d2';
        currentBtn.style.color = '#fff';
        currentBtn.style.border = 'none';
        olderBtn.style.background = '#fff';
        olderBtn.style.color = '#1976d2';
        olderBtn.style.border = '1px solid #1976d2';
        listTitle.textContent = "Today's Patients";
        showPatientsList(false);
      };
    }
  }, 0);
window.showOlderPatientsModal = function(role) {
  let modal = document.getElementById('older-patients-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'older-patients-modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.zIndex = '1000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    let innerDiv = document.createElement('div');
    innerDiv.style.background = '#fff';
    innerDiv.style.padding = '24px 18px';
    innerDiv.style.borderRadius = '8px';
    innerDiv.style.minWidth = '260px';
    innerDiv.style.maxWidth = '400px';
    innerDiv.style.margin = '10vh auto';
    innerDiv.style.position = 'relative';
    innerDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    innerDiv.style.display = 'flex';
    innerDiv.style.flexDirection = 'column';
    innerDiv.style.alignItems = 'flex-end';
    const modalBody = document.createElement('div');
    modalBody.id = 'older-patients-modal-body';
    modalBody.style.width = '100%';
    modalBody.style.alignSelf = 'center';
    modalBody.style.paddingTop = '0';
    innerDiv.appendChild(modalBody);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.padding = '8px 28px';
    closeBtn.style.borderRadius = '5px';
    closeBtn.style.background = '#1976d2';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginTop = '18px';
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
    innerDiv.appendChild(closeBtn);
    modal.appendChild(innerDiv);
    document.body.appendChild(modal);
  }
  const modalBody = document.getElementById('older-patients-modal-body');
  const today = new Date().toISOString().slice(0, 10);
  modalBody.innerHTML = `
    <h3>View Patients by Date</h3>
    <input type="date" id="older-date-input" max="${today}" value="${today}" style="margin-bottom:12px;" />
    <button id="fetch-older-patients-btn" style="margin-bottom:12px;">Show Patients</button>
    <div id="older-patients-list"></div>
  `;
  document.getElementById('fetch-older-patients-btn').onclick = async function() {
    const date = document.getElementById('older-date-input').value;
    await showOlderPatientsList(date, role);
  };
  modal.style.display = 'block';
}

  renderMainSection(html);
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await window.auth.signOut();
      window.logAction('logout', {});
      document.getElementById('main-section').style.display = 'none';
      document.getElementById('main-section').innerHTML = '';
      document.getElementById('login-section').style.display = 'block';
    });
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
      showPatientsList();
    });
    showPatientsList();
  } else if (role === 'doctor') {
    showPatientsList(true);
  }
}

export async function showPatientsList(forDoctor = false) {
  console.log('Fetching and displaying patients list. For doctor:', forDoctor);
    const listDiv = document.getElementById('patients-list');
    if (!listDiv) {
      console.warn('patients-list element not found');
      return;
    }
  const today = new Date().toISOString().slice(0, 10);
  const snapshot = await window.db.collection('patients')
    .where('date', '==', today)
    .orderBy('token')
    .get();
  if (snapshot.empty) {
    listDiv.innerHTML = '<p>No patients found for today.</p>';
    return;
  }
  let html = `<table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f4f4f4;">
        <th style="border:1px solid #ccc;padding:8px;">Token</th>
        <th style="border:1px solid #ccc;padding:8px;">Name</th>
        <th style="border:1px solid #ccc;padding:8px;">Age</th>
        <th style="border:1px solid #ccc;padding:8px;">Gender</th>
        <th style="border:1px solid #ccc;padding:8px;">Total Amount</th>
        <th style="border:1px solid #ccc;padding:8px;">Prescription</th>
         <th style="border:1px solid #ccc;padding:8px;"></th>
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
    if (!forDoctor) {
      if (p.bill) {
        html += ` <button onclick=\"window.showBillForm && window.showBillForm('${docSnap.id}')\">Edit Bill</button>`;
      } else {
        html += ` <button onclick=\"window.showBillForm && window.showBillForm('${docSnap.id}')\">Bill</button>`;
      }
    }
    html += `</td>`;
    html += `</tr>`;
  });
  html += '</tbody></table>';
    listDiv.innerHTML = html;


window.showBillForm = function showBillForm(patientId) {
  const billModalDiv = document.getElementById('bill-modal');
  const billModalBody = document.getElementById('bill-modal-body');
  if (!billModalDiv || !billModalBody) {
    alert('Billing modal elements not found in the page.');
    return;
  }
  billModalDiv.style.display = 'block';
  billModalBody.innerHTML = '<div>Loading...</div>';
  window.db.collection('patients').doc(patientId).get().then(docSnap => {
    const p = docSnap.data();
    billModalBody.innerHTML = `
      <h3>Generate Bill for ${p.name} (Token #${p.token})</h3>
      <form id="bill-form" style="display:flex; flex-direction:column; gap:12px;">
        <input type="number" id="bill-amount" placeholder="Amount" required />
        <div style="display:flex; gap:12px; justify-content:center;">
          <button type="submit">Generate Bill</button>
          <button type="button" id="close-bill-modal" style="background:#888; color:#fff;">Close</button>
        </div>
      </form>
      <div id="bill-result"></div>
    `;
    document.getElementById('close-bill-modal').onclick = function() {
      document.getElementById('bill-modal').style.display = 'none';
    };
    document.getElementById('bill-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('bill-amount').value);
      await window.db.collection('patients').doc(patientId).update({ bill: amount });
  window.logAction('generate_bill', { token: p.token, amount });
  document.getElementById('bill-result').innerText = `Bill generated for token #${p.token}: ₹${amount}`;
  document.getElementById('bill-modal').style.display = 'none';
  showPatientsList();
    });
  });
}
}

async function showOlderPatientsList() {
  const listDiv = document.getElementById('patients-list');
    if (!listDiv) {
      console.warn('patients-list element not found');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
  const query = window.db.collection('patients')
    .where('date', '<', today)
    .orderBy('date', 'desc');
  const snapshot = await query.get();
  if (snapshot.empty) {
    listDiv.innerHTML = '<p>No older patients found.</p>';
    return;
  }
  const patientsByDate = {};
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    if (!patientsByDate[p.date]) patientsByDate[p.date] = [];
    patientsByDate[p.date].push({ ...p, id: docSnap.id });
  });
  let html = '';
  Object.keys(patientsByDate).forEach(date => {
    const patients = patientsByDate[date].sort((a, b) => a.token - b.token);
    html += `<h4 style='margin-top:1.5em;'>${date}</h4>`;
    html += `<table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f4f4f4;">
          <th style="border:1px solid #ccc;padding:8px;">Token</th>
          <th style="border:1px solid #ccc;padding:8px;">Name</th>
          <th style="border:1px solid #ccc;padding:8px;">Age</th>
          <th style="border:1px solid #ccc;padding:8px;">Gender</th>
          <th style="border:1px solid #ccc;padding:8px;">Total Amount</th>
          <th style="border:1px solid #ccc;padding:8px;">Prescription</th>
          <th style="border:1px solid #ccc;padding:8px;"></th>
        </tr>
      </thead>
      <tbody>`;
    patients.forEach(p => {
      html += `<tr class='patient-row' data-id='${p.id}'>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.token}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.name}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.age}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.gender}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.bill ? `₹${p.bill}` : ''}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">${p.prescription ? p.prescription : ''}</td>`;
      html += `<td style=\"border:1px solid #ccc;padding:8px;\">`;
      html += `<button onclick=\"window.viewHistory('${p.id}')\">View History</button>`;
      html += `</td>`;
      html += `</tr>`;
    });
    html += '</tbody></table>';
  });
  listDiv.innerHTML = html;
}
