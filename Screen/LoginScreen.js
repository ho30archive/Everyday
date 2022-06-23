import React, {useState, createRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from './Components/Loader';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

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
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const preURL = require('../preURL/preURL');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  // const setUseridStorage = async (stu_id) => {
  //   try {
  //     await AsyncStorage.setItem('user_id', stu_id);
  //   } catch (e) {
  //     // read error
  //   }
  //   console.log('Done.');
  // };

  async function setUseridStorage(stu_id) {
    await AsyncStorage.setItem('user_id', stu_id);
    console.log('Done.');
  }

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userId) {
      alert('아이디를 입력해주세요');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요');
      return;
    }
          // navigation.replace('MainTab');
          setLoading(true);
    
      auth()
      .signInWithEmailAndPassword(userId, userPassword)
      .then(() => {setLoading(false), navigation.replace('MainTab'), console.log('login sucess')})
      .catch(error =>{
        if (error.code === 'auth/wrong-password'){
          alert('비밀번호가 틀렸습니다.');
          setLoading(false)
        }
        if (error.code === 'auth/invalid-email'){
          alert('존재하지 않는 아이디 입니다.');
          setLoading(false)
        }
        if (error.code === 'auth/user-not-found'){
          alert('존재하지 않는 아이디 입니다..');
          setLoading(false)
        }
        console.error(error);

      })
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image
            source={require('../src/Elogin.png')}
            style={{width: wp(70), resizeMode: 'contain'}}
          />
        </View>
    </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.textFormTop}
          // placeholder={'이메일 ex) test@example.com'}
          // onChangeText={(userEmail) => setUserId(userEmail)}
          placeholder={'아이디'}
          onChangeText={(userId) => setUserId(userId)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          underlineColorAndroid="#f000"
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormBottom}
          onChangeText={(userPassword) => setUserPassword(userPassword)}
          secureTextEntry={true}
          placeholder={'비밀번호'}
          returnKeyType="next"
          keyboardType="default"
          ref={passwordInputRef}
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
        />
        {errortext != '' ? (
          <Text style={styles.TextValidation}> {errortext}</Text>
        ) : null}
      </View>
      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={handleSubmitPress}>
            <Text style={{color: 'white', fontSize: wp('4%')}}>로그인</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={styles.TextRegister}
          onPress={() => navigation.navigate('Register')}>
          회원가입하시겠어요?
        </Text>
      </View>

      <View style={{flex: 3}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  topArea: {
    flex: 1,
    paddingTop: wp(15),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp('4%'),
    paddingBottom: wp('1%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },
  TextRegister: {
    fontSize: wp('4%'),
    color: 'grey',
    textDecorationLine: 'underline',
    paddingTop: wp(2),
  },
  formArea: {
    justifyContent: 'center',
    // paddingTop: wp(10),
    flex: 1.5,
  },
  textFormTop: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'grey',
  },
  textFormBottom: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'grey',
  },
  btnArea: {
    height: hp(8),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#46c3ad',
  },
});
export default LoginScreen;
