
import { setupAuthHandlers } from './auth/auth.js';
import { viewHistory, handleCheckPatient, editPrescription } from './history/history.js';
import { showPatientsList } from './patient/patient.js';

document.addEventListener('DOMContentLoaded', function() {
  setupAuthHandlers();
  window.viewHistory = viewHistory;
  window.handleCheckPatient = handleCheckPatient;
  window.editPrescription = editPrescription;
  setTimeout(() => {
    if (window.showBillForm) return;
    showPatientsList();
  }, 0);
});