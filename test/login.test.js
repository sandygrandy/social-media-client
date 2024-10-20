/* global global */
// Testing the login function to ensure it stores a token when logging in with valid credentials.
import { login } from '../src/js/api/auth/login.js';
import './mocks/localStorageMock.js';
import { jest } from '@jest/globals';
import { load } from '../src/js/storage/load.js';

const fakeLoginResponse = {
  accessToken: 'test-token',
};
const mockFetchSuccess = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ ...fakeLoginResponse }),
});

// Assign this to the global fetch function
global.fetch = mockFetchSuccess;

describe('Login function', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  test('Should store a token when logging in with valid credentials', async () => {
    const credentials = { email: 'email', password: 'password' };
    await login(credentials);
    const token = load('token');
    expect(token).toBe(fakeLoginResponse.accessToken);
  });
});
