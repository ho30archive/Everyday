import React, {
  useState,
  createRe,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const TestScreen = ({navigation }) => {
  const preURL = require('../../preURL/preURL');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () =>       
      <Image
      source={require('../../src/mission.png')}
      style={{width: wp(20), height: hp(10), resizeMode: 'contain'}}
      />,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topdesc}>
      <Image
        source={require('../../src/mission2.png')}
        style={{width: wp(80), height: hp(30), resizeMode: 'contain'}}
      />
      </View>
      <View
        style={{
          flex: 1.5,
        }}>
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              navigation.navigate('TestCreate');
            }}>
            <Text style={{fontSize: wp(4.5), fontWeight: 'bold', color: 'white'}}>
              미션 생성
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(10),
    paddingRight: wp(10),
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  topdesc: {
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: hp(5),
    paddingTop: hp(25)
  },

  btnArea: {
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  btn: {
    height: hp(7),
    width: wp(80),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#46c3ad',
    borderWidth: 0,
  },
  filledbtn: {
    backgroundColor: '#46c3ad',
  },

  btnL: {marginRight: 10},
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
});

export default TestScreen;
