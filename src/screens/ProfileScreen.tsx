// ProfileScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Profile Screen</Text>
      <Button
        title="Click Me"
        onPress={() => {
          // Handle button click here
          console.log('Button clicked!');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;
