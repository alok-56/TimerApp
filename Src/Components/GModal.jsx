import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

const GModal = ({
  isVisible,
  onClose,
  headertitle,
  children,
  footer,
  modalContainer,
  swipeDirection,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={swipeDirection}
      style={modalContainer}>
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
              {headertitle ? headertitle : ''}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign color={'#000'} name={'closecircle'} size={25} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={styles.content}>{children}</View>

        {/* Footer */}
        <View>{footer ? footer : ''}</View>
      </View>
    </Modal>
  );
};

export default GModal;

const styles = StyleSheet.create({
  modalContain: {
    justifyContent: 'flex-start',
    marginTop: 80,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 0,
    // borderRadius:8
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    backgroundColor: 'rgb(170, 179, 249)',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
