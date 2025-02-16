import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewAnt from 'react-native-vector-icons/AntDesign';
import Reset from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';

const Accordion = ({updatetime}) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [timers, setTimers] = useState({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [currentBulk, setCurrentBulk] = useState(''); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (Array.isArray(updatetime) && updatetime.length > 0) {
      const grouped = groupTimersByCategory(updatetime);
      setTimers(grouped);
    }
  }, [updatetime]);

 
  const groupTimersByCategory = (timersArray) => {
    if (!Array.isArray(timersArray)) return {};
    return timersArray.reduce((acc, timer) => {
      if (!timer || !timer.category) return acc;
      acc[timer.category] = acc[timer.category] || [];
      acc[timer.category].push(timer);
      return acc;
    }, {});
  };

  
  const toggleExpand = (category) => {
    setExpandedCategories((prevState) =>
      prevState.includes(category)
        ? prevState.filter((cat) => cat !== category)
        : [...prevState, category]
    );
  };

  
  const updateTimerStatus = async (id, newStatus) => {
    const updatedTimers = Object.values(timers)
      .flat()
      .map((timer) => {
        if (timer.id === id) {
          if (newStatus === 'In Progress') {
            return {
              ...timer,
              status: 'In Progress',
              startTime: Date.now(),
              initialRemainingTime: timer.duration,
              remainingTime: timer.duration,
            };
          } else if (newStatus === 'Paused') {
            const elapsedTime = timer.startTime
              ? Math.floor((Date.now() - timer.startTime) / 1000)
              : 0;
            return {
              ...timer,
              status: 'Paused',
              remainingTime: Math.max(timer.initialRemainingTime - elapsedTime, 0),
            };
          } else if (newStatus === 'Pending') {
            return {
              ...timer,
              status: 'Pending',
              remainingTime: timer.duration,
              startTime: null,
              initialRemainingTime: timer.duration,
            };
          }
        }
        return timer;
      });

    const groupedTimers = groupTimersByCategory(updatedTimers);
    setTimers(groupedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  
  const bulkUpdateCategory = async (category, newStatus) => {
    if (!timers[category]) return;
    setCurrentBulk(newStatus);
    const updatedTimersArray = Object.values(timers)
      .flat()
      .map((timer) => {
        if (timer.category === category) {
          if (newStatus === 'In Progress') {
            return {
              ...timer,
              status: 'In Progress',
              startTime: Date.now(),
              initialRemainingTime: timer.duration,
              remainingTime: timer.duration,
            };
          } else if (newStatus === 'Paused') {
            const elapsedTime = timer.startTime
              ? Math.floor((Date.now() - timer.startTime) / 1000)
              : 0;
            return {
              ...timer,
              status: 'Paused',
              remainingTime: Math.max(timer.initialRemainingTime - elapsedTime, 0),
            };
          } else if (newStatus === 'Pending') {
            return {
              ...timer,
              status: 'Pending',
              remainingTime: timer.duration,
              startTime: null,
              initialRemainingTime: timer.duration,
            };
          }
        }
        return timer;
      });

    const groupedTimers = groupTimersByCategory(updatedTimersArray);
    setTimers(groupedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimersArray));
  };

 
  useEffect(() => {
    const checkCompletedTimers = async () => {
      if (!timers || Object.keys(timers).length === 0) return;
      const updatedTimers = Object.values(timers)
        .flat()
        .map((timer) => {
          if (timer.status === 'In Progress' && timer.startTime) {
            const elapsedTime = Math.floor((currentTime - timer.startTime) / 1000);
            const displayedRemainingTime = Math.max(timer.initialRemainingTime - elapsedTime, 0);
            if (displayedRemainingTime <= 0) {
             
              return {
                ...timer,
                status: 'Completed',
                remainingTime: 0,
                completeddate: new Date(),
              };
            }
            return { ...timer };
          }
          return timer;
        });

      const grouped = groupTimersByCategory(updatedTimers);
      setTimers(grouped);
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    };

    checkCompletedTimers();
  }, [currentTime]);

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 20}}>
      {Object.keys(timers).map(category => {
        const isExpanded = expandedCategories.includes(category);
        return (
          <View key={category} style={styles.accordionContainer}>
            {/* Category Header */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleExpand(category)}
              activeOpacity={0.7}>
              <Text style={styles.accordionTitle}>{category}</Text>
              <NewAnt
                name={isExpanded ? 'caretup' : 'caretdown'}
                size={16}
                color="#552F62"
              />
            </TouchableOpacity>

            {/* Bulk Action Buttons */}
            {isExpanded && (
              <View style={styles.bulkActions}>
                {currentBulk !== 'In Progress' && (
                  <TouchableOpacity
                    onPress={() => bulkUpdateCategory(category, 'In Progress')}
                    style={styles.iconButton}>
                    <NewAnt size={32} color="#552F62" name="playcircleo" />
                  </TouchableOpacity>
                )}
                {currentBulk === 'In Progress' && (
                  <TouchableOpacity
                    onPress={() => bulkUpdateCategory(category, 'Paused')}
                    style={styles.iconButton}>
                    <NewAnt size={32} color="#552F62" name="pausecircleo" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => bulkUpdateCategory(category, 'Pending')}
                  style={styles.iconButton}>
                  <Reset size={32} color="#552F62" name="refresh-ccw" />
                </TouchableOpacity>
              </View>
            )}

            {/* Timers for the category */}
            {isExpanded &&
              timers[category].map(timer => {
                let elapsedTime = 0;
                if (timer.status === 'In Progress' && timer.startTime) {
                  elapsedTime = Math.floor(
                    (currentTime - timer.startTime) / 1000,
                  );
                }
                const remainingTime = Math.max(
                  timer.remainingTime - elapsedTime,
                  0,
                );
                const progress = 1 - remainingTime / timer.duration;

                return (
                  <View key={timer.id} style={styles.accordionContent}>
                    <View
                      style={[
                        styles.card,
                        {
                          backgroundColor:
                            timer.status === 'Completed'
                              ? 'rgb(178, 247, 188)'
                              : timer.status === 'In Progress'
                              ? 'rgb(239, 174, 144)'
                              : 'rgb(170, 179, 249)',
                        },
                      ]}>
                      <Text style={styles.cardTitle}>
                        {timer.category}{' '}
                        <Text style={{fontSize: 14, color: 'red'}}>
                          ({timer.status})
                        </Text>
                      </Text>
                      <Text style={styles.cardSubtitle}>{timer.timername}</Text>

                      <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                          {Math.floor(remainingTime / 60)}m {remainingTime % 60}
                          s
                        </Text>
                      </View>

                      <View style={styles.progressContainer}>
                        <Progress.Circle
                          size={50}
                          progress={progress}
                          showsText={true}
                          color="#552F62"
                          thickness={4}
                        />
                      </View>

                      <View style={styles.controlsContainer}>
                        {timer.status !== 'In Progress' && (
                          <TouchableOpacity
                            onPress={() =>
                              updateTimerStatus(timer.id, 'In Progress')
                            }
                            style={styles.iconButton}>
                            <NewAnt
                              size={32}
                              color="#552F62"
                              name="playcircleo"
                            />
                          </TouchableOpacity>
                        )}
                        {timer.status === 'In Progress' && (
                          <TouchableOpacity
                            onPress={() =>
                              updateTimerStatus(timer.id, 'Paused')
                            }
                            style={styles.iconButton}>
                            <NewAnt
                              size={32}
                              color="#552F62"
                              name="pausecircleo"
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => updateTimerStatus(timer.id, 'Pending')}
                          style={styles.iconButton}>
                          <Reset size={32} color="#552F62" name="refresh-ccw" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    marginTop: 15,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  accordionTitle: {fontSize: 16, fontWeight: '600', color: '#552F62'},
  accordionContent: {padding: 16, backgroundColor: '#fff'},
  card: {
    width: '90%',
    elevation: 4,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: {fontSize: 16, fontWeight: '500', color: '#333'},
  cardSubtitle: {fontSize: 20, fontWeight: '600', color: '#000', marginTop: 1},
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  timerText: {fontSize: 30, fontWeight: '400', color: '#000'},
  progressContainer: {position: 'absolute', right: 10, top: 10},
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
  },
  iconButton: {
    height: 45,
    width: 45,
    backgroundColor: '#fff',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bulkActions: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
  },
  bulkButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#552F62',
    borderRadius: 4,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Accordion;
