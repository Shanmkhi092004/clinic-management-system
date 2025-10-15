export function showBillingAdvice() {
  const advice = 'Billing advice: The system generates a bill for you based on the secretary\'s request.';
  const modalBody = document.getElementById('billing-advice-modal-body');
  const modal = document.getElementById('billing-advice-modal');
  if (modalBody && modal) {
    modalBody.innerText = advice;
    modal.style.display = 'block';
  } else {
    alert(advice);
  }
}

export async function viewHistory(patientId) {
  const patientRef = window.db.collection('patients').doc(patientId);
  const patientSnap = await patientRef.get();
  const patient = patientSnap.data();
  let historyHtml = `<h3>History for ${patient.name} (Token #${patient.token})</h3>`;
  if (patient.history && patient.history.length > 0) {
    historyHtml += "<ul style='padding-left:1.2em;'>";
    patient.history.forEach(h => {
      historyHtml += `<li><b>${h.date.split('T')[0]}</b>: ${h.prescription}</li>`;
    });
    historyHtml += '</ul>';
  } else {
    historyHtml += '<div>No history found.</div>';
  }
  let modalBody = document.getElementById('history-modal-body');
  let modal = document.getElementById('history-modal');
  if (!modalBody || !modal) {
    let modalDiv = document.createElement('div');
    modalDiv.id = 'history-modal';
    modalDiv.style.display = 'block';
    modalDiv.style.position = 'fixed';
    modalDiv.style.top = '0';
    modalDiv.style.left = '0';
    modalDiv.style.width = '100vw';
    modalDiv.style.height = '100vh';
    modalDiv.style.background = 'rgba(0,0,0,0.4)';
    modalDiv.style.zIndex = '1000';
    modalDiv.style.alignItems = 'center';
    modalDiv.style.justifyContent = 'center';
    let innerDiv = document.createElement('div');
    innerDiv.style.background = '#fff';
    innerDiv.style.padding = '24px 18px';
    innerDiv.style.borderRadius = '8px';
    innerDiv.style.minWidth = '220px';
    innerDiv.style.maxWidth = '340px';
    innerDiv.style.margin = '10vh auto';
    innerDiv.style.position = 'relative';
    innerDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    innerDiv.style.display = 'flex';
    innerDiv.style.flexDirection = 'column';
    innerDiv.style.alignItems = 'flex-end';
    modalBody = document.createElement('div');
    modalBody.id = 'history-modal-body';
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
      modalDiv.style.display = 'none';
    };
    innerDiv.appendChild(closeBtn);
    modalDiv.appendChild(innerDiv);
    document.body.appendChild(modalDiv);
    modal = modalDiv;
  }
  modalBody.innerHTML = historyHtml;
  modal.style.display = 'block';
}

export async function handleCheckPatient(patientId) {
  let modal = document.getElementById('prescription-modal');
  let modalBody = document.getElementById('prescription-modal-body');
  if (!modal || !modalBody) {
    modal = document.createElement('div');
    modal.id = 'prescription-modal';
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
    innerDiv.style.minWidth = '220px';
    innerDiv.style.maxWidth = '340px';
    innerDiv.style.margin = '10vh auto';
    innerDiv.style.position = 'relative';
    innerDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    innerDiv.style.display = 'flex';
    innerDiv.style.flexDirection = 'column';
    innerDiv.style.alignItems = 'flex-end';
    modalBody = document.createElement('div');
    modalBody.id = 'prescription-modal-body';
    modalBody.style.width = '100%';
    modalBody.style.alignSelf = 'center';
    modalBody.style.paddingTop = '0';
    innerDiv.appendChild(modalBody);
    modal.appendChild(innerDiv);
    document.body.appendChild(modal);
  }
  modalBody.innerHTML = `
    <h3>Enter Prescription</h3>
    <form id="prescription-form" style="display:flex; flex-direction:column; gap:12px;">
      <textarea id="prescription-input" placeholder="Enter prescription..." required style="min-height:60px;resize:vertical;"></textarea>
      <div style="display:flex; gap:12px; justify-content:center;">
        <button type="submit">Save</button>
        <button type="button" id="close-prescription-modal" style="background:#888; color:#fff;">Close</button>
      </div>
    </form>
    <div id="prescription-result"></div>
  `;
  modal.style.display = 'block';
  const closeBtn = document.getElementById('close-prescription-modal');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  document.getElementById('prescription-form').onsubmit = async function(e) {
    e.preventDefault();
    const prescription = document.getElementById('prescription-input').value.trim();
    if (!prescription) return;
    const patientRef = window.db.collection('patients').doc(patientId);
    const patientSnap = await patientRef.get();
    const patient = patientSnap.data();
    await patientRef.update({
      prescription,
      status: 'checked',
      history: (patient.history || []).concat({ date: new Date().toISOString(), prescription })
    });
    window.logAction('add_prescription', { patient: patient.name, prescription });
    if (typeof window.showPatientsList === 'function') window.showPatientsList(true);
    modal.style.display = 'none';
  };
}

export async function editPrescription(patientId) {
  let modal = document.getElementById('prescription-modal');
  let modalBody = document.getElementById('prescription-modal-body');
  if (!modal || !modalBody) {
    modal = document.createElement('div');
    modal.id = 'prescription-modal';
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
    innerDiv.style.minWidth = '220px';
    innerDiv.style.maxWidth = '340px';
    innerDiv.style.margin = '10vh auto';
    innerDiv.style.position = 'relative';
    innerDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    innerDiv.style.display = 'flex';
    innerDiv.style.flexDirection = 'column';
    innerDiv.style.alignItems = 'flex-end';
    modalBody = document.createElement('div');
    modalBody.id = 'prescription-modal-body';
    modalBody.style.width = '100%';
    modalBody.style.alignSelf = 'center';
    modalBody.style.paddingTop = '0';
    innerDiv.appendChild(modalBody);
    modal.appendChild(innerDiv);
    document.body.appendChild(modal);
  }
  const patientRef = window.db.collection('patients').doc(patientId);
  const patientSnap = await patientRef.get();
  const patient = patientSnap.data();
  modalBody.innerHTML = `
    <h3>Edit Prescription</h3>
    <form id="prescription-form" style="display:flex; flex-direction:column; gap:12px;">
      <textarea id="prescription-input" placeholder="Edit prescription..." required style="min-height:60px;resize:vertical;">${patient.prescription || ''}</textarea>
      <div style="display:flex; gap:12px; justify-content:center;">
        <button type="submit">Save</button>
        <button type="button" id="close-prescription-modal" style="background:#888; color:#fff;">Close</button>
      </div>
    </form>
    <div id="prescription-result"></div>
  `;
  modal.style.display = 'block';
  const closeBtn = document.getElementById('close-prescription-modal');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  document.getElementById('prescription-form').onsubmit = async function(e) {
    e.preventDefault();
    const newPrescription = document.getElementById('prescription-input').value.trim();
    if (newPrescription === null) return;
    await patientRef.update({
      prescription: newPrescription,
      history: (patient.history || []).concat({ date: new Date().toISOString(), prescription: newPrescription })
    });
    window.logAction('edit_prescription', { patient: patient.name, newPrescription });
    if (typeof window.showPatientsList === 'function') window.showPatientsList(true);
    modal.style.display = 'none';
  };
}
