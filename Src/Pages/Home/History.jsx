import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Headers from '../../Components/Headers';
import Export from 'react-native-vector-icons/AntDesign';
import ClockCircle from 'react-native-vector-icons/AntDesign';
import CheckCircle from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFocusEffect} from '@react-navigation/native';

const History = () => {
  const [timerLogs, setTimerLogs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      FetchTimerLogs();
    }, [timerLogs]),
  );

  const FetchTimerLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem('logs');
      if (storedLogs) {
        const allLogs = JSON.parse(storedLogs);
        const completedLogs = allLogs.filter(
          timer => timer.status === 'Completed',
        );
        setTimerLogs(completedLogs.reverse());
      }
      console.log(storedLogs);
    } catch (error) {
      console.log(error);
    }
  };

  const formatCompletedTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const exportToJson = () => {
    const jsonString = JSON.stringify(timerLogs, null, 2);
    Clipboard.setString(jsonString);
    Alert.alert('Export', 'Timer logs copied Please Paste JSON!');
  };

  return (
    <View style={styles.container}>
      <Headers heading="Timer History">
        <TouchableOpacity onPress={exportToJson} style={styles.iconButton}>
          <Export size={25} color="#552F62" name="export" />
        </TouchableOpacity>
      </Headers>

      <FlatList
        data={timerLogs}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.logCard}>
            <View style={styles.row}>
              <ClockCircle name="clockcircleo" size={22} color="#552F62" />
              <Text style={styles.timerName}>{item.timername}</Text>
            </View>
            <View style={styles.row}>
              <CheckCircle name="check-circle" size={22} color="green" />
              <Text style={styles.timerTime}>
                {formatCompletedTime(item.completeddate)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history available.</Text>
        }
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  iconButton: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  logCard: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timerTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#777',
  },
});
