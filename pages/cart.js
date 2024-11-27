import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext'; 

export default function Cart({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const { isDarkMode } = useDarkMode(); 

  useEffect(() => {
    fetch('http://localhost:8080/cart')
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.cart_items);
      })
      .catch((error) => {
        console.error('Error al cargar el carrito:', error);
      });
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Text style={[styles.title, isDarkMode && styles.titleDark]}>{item.title}</Text>
            <Text style={[styles.text, isDarkMode && styles.textDark]}>Autor: {item.author}</Text>
            <Text style={[styles.text, isDarkMode && styles.textDark]}>Precio: ${item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={[styles.totalContainer, isDarkMode && styles.totalContainerDark]}>
        <Text style={[styles.totalText, isDarkMode && styles.totalTextDark]}>Total: ${calculateTotal().toFixed(2)}</Text>
      </View>
      <Button
        title="Pagar"
        onPress={() => navigation.navigate('Añadir Pago')}
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Modo claro
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom:30
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#757575',
  },
  totalContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modo oscuro
  containerDark: {
    backgroundColor: '#000',
  },
  cardDark: {
    backgroundColor: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  textDark: {
    color: '#ccc',
  },
  totalContainerDark: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalTextDark: {
    color: '#fff',
  },
});
