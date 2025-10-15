
import { showLoginSection, showRegisterSection, hideRegisterSection, renderMainSection } from '../ui/ui.js';
import { showMainSection } from '../patient/patient.js';

export function setupAuthHandlers() {
  const loginErrorDiv = document.getElementById('login-error-message');

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    if (loginErrorDiv) loginErrorDiv.style.display = 'none';
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    try {
      const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
      const userDocRef = window.db.collection('users').doc(userCredential.user.uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const storedRole = userDoc.data().role;
        if (storedRole !== role) {
          if (loginErrorDiv) {
            loginErrorDiv.innerText = `Role mismatch: You are registered as '${storedRole}'.`;
            loginErrorDiv.style.display = 'block';
          }
          await window.auth.signOut();
          return;
        }
      }
      window.logAction('login', { email, role });
    } catch (err) {
      alert('Login failed: ' + err.message);
      window.logAction('login_failed', { email, role, error: err.message });
    }
  });

  document.getElementById('register-btn').addEventListener('click', showRegisterSection);
  document.getElementById('back-to-login').addEventListener('click', hideRegisterSection);

  document.getElementById('register-form').addEventListener('submit', async (e) => {
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
        hideRegisterSection();
      } catch (err) {
        alert('Registration failed: ' + err.message);
        window.logAction('register_failed', { email, role, error: err.message });
      }
    } else {
      alert('Invalid registration details.');
    }
  });

  window.auth.onAuthStateChanged(async (user) => {
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-section');
    mainSection.style.display = 'none';
    mainSection.innerHTML = '';
    loginSection.style.display = 'block';
    if (user) {
      const userDocRef = window.db.collection('users').doc(user.uid);
      let userDoc;
      try {
        userDoc = await userDocRef.get();
      } catch (err) {
        console.error('Error fetching user doc:', err);
        return;
      }
      let role = userDoc.exists ? userDoc.data().role : null;
      if (!role) {
        role = prompt('Your role is missing. Please enter your role (doctor or receptionist):');
        if (role && (role === 'doctor' || role === 'receptionist')) {
          await userDocRef.set({ ...userDoc.data(), role }, { merge: true });
          window.logAction('role_updated', { email: user.email, role });
        } else {
          alert('Invalid role. Logging out.');
          await window.auth.signOut();
          return;
        }
      }
      if (role === 'doctor' || role === 'receptionist') {
        showMainSection(role);
        loginSection.style.display = 'none';
        mainSection.style.display = 'block';
      } else {
        await window.auth.signOut();
      }
    }
  });
}
