const { login } = require('../../app/methods/login');
import { pool } from '../models/db.js';

describe('Login functionality with real database', () => {
  beforeAll(async () => {
    
  });

  afterAll(async () => {
    
  });

  test('should log in successfully with valid credentials', async () => {
    const values = { email: 'test@example.com', password: 'password' };

    const result = await login(values);

    expect(result.message).toBe('Signed in');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  test('should not log in with invalid credentials', async () => {
    const values = { email: 'test@example.com', password: 'wrongpassword' };

    const result = await login(values);

    expect(result.message).toBe('Not logged in');
  });

  test('should return 404 for non-existent user', async () => {
    const values = { email: 'nonexistent@example.com', password: 'password123' };

    const result = await login(values);

    expect(result.message).toBe('Not logged in');
  });

  test('should handle unexpected errors gracefully', async () => {
    // Simulate an unexpected error by passing null values
    const values = { email: null, password: null };

    const result = await login(values);

    expect(result.message).toBe('Not logged in');
  });
});
