import { pool } from '../models/db.js';
import { register } from '../../app/methods/register';  // Use import instead of require


describe('register', () => {

  beforeEach(async () => {
    

    // Ensure no users exist with this email before each test
    const values = { email: 'newuser@example.com' };

    try {
      const startTime = Date.now();
  
      // Ensure no users exist with this email before each test
      await pool.query('DELETE FROM eventastic."User" WHERE email = $1', [
        values.email,
      ]);
  
      console.log(`DB cleanup completed in ${Date.now() - startTime}ms`);
    } catch (error) {
      console.error("DB cleanup failed:", error);
    }
    

    
  });

  afterAll( async ()  => {
    console.log("Closing DB connection...");
    try {
      await pool.end();
      console.log("DB connection closed successfully.");
    } catch (error) {
      console.error("Error closing DB connection:", error);
    }
  });

  it('should return user ID if the user already exists', async () => {
    const existingUserID = '56d5e96c-12bf-4b17-adbf-9de3f056ee32'; 
  
    const values = { email: 'test@gmail.com', username: 'Tester', password: 'password' };
    const result = await register(values);
  
    expect(result).toEqual({ message: 'User already exists', userID: existingUserID });
  });
  

  it('should create a new user if the user does not exist', async () => {
    global.alert = jest.fn();
    const values = { email: 'newuser@example.com', username: 'New User', password: 'password', confirmPassword: 'password' };
    const result = await register(values);
  
    expect(result).toMatchObject({ message: 'User created successfully'});
    expect(alert).not.toHaveBeenCalled();
  });

});
