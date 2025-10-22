import { showMainSection, showPatientsList } from './patient/patient.js';
import { viewHistory, handleCheckPatient, editPrescription } from './history/history.js';

// Expose required functions for button handlers
window.viewHistory = viewHistory;
window.handleCheckPatient = handleCheckPatient;
window.editPrescription = editPrescription;

// Get user role from localStorage or sessionStorage (set after login)
const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
if (!role) {
  // If not logged in, redirect to login page
  window.location.href = 'index.html';
} else {
  // Hide loading message if present
  const loadingDiv = document.getElementById('loading-message');
  if (loadingDiv) loadingDiv.style.display = 'none';
  // Render dashboard for the logged-in user
  showMainSection(role);
}
