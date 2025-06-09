import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

const fetchUsers = useCallback(async () => {
  try {
    const res = await axios.get('https://iskcon-curd.onrender.com/api/user/show');
    setUsers(res.data.users);
  } catch (error) {
   
  }
}, []);

useFocusEffect(
  useCallback(() => {
    fetchUsers();
  }, [fetchUsers])  
);

  const renderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: '/userdetails', 
        params: { user: JSON.stringify(item) }, 
      })
    }
  >
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}><Text style={styles.label}>Email:</Text> {item.email}</Text>
      <Text style={styles.info}><Text style={styles.label}>Mobile:</Text> {item.mobile}</Text>
      <Text style={styles.info}><Text style={styles.label}>DOB:</Text> {item.dob}</Text>
      <Text style={styles.info}><Text style={styles.label}>Pincode:</Text> {item.pincode}</Text>
      <Text style={styles.info}><Text style={styles.label}>Address:</Text> {item.address}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
      style={{ backgroundColor: '#000' }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    color: '#ccc',
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#aaa',
  },
});
