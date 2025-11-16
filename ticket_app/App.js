import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Wywołanie fetch w useEffect aby wykonać raz po załadowaniu komponentu
    fetch('http://192.168.0.52:3000/register', {  // Załóżmy, że wywołujesz login
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jan@example.com',  // Poprawione, usuń błędny mailto
        password: 'password123',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // pusty array powoduje że fetch wykona się raz

  return (
    <View style={styles.container}>
      <Text>czemu nie dziala</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
