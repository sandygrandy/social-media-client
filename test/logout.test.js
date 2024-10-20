/* global global */
import { logout } from '../src/js/api/auth/logout.js';
import './mocks/localStorageMock.js';

describe('Logout function', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  test('Should remove token when logging out', () => {
    global.localStorage.setItem('token', 'test-token');
    logout();
    const token = global.localStorage.getItem('token');
    expect(token).toBeFalsy();
  });
});
