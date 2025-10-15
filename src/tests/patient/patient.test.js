import * as patient from '../../patient/patient.js';

describe('Patient Module', () => {
  test('showMainSection is a function', () => {
    expect(typeof patient.showMainSection).toBe('function');
  });
  test('showPatientsList is a function', () => {
    expect(typeof patient.showPatientsList).toBe('function');
  });
});
