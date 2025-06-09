// app/addedituser.jsx
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useState } from 'react';
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

export default function AddUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    pincode: '',
    address: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('dob', formattedDate);
    }
  };

  const handleSubmit = async () => {
   
    if (!form.name || !form.email || !form.mobile || !form.dob || !form.pincode || !form.address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if(!form.email.includes('@gmail.com')){
      Alert.alert('Error', 'Please Enter Vaild Mail');
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
        email:form.email.trim(),
        pincode: Number(form.pincode), 
      };
      
      const res = await axios.post(
        'https://iskcon-curd.onrender.com/api/user/create',
        payload
      );

      if (res.status === 200) {
        Alert.alert('Success', 'User created!');
        setForm({
          name: '',
          email: '',
          mobile: '',
          dob: '',
          pincode: '',
          address: '',
        });
      } else {
        Alert.alert('Error', 'a');
      }
    } catch (error) {
     
      Alert.alert('Error', 'Something went wrong');
    }
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

      <View style={{ marginTop: 20 }}>
        <Button title="Create User" onPress={handleSubmit} color="#D32F2F" />
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
});
