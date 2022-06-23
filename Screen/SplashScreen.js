// Import React and Component
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-community/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import auth from '@react-native-firebase/auth';



const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      auth().onAuthStateChanged((user) => {
        navigation.replace(user === null ? 'Auth' : 'MainTab')
    });
      
    }, 3000);
  }, []);



  return (
    <View style={styles.container}>
      <Image
        source={require('../src/logo3.png')}
        style={{width: wp(70), resizeMode: 'contain', margin: 20}}
      />
      <ActivityIndicator
        animating={animating}
        color="#6990F7"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
