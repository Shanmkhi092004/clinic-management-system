// Basic test for logging utility
function testLogAction() {
  let testPassed = false;
  try {
    logAction('test_action', { foo: 'bar' });
    testPassed = true;
  } catch (e) {
    testPassed = false;
  }
  console.assert(testPassed, 'logAction should not throw error');
}
testLogAction();
