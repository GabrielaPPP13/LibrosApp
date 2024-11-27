import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, FlatList, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext'; 

function CatalogScreen({ navigation }) {
  const { isDarkMode } = useDarkMode(); 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://darkgoldenrod-mandrill-514187.hostingersite.com/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles(isDarkMode).loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(isDarkMode).container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles(isDarkMode).card} onTouchEnd={() => navigation.navigate('Detalles del Libro', { bookId: item.id })}>
            <Text style={styles(isDarkMode).title}>{item.title}</Text>
            <Text style={styles(isDarkMode).author}>Por: {item.author}</Text>
            <Text style={styles(isDarkMode).price}>Precio: ${item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}