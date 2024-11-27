import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext'; 

export default function AddPayment() {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const { isDarkMode } = useDarkMode(); 

  const handleSaveCard = () => {
    if (!cardNumber || !expirationDate || !cardholderName) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const payload = {
      card_number: cardNumber,
      expiration_date: expirationDate,
      cardholder_name: cardholderName,
    };

    fetch('http://localhost:8080/add-payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert('Éxito', 'La tarjeta se guardó correctamente.');
          setCardNumber('');
          setExpirationDate('');
          setCardholderName('');
        } else {
          Alert.alert('Error', 'No se pudo guardar la tarjeta.');
        }
      })
      .catch((error) => {
        console.error('Error al guardar la tarjeta:', error);
        Alert.alert('Error', 'Ocurrió un problema al guardar la tarjeta.');
      });
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Agregar Tarjeta</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.inputDark]}
        placeholder="Número de Tarjeta"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.inputDark]}
        placeholder="Fecha de Expiración (YYYY/MM)"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.inputDark]}
        placeholder="Nombre del Titular"
        value={cardholderName}
        onChangeText={setCardholderName}
      />

      <Button title="Guardar Tarjeta" onPress={handleSaveCard} color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
    justifyContent: 'center',
  },
  containerDark: {
    backgroundColor: '#000', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleDark: {
    color: '#fff', 
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  inputDark: {
    backgroundColor: '#555', 
    borderColor: '#444', 
    color: '#fff', 
  },
});