
import { pool } from '../models/db.js';

import { register } from '../../app/methods/register';  // Use import instead of require


describe('register', () => {
  

  beforeEach(async () => {
    

    // Ensure no users exist with this email before each test
    const values = { email: 'newuser@example.com' };
    await pool.query('DELETE FROM public."User" WHERE email = $1', [values.email]);

    
  });

  afterEach(() => {
    
  });

  it('should return user ID if the user already exists', async () => {
    const existingUserID = '87c81b98-946a-4a36-b4a9-89761eaa7a80'; 
  
    const values = { email: 'test@example.com', username: 'Test User', password: 'password' };
    const result = await register(values);
  
    expect(result).toEqual({ message: 'User already exists', userID: existingUserID });
  });
  

  it('should create a new user if the user does not exist', async () => {
  
    const values = { email: 'newuser@example.com', username: 'New User', password: 'password' };
    const result = await register(values);
  
    expect(result).toMatchObject({ message: 'User created successfully'});
  });

});
