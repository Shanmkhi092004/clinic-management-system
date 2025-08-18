// Firebase compat version for browser
// Make sure the following scripts are included in index.html:
// <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyBDItOHv3quPgBlFzJw1zFKfTYZgxK39Go",
  authDomain: "clinic-management-system-1748e.firebaseapp.com",
  projectId: "clinic-management-system-1748e",
  storageBucket: "clinic-management-system-1748e.firebasestorage.app",
  messagingSenderId: "160500010389",
  appId: "1:160500010389:web:ac163012b2fc577e8a3a9c",
  measurementId: "G-GX2JW4YH9B"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
window.auth = auth;
const db = firebase.firestore();
window.db = db;