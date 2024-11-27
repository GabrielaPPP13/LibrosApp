import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, FlatList, View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Orders from './pages/SettingsScreen'; 
import BookDetail from './pages/BookDetail'; 
import Cart from './pages/cart'; 
import AddPayment from './pages/AddPayment'; 
import PreferencesScreen from './pages/PreferencesScreen'; 
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


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Catálogo') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Registrar Nuevo Libro') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Preferencias') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Detalles del Libro') {
              iconName = focused ? 'bookmarks' : 'bookmarks-outline';
            } else if (route.name === 'Añadir Pago') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Ordenes') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Catálogo" component={CatalogScreen} />
        <Tab.Screen name="Carrito" component={Cart} />
        <Tab.Screen name="Ordenes" component={Orders} />
        <Tab.Screen name="Detalles del Libro" component={BookDetail} />
        <Tab.Screen name="Añadir Pago" component={AddPayment} />
        <Tab.Screen name="Preferencias" component={PreferencesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#f7f7f7', // Fondo oscuro o claro
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: isDarkMode ? '#fff' : '#333', // Color de texto dependiendo del modo
    marginBottom: 20,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#121212' : '#f7f7f7',
  },
  card: {
    backgroundColor: isDarkMode ? '#333' : '#fff', // Fondo de las tarjetas
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: isDarkMode ? '#fff' : '#333', // Título con color dependiente del modo
  },
  author: {
    fontSize: 14,
    color: isDarkMode ? '#bbb' : '#757575', // Color de texto para el autor
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
    marginTop: 8,
  },
});
