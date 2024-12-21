import React from 'react';
import { Button } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const LoginButton = () => {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  return <Button onPress={onPress} title="Log in" />;
};

export default LoginButton;
