const { login } = require('../../app/methods/login');
import { pool } from '../models/db.js';

describe('Login functionality with real database', () => {
  beforeAll(async () => {
    
  });

  afterAll(async () => {
    await pool.end();
  });

  test('should log in successfully with valid credentials', async () => {
    const values = { email: 'test@gmail.com', password: 'password' };

    const result = await login(values);

    expect(result.message).toBe('Signed in');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@gmail.com');
  });

  test('should not log in with invalid credentials', async () => {
    const values = { email: 'test@gmail.com', password: 'wrongpassword' };

    const result = await login(values);

    expect(result.message).toBe('Email or password is incorrect');
  });

  test('should return 404 for non-existent user', async () => {
    const values = { email: 'nonexistent@example.com', password: 'password123' };

    const result = await login(values);

    expect(result.message).toBe('User not found');
  });

  test('should handle empty inputs', async () => {
    // Simulate an unexpected error by passing null values
    const values = { email: null, password: null };

    const result = await login(values);

    expect(result.message).toBe('Email is empty');
  });
});
