function logAction(action, details = {}) {
  const user = window.auth.currentUser ? window.auth.currentUser.email : 'anonymous';
  const logEntry = {
    action,
    details,
    timestamp: new Date().toISOString(),
    user
  };
  console.log('[LOG]', logEntry);
  window.db.collection('logs').add(logEntry).catch(e => {
    console.error('Failed to log to Firestore:', e);
  });
}
window.logAction = logAction;
