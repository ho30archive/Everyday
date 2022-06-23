import React, {useState, createRef, useLayoutEffect, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import RNMonthly from "react-native-monthly";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCw-WEtJmkrIvL22JQxYh71izwjq_GtoQA",
  authDomain: "everyday-8b7bc.firebaseapp.com",
  databaseURL: "https://everyday-8b7bc-default-rtdb.firebaseio.com",
  projectId: "everyday-8b7bc",
  storageBucket: "everyday-8b7bc.appspot.com",
  messagingSenderId: "346402107242",
  appId: "1:346402107242:web:e537af7155b53e57dfff13",
  measurementId: "G-ZE62M0RQXT"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import database from '@react-native-firebase/database';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';



const ProfileScreen = ({navigation}) => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;


  return (
    <View style={styles.container}>
      {/* <Loader loading={loading} /> */}
    <View>
      <View
        style={{
          height: hp(3),
          alignItems: 'flex-end',
          marginTop: hp(5),
        }}>
          <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfileEdit', {
              stu_nick: userData.stu_nick,
              stu_grade: userData.stu_grade,
              stu_photo: userData.stu_photo,
            });
          }}>
          {/* <Text style={{fontSize: wp(3.5), color: 'white'}}>수정하기</Text> */}
          <Icon name="create-outline" size={25.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            auth()
              .signOut()
              .then(() => console.log('User signed out!'));
            navigation.replace('Auth');
          }}>
          {/* <Text style={{color: 'white', fontSize: wp(3)}}>로그아웃</Text> */}
          <Icon name="log-out-outline" size={26.7} />
        </TouchableOpacity>
      </View>
      </View>
      <View>
      <Text style={{ fontWeight: "600", fontSize: wp(4), color: 'grey', marginLeft: wp(6)}}>
        {user.email} 님</Text>
      </View>
      <View style={{ margin: 16, }}>
            <Text style={{ fontWeight: "600", fontSize: wp(4), color: 'grey' ,margin:20}}>
              6월 캘린더
            </Text>
            {/* <RNMonthly numberOfDays={31} activeDays={[1, 5, 6, 11, 21, 31]} /> */}
            <RNMonthly
            numberOfDays={30}
            activeBackgroundColor="#46c3ad"
            inactiveBackgroundColor="#E6FFDE"
            activeDays={[1, 5, 6, 11, 21, 31]}/>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(5),
    paddingRight: wp(5),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
  // editbtn: {
  //   fontSize: wp(4),
  //   paddingRight: wp(4),
  // },
  // btn: {
  //   height: hp(3),
  //   justifyContent: 'center',
  //   alignItems: 'flex-end',
  //   marginTop: hp(2),
  // },
});

export default ProfileScreen;