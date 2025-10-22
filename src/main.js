// Redirect to dashboard.html if already logged in
if (
  window.location.pathname === '/' ||
  window.location.pathname.endsWith('index.html')
) {
  const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
  if (role) {
    window.location.href = 'dashboard.html';
  }
}

import { setupAuthHandlers } from './auth/auth.js';
import { viewHistory, handleCheckPatient, editPrescription } from './history/history.js';
import { showPatientsList } from './patient/patient.js';

document.addEventListener('DOMContentLoaded', function() {
  setupAuthHandlers();
  window.viewHistory = viewHistory;
  window.handleCheckPatient = handleCheckPatient;
  window.editPrescription = editPrescription;
  // Only call showPatientsList if on dashboard.html
  if (window.location.pathname.endsWith('dashboard.html')) {
    setTimeout(() => {
      if (window.showBillForm) return;
      showPatientsList();
    }, 0);
  }
});