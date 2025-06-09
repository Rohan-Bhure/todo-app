import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UserDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    pincode: '',
    address: '',
    _id: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());


  useEffect(() => {
    if (params?.user) {
      try {
        const userData = JSON.parse(params.user);
        setForm({
          name: userData.name || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          dob: userData.dob || '',
          pincode: userData.pincode ? String(userData.pincode) : '',
          address: userData.address || '',
          _id: userData._id || '',
        });

      
        if (userData.dob) {
          setDate(new Date(userData.dob));
        }
      } catch (e) {
        Alert.alert('Error','Please Try Again')
       
      }
    }
  }, [params.user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // keep open for iOS, close for Android
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('dob', formattedDate);
    }
  };

  const handleUpdate = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.dob ||
      !form.pincode ||
      !form.address
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
      if(form.mobile.length !== 10 ){
      Alert.alert('Error', 'Please Enter 10 digit Whatsapp no');
      return;
    }
    
    if(form.pincode.length !== 6 ){
      Alert.alert('Error', 'Please Enter 6 digit Pincode');
      return;
    }
    try {
      const payload = {
        ...form,
        pincode: Number(form.pincode),
      };
      
      const res = await axios.post(
        'https://iskcon-curd.onrender.com/api/user/update',
        payload
      );

      if (res.data.success) {
        Alert.alert('Success', 'User updated!');
        router.replace('/home'); 
      } else {
        Alert.alert('Error', 'Failed to update user');
      }
    } catch (error) {
      
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await axios.delete(
              'https://iskcon-curd.onrender.com/api/user/delete',
              {
                data: { _id: form._id },
              }
            );
            if (res.data.success) {
              Alert.alert('Deleted', 'User has been deleted');
              router.replace('/home');
            } else {
              Alert.alert('Error', 'Failed to delete');
            }
          } catch (err) {
            Alert.alert('Error', 'Something went wrong');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {['name', 'email', 'mobile'].map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.toUpperCase()}
          placeholderTextColor="#aaa"
          value={form[key]}
          onChangeText={(val) => handleChange(key, val)}
          keyboardType={key === 'mobile' ? 'numeric' : 'default'}
          autoCapitalize="none"
        />
      ))}

     
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: form.dob ? '#fff' : '#aaa' }}>
          {form.dob ? form.dob : 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="PINCODE"
        placeholderTextColor="#aaa"
        value={form.pincode}
        onChangeText={(val) => handleChange('pincode', val)}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="ADDRESS"
        placeholderTextColor="#aaa"
        value={form.address}
        onChangeText={(val) => handleChange('address', val)}
        multiline
      />

      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Update User" onPress={handleUpdate} color="#1565C0" />
        <TouchableOpacity style={styles.delete} onPress={handleDelete}>
          <Text style={styles.btnText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    color: 'white',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  delete: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
