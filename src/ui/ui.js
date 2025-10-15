export function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

export function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

export function renderMainSection(html) {
  const main = document.getElementById('main-section');
  main.innerHTML = html;
  main.style.display = 'block';
}

export function showLoginSection() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('main-section').style.display = 'none';
}

export function showRegisterSection() {
  document.getElementById('register-section').style.display = 'block';
  document.getElementById('login-section').style.display = 'none';
}

export function hideRegisterSection() {
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}
