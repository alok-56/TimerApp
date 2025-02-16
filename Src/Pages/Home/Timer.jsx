import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headers from '../../Components/Headers';
import AddAlarm from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from '../../Components/Accordion';
import GModal from '../../Components/GModal';
import InputBox from '../../Components/InputBox';
import DropdownSearch from '../../Components/DropDownSearch';

const Timer = () => {
  const [visible, setVisible] = useState(false);
  const [timername, setTimerName] = useState('');
  const [durationtype, setDurationType] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    fetchTimers();
  }, []);

  const fetchTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleAddTimer = async () => {
    if (!timername || !durationtype || !duration || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const durationInSeconds =
      parseInt(duration) * (durationtype === 'hrs' ? 3600 : 60);

    const newTimer = {
      id: Math.floor(Math.random() * 10000),
      timername,
      durationtype,
      duration: durationInSeconds,
      remainingTime: durationInSeconds,
      category,
      status: 'Pending',
      completionTime: '',
    };

    try {
      const updatedTimers = [...timers, newTimer];
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);
      setVisible(false);
      setTimerName('');
      setDurationType('');
      setDuration('');
      setCategory('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Headers heading="Stopwatch Timer">
        <View style={styles.addtimericon}>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <AddAlarm size={30} color="#000" name="alarm-plus" />
          </TouchableOpacity>
        </View>
      </Headers>

      <GModal
        isVisible={visible}
        headertitle="Add Timer"
        onClose={() => setVisible(false)}>
        <View style={{marginTop: 10}}>
          <InputBox label="Enter Timer Name" onChangeText={setTimerName} />
          <DropdownSearch
            label="Select Duration Type"
            option={[
              {label: 'Minutes', value: 'min'},
              {label: 'Hours', value: 'hrs'},
            ]}
            onSelect={setDurationType}
          />
          <InputBox
            label="Enter Duration"
            onChangeText={setDuration}
            type="numeric"
          />
          <DropdownSearch
            label="Select Category"
            option={[
              {label: 'Workout', value: 'Workout'},
              {label: 'Study', value: 'Study'},
              {label: 'Break', value: 'Break'},
            ]}
            onSelect={setCategory}
          />

          <TouchableOpacity onPress={HandleAddTimer} style={styles.addButton}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Add Timer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </GModal>

      {timers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No timer available.</Text>
        </View>
      ) : (
        <Accordion updatetime={timers} />
      )}
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addtimericon: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addButton: {
    width: '90%',
    height: 45,
    backgroundColor: 'rgb(170, 179, 249)',
    alignSelf: 'center',
    borderRadius: 8,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  emptyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
