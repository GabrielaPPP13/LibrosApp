import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext'; 

function PreferencesScreen() {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); 

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#f7f7f7' }]}>
      <Text style={[styles.text, { color: isDarkMode ? 'white' : 'black' }]}>Preferencias</Text>
      <Button title="Cambiar fondo a negro" onPress={toggleDarkMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PreferencesScreen;
