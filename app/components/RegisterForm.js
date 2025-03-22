import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { register } from '../methods/register';
import { login } from '../methods/login';
import { StackActions } from '@react-navigation/native';

const RegisterForm = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = userInfo;

  // Refs for inputs to navigate between fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const submitForm = async () => {
    console.log(userInfo);
    register(userInfo).then(async (response) => {
      console.log(response);

      if (response.message === "User created successfully") {
        Alert.alert('Success', "Registered: " + username);
        const loginResponse = await login(email, password);
        navigation.dispatch(
          StackActions.replace('SearchPage', {
            user: loginResponse.user
          })
        );
      } else {
        Alert.alert('Error', response);
      }
    });
  };

  return (
    <FormContainer>
      {/* Username Input */}
      <FormInput
        value={username}
        onChangeText={(value) => handleOnChangeText(value, 'username')}
        title="Username"
        placeholder="example123"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Email Input */}
      <FormInput
        ref={emailRef}
        value={email}
        onChangeText={(value) => handleOnChangeText(value, 'email')}
        autoCapitalize="none"
        title="Email"
        placeholder="email@google.com"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Password Input */}
      <FormInput
        ref={passwordRef}
        value={password}
        onChangeText={(value) => handleOnChangeText(value, 'password')}
        secureTextEntry
        autoCapitalize="none"
        title="Password"
        placeholder="*******"
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()} // Move to next field
        blurOnSubmit={false}
      />

      {/* Confirm Password Input */}
      <FormInput
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChangeText={(value) => handleOnChangeText(value, 'confirmPassword')}
        secureTextEntry
        autoCapitalize="none"
        title="Confirm Password"
        placeholder="*******"
        returnKeyType="done"
        onSubmitEditing={submitForm} // Submit form on "Done"
      />

      {/* Submit Button */}
      <FormSubmitButton onPress={submitForm} title="Register" />
    </FormContainer>
  );
};

export default RegisterForm;
