import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { useDarkMode } from '../contexts/DarkModeContext'; 

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { isDarkMode } = useDarkMode(); 

  useEffect(() => {
    fetch('http://localhost:8080/orders')
      .then((response) => response.json())
      .then((data) => {
        console.log('Orders fetched:', data.orders); 
        setOrders(data.orders || []);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const updateOrderDescription = (orderId) => {
    const newDescription = prompt('Ingresa la nueva descripción');
  
    if (newDescription) {
      fetch(`http://localhost:8080/update-order-description/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Descripcion: newDescription }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error('Error updating description:', data.error);
            Alert.alert('Error', 'Failed to update the description.');
          } else {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.order_id === orderId ? { ...order, Descripcion: newDescription } : order
              )
            );
            Alert.alert('Success', 'Order description updated successfully.');
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          Alert.alert('Error', 'Failed to update the description.');
        });
    }
  };

  const deleteOrder = (orderId) => {
    fetch('http://localhost:8080/delete-order', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }), 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            Alert.alert('Error', data.error);
          } else {
            setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
            Alert.alert('Success', 'Order deleted successfully.');
          }
        })
        .catch((error) => {
          console.error('Error deleting order:', error);
          Alert.alert('Error', 'Failed to delete the order.');
        });
  };
  
  const renderOrderCard = ({ item }) => (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <Text style={[styles.orderTitle, isDarkMode && styles.orderTitleDark]}>Order ID: {item.order_id}</Text>
      <Text style={[styles.orderText, isDarkMode && styles.orderTextDark]}>Date: {item.order_date}</Text>
      <Text style={[styles.orderText, isDarkMode && styles.orderTextDark]}>
        Total Price: ${item.total_price ? item.total_price : 'Precio Invalido'}
      </Text>
      <Text style={[styles.orderText, isDarkMode && styles.orderTextDark]}>
        Description: {item.Descripcion || 'Ingresa Descripción'}
      </Text>
      <Text style={[styles.orderText, isDarkMode && styles.orderTextDark]}>Card Holder: {item.cardholder_name}</Text>
      <Text style={[styles.orderText, isDarkMode && styles.orderTextDark]}>Card: **** **** **** {item.card_number.slice(-4)}</Text>

      <TouchableOpacity
        style={[styles.editButton, isDarkMode && styles.editButtonDark]}
        onPress={() => updateOrderDescription(item.order_id)}
      >
        <Text style={[styles.editButtonText, isDarkMode && styles.editButtonTextDark]}>Editar Descripción</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, isDarkMode && styles.deleteButtonDark]}
        onPress={() => deleteOrder(item.order_id)}
      >
        <Text style={[styles.deleteButtonText, isDarkMode && styles.deleteButtonTextDark]}>Eliminar Orden</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      {orders.length === 0 ? (
        <Text style={[styles.noOrdersText, isDarkMode && styles.noOrdersTextDark]}>No hay ordenes disponibles</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderOrderCard}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  containerDark: {
    backgroundColor: '#000', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', 
  },
  headerDark: {
    color: '#fff', 
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#444', 
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTitleDark: {
    color: '#fff', 
  },
  orderText: {
    fontSize: 14,
    marginVertical: 4,
    color: '#333',
  },
  orderTextDark: {
    color: '#ddd', 
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  editButtonDark: {
    backgroundColor: '#45a049', 
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  deleteButtonDark: {
    backgroundColor: '#e53935', 
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  editButtonTextDark: {
    color: '#fff', 
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteButtonTextDark: {
    color: '#fff', 
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
  noOrdersTextDark: {
    color: '#bbb', 
  },
});
