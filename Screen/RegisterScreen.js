import React, {useState, createRef} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import Loader from './Components/Loader';
import {showMessage} from 'react-native-flash-message';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';

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


const RegisterScreen = (props) => {

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordchk, setUserPasswordchk] = useState('');
  const [userPhoneNum, setUserPhoneNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [isRegistraionFail, setIsRegistraionFail] = useState(false);
  const [isRegistraionForm, setIsRegistraionForm] = useState(false);

  const emailInputRef = createRef();
  const idInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordchkInputRef = createRef();
  const nameInputRef = createRef();
  const phonenumInputRef = createRef();

  // const placeholder = {
  //   label: '성별을 선택해주세요',
  //   value: null,
  //   color: '#9EA0A4',
  // };

  const handleSubmitButton = () => {
    setErrortext('');

    if (!userName) {
      alert('이름을 입력해주세요');
      return;
    }
    if (!userEmail) {
      alert('Email를 입력해주세요');
      return;
    }

    if (!userPassword) {
      alert('비밀번호를 입력해주세요');
      return;
    }
    if (userPasswordchk != userPassword) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }
    if (!userId) {
      alert('아이디를 입력해주세요');
      return;
    }
    if (!userName) {
      alert('성함을 입력해주세요');
      return;
    }
    if (!userPhoneNum) {
      alert('전화번호를 입력해주세요');
      return;
    }
    if (isRegistraionFail) {
      alert("중복된 이메일입니다.");
      setIsRegistraionFail(false)
      return;
    }
    if (isRegistraionForm) {
      alert("이메일 형식이 올바르지 않습니다.");
      setIsRegistraionForm(false)
      return;
    }

      auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(() => {
        console.log('User account created & signed in!');
        setIsRegistraionSuccess(true)
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use'){
          setIsRegistraionFail(true)
        }
        if (error.code === 'auth/invalid-email') {
          setIsRegistraionForm(true)
        }
        console.error(error)
      }
      )

      database()
        .ref('/users/' + userId)
        .set({
            email: userEmail,
            password : userPassword,
            name : userName,
            phonNum : userPhoneNum,
        })
        .then(() => console.log('users Data set.'));

        showMessage({
          message: '회원가입이 완료되었습니다.',
          type: 'default',
          duration: 2500,
          // autoHide: false,
        });

      console.log('handleSignUp')
  };

  if (isRegistraionSuccess) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 2}}>
          <View
            style={{
              height: hp(13),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../src/success.png')}
              style={{
                height: wp(20),
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              height: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'grey', fontSize: wp('4%')}}>
              회원가입이 완료되었습니다.
            </Text>
          </View>

          <View style={{height: hp(20), justifyContent: 'center'}}>
            <View style={styles.btnArea}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.5}
                onPress={() => props.navigation.navigate('Login')}>
                <Text style={{color: 'white', fontSize: wp('4%')}}>
                  로그인하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image
            source={require('../src/Register.png')}
            style={{width: wp(60),marginTop: 60, resizeMode: 'contain'}}
          />
        </View>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'이메일 ex) test@example.com'}
          onChangeText={(userEmail) => setUserEmail(userEmail)}
          ref={emailInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormMiddle}
          secureTextEntry={true}
          placeholder={'비밀번호(8자 이상)'}
          onChangeText={(UserPassword) => setUserPassword(UserPassword)}
          ref={passwordInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordchkInputRef.current && passwordchkInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormBottom}
          secureTextEntry={true}
          placeholder={'비밀번호 확인'}
          onChangeText={(UserPasswordchk) =>
            setUserPasswordchk(UserPasswordchk)
          }
          ref={passwordchkInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            nameInputRef.current && nameInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
      </View>

      <View style={{flex: 0.5, justifyContent: 'center'}}>
        {userPassword !== userPasswordchk ? (
          <Text style={styles.TextValidation}>
            비밀번호가 일치하지 않습니다.
          </Text>
        ) : null}
      </View>

      <View style={styles.formArea2}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'아이디'}
          onChangeText={(userId) => setUserId(userId)}
          ref={idInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            idInputRef.current && idInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormMiddle}
          placeholder={'이름'}
          onChangeText={(userName) => setUserName(userName)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            nameInputRef.current && nameInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormBottom}
          placeholder={'전화번호'}
          onChangeText={(userPhoneNum) => setUserPhoneNum(userPhoneNum)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            phonenumInputRef.current && phonenumInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
      </View>

      <View style={{flex: 0.7, justifyContent: 'center'}}>
        {errortext2 !== '' ? (
          <Text style={styles.TextValidation}>{errortext2}</Text>
        ) : null}
      </View>

      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={handleSubmitButton}>
            <Text style={{color: 'white', fontSize: wp('4%')}}>회원가입</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1.5,
    paddingTop: wp(2),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    paddingTop: hp(3),
  },
  alertArea: {
    height: wp(150),
  },
  Text: {
    fontSize: wp(4),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    // paddingTop: wp(5),
  },

  formArea: {
    flex: 4,
    justifyContent: 'center',
    // paddingTop: wp(10)
    // backgroundColor: 'red',
    marginBottom: hp(-5),
  },

  formArea2: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginBottom: hp(-2),
    // alignSelf: 'stretch',
  },

  textFormTop: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'grey',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormMiddle: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'grey',
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormBottom: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: 'grey',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
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
  inputIOS: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: 'grey',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: 'grey',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },

  inputAndroid: {
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: 'grey',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    color: 'grey',
    height: hp(6),
    width: wp(86),
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default RegisterScreen;