import * as history from '../../history/history.js';

describe('History Module', () => {
  test('viewHistory is a function', () => {
    expect(typeof history.viewHistory).toBe('function');
  });
  test('handleCheckPatient is a function', () => {
    expect(typeof history.handleCheckPatient).toBe('function');
  });
  test('editPrescription is a function', () => {
    expect(typeof history.editPrescription).toBe('function');
  });
});
