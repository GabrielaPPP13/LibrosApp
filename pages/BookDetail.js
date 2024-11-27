import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext'; 

function BookDetail({ route }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { isDarkMode } = useDarkMode(); 

  useEffect(() => {
    fetch(`https://darkgoldenrod-mandrill-514187.hostingersite.com/book/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles:', error);
      });
  }, [bookId]);

  const handleAddToCart = () => {
    console.log('Datos que se van a enviar:', {
      book_id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
    });

    fetch('http://localhost:8080/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Artículo agregado al carrito:', data);
      })
      .catch((error) => {
        console.error('Error al agregar al carrito:', error);
      });
  };

  if (!book) {
    return (
      <View style={[styles.loaderContainer, isDarkMode && styles.loaderContainerDark]}>
        <Text style={isDarkMode ? styles.loaderTextDark : styles.loaderText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Image source={{ uri: book.image_url }} style={styles.image} />
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{book.title}</Text>
      <Text style={[styles.author, isDarkMode && styles.authorDark]}>Por: {book.author}</Text>
      <Text style={[styles.price, isDarkMode && styles.priceDark]}>Precio: ${book.price}</Text>
      <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>{book.description}</Text>
      <Text style={[styles.info, isDarkMode && styles.infoDark]}>ISBN: {book.isbn}</Text>
      <Text style={[styles.info, isDarkMode && styles.infoDark]}>Año: {book.year_published}</Text>
      <Text style={[styles.info, isDarkMode && styles.infoDark]}>Editorial: {book.publisher}</Text>
      <Text style={[styles.info, isDarkMode && styles.infoDark]}>Páginas: {book.pages}</Text>
      <Text style={[styles.info, isDarkMode && styles.infoDark]}>Idioma: {book.language}</Text>

      {/* Botón de agregar al carrito */}
      <View style={styles.addToCartContainer}>
        <Button title="Agregar al carrito" onPress={handleAddToCart} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#333', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleDark: {
    color: '#fff', 
  },
  author: {
    fontSize: 18,
    marginBottom: 10,
  },
  authorDark: {
    color: '#ccc', 
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  priceDark: {
    color: '#4CAF50', 
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionDark: {
    color: '#ccc', 
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoDark: {
    color: '#ccc', 
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainerDark: {
    backgroundColor: '#333', 
  },
  loaderText: {
    fontSize: 18,
    color: '#000', 
  },
  loaderTextDark: {
    fontSize: 18,
    color: '#fff', 
  },
  addToCartContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityText: {
    fontSize: 18,
    marginBottom: 10,
  },
  quantityTextDark: {
    color: '#fff', 
  },
});

export default BookDetail;
