import * as auth from '../../auth/auth.js';

describe('Auth Module', () => {
  test('setupAuthHandlers is a function', () => {
    expect(typeof auth.setupAuthHandlers).toBe('function');
  });
});
