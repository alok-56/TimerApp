import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Home from 'react-native-vector-icons/FontAwesome';

const History = () => {
  const {openDrawer, closeDrawer, toggleDrawer} = useNavigation();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

 
  const handleDateChange = date => {
    setSelectedDate(date.dateString);
    setCalendarVisible(false);
  };

  return (
    <View style={{flex: 1}}>
     
      <Modal
        transparent={true}
        animationType="slide"
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
            }}>
            <Calendar
              onDayPress={handleDateChange}
              markedDates={{
                [selectedDate]: {selected: true, selectedColor: 'blue'},
              }}
            />
            <TouchableOpacity
              onPress={() => setCalendarVisible(false)}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: '#f44336',
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>
                Close Calendar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: '#fff',
          elevation: 5,
        }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={openDrawer}>
              <Text style={{fontSize: 24, color: '#333', textAlign: 'center'}}>
                ☰
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#000',
                marginTop: 5,
              }}>
              Attendance History
            </Text>
            <TouchableOpacity onPress={() => setCalendarVisible(true)}>
              <Image
                style={{height: 40, width: 40}}
                source={require('../Assests/Icons/schedule.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

     
      <View style={{padding: 10}}>
        <Text style={{fontSize: 18, fontWeight: '600'}}>
          {selectedDate ? `Selected Date: ${selectedDate}` : 'No Date Selected'}
        </Text>
      </View>

      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({index, item}) => {
          return (
            <View
              style={{
                height: 70,
                width: '95%',
                backgroundColor: '#fff',
                elevation: 2,
                marginTop: 10,
                alignSelf: 'center',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '93%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#fff',
                    elevation: 3,
                    justifyContent: 'center',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    08
                  </Text>
                  <Text style={{textAlign: 'center'}}>Mon</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: '800'}}>
                    Check In
                  </Text>
                  <Text style={{fontSize: 16, fontWeight: '400'}}>9:35 AM</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: '800'}}>
                    Check Out
                  </Text>
                  <Text style={{fontSize: 16, fontWeight: '400'}}>9:35 AM</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default History;
