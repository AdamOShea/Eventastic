import React, {useState} from 'react';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import client from '../api/client';


const RegisterForm = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });

  const {username, password, confirmPassword, email} = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  const submitForm = () => {
    //isvalid
    console.log(userInfo);
    register(userInfo);
  }

  const register = async (values) => {
    try {
      const res = await client.post('/create-user', {
      ...values
      });
      console.log(res.data);
    }catch (err) {
      console.error(err);
    }
    

    
  };

  return (
    <FormContainer>
      <FormInput value={username} onChangeText={(value) => handleOnChangeText(value, 'username')} title='Username' placeholder='example123'></FormInput>
      <FormInput value={email} onChangeText={(value) => handleOnChangeText(value, 'email')} autoCapitalize='none' title='Email' placeholder='email@google.com'></FormInput>
      <FormInput value={password} onChangeText={(value) => handleOnChangeText(value, 'password')} secureTextEntry autoCapitalize='none' title='Password' placeholder='*******'></FormInput>
      <FormInput value={confirmPassword} onChangeText={(value) => handleOnChangeText(value, 'confirmPassword')} secureTextEntry autoCapitalize='none' title='Confirm Password' placeholder='*******'></FormInput>
      <FormSubmitButton onPress={submitForm} title='Register'></FormSubmitButton>
    </FormContainer>
  );
}

export default RegisterForm;

