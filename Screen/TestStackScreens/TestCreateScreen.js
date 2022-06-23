import React, {useState, useLayoutEffect, useEffect} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Loader from '../Components/Loader';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import {showMessage} from 'react-native-flash-message';
import { RadioButton } from 'react-native-paper';

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
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const TestCreateScreen = ({navigation}) => {
  const preURL = require('../../preURL/preURL');

  const [loading, setLoading] = useState(false);
  const [missionName, setMissionName] = useState('');
  const [missionMemberCount, setMissionMemberCount] = useState('');
  const [missionDetail, setMissionDetail] = useState('');

  const [missionCategory, setMissionCategory] = React.useState('null');
  const [missionTerm, setMissionTerm] = React.useState('null');
  const [missionPenalty, setmissionPenalty] = React.useState('null');
  const user = auth().currentUser;


  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }
  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // if (initializing) return null;



  const createMiniTestFull = async () => {
    var key = Math.random().toString(36).substr(2,11);

    database()
        .ref('/mission/'+ missionCategory +'/' + key)
        .set({
            missionCategory: missionCategory,
            missionMemberCount : missionMemberCount,
            missionTerm: missionTerm,
            missionName: missionName,
            missionDetail: missionDetail,
            missionPenalty: missionPenalty,
            makerId : user.email,
        })
        .then(() => console.log('Data set.'));

        showMessage({
          message: '미션이 생성되었습니다.',
          type: 'default',
          duration: 2500,
          // autoHide: false,
        });
  };

  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <Image
      source={require('../../src/mission.png')}
      style={{width: wp(20), height: hp(10), resizeMode: 'contain'}}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            {
              navigation.goBack();
            }
          }}>
          <Icon
            name="chevron-back-outline"
            size={33}
            style={{paddingLeft: 10}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <ScrollView>
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.topdesc}>
        <Text style={{fontSize: wp(5), fontWeight: 'bold', paddingBottom: 20}}>
          mission을 생성해주세요!
        </Text>
      </View>

      <View style={styles.formArea}>
                    <Text style={{fontWeight: 'bold'}}>카테고리를 선택해주세요.</Text>

                    <RadioButton.Group onValueChange={missionCategory => setMissionCategory(missionCategory)} value={missionCategory}>
                    <RadioButton.Item label="생활 습관" value="lifeCategory" />
                    <RadioButton.Item label="공부/스터디" value="studyCategory" />
                    <RadioButton.Item label="운동/건강" value="workoutCategory" />
                    </RadioButton.Group>

      <View style={styles.namecontainer}>
        <Text style={{fontWeight: 'bold'}}>
          mission name(미션 이름)
        </Text>
        <TextInput
          style={styles.textFormMiddle}
          placeholder={'미션 이름을 입력해주세요.'}
          onChangeText={(missionName) => setMissionName(missionName)}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.namecontainer}>
        <Text style={{fontWeight: 'bold'}}>
          headcount(인원 수)
        </Text>
        <TextInput
          style={styles.textFormMiddle}
          placeholder={'인원 수를 입력해주세요.'}
          onChangeText={(missionMemberCount) => setMissionMemberCount(missionMemberCount)}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>
      <Text style={{marginTop: hp(3), paddingBottom: wp('5%'), fontWeight: 'bold'}}>미션 기간(최대 90일)을 선택해주세요.</Text>

        <RadioButton.Group
        onValueChange={missionTerm => setMissionTerm(missionTerm)} value={missionTerm}>
        <RadioButton.Item label="30일" value="30days" />
        <RadioButton.Item label="60일" value="60days" />
        <RadioButton.Item label="90일" value="90days" />
        </RadioButton.Group>
        

        <Text style={{marginTop: hp(3), paddingBottom: wp('5%'), fontWeight: 'bold'}}>
          mission content(미션 내용)
        </Text>
        <TextInput
          style={styles.textForm2}
          placeholder={'미션 내용을 작성해주세요.'}
          onChangeText={(missionDetail) => setMissionDetail(missionDetail)}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <Text style={{marginTop: hp(3), paddingBottom: wp('5%'), fontWeight: 'bold'}}>패널티를 선택해주세요.</Text>

        <RadioButton.Group onValueChange={missionPenalty => setmissionPenalty(missionPenalty)} value={missionPenalty}>
        <RadioButton.Item label="강퇴" value="expulsion" />
        <RadioButton.Item label="인증서 미제공" value="noCertification" />
        <RadioButton.Item label="랭킹 제외" value="	noRank" />
        </RadioButton.Group>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => {
            createMiniTestFull();
          }}>
          <Text style={{fontSize: wp(4), fontWeight: 'bold', color: 'white'}}>
            생성하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
    </ScrollView>
  );
};








const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
    // justifyContent: 'center',
  },

  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    paddingLeft: wp(2),
  },
  topdesc: {
    justifyContent: 'center',
    marginTop: hp(3),
    height: hp(10),
  },
  formArea: {
    width: '100%',
    paddingBottom: wp('10%'),
  },
  levelcontainer: {
    justifyContent: 'space-around',
    marginTop: hp(3),
    height: hp(10),
  },
  btn: {
    height: wp(10),
    width: wp(30),
    borderRadius: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: '#46c3ad',
  },

  btnContainer: {
    paddingTop: hp(3),
    height: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  namecontainer: {
    justifyContent: 'space-around',
    height: hp(15),
  },
  notecontainer: {
    justifyContent: 'flex-start',
    marginTop: hp(2),
    height: hp(20),
  },
  textFormMiddle: {
    borderWidth: 1,
    borderRadius: 7,
    width: '100%',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textForm2: {
    borderWidth: 0.5,
    borderColor: '#888',
    width: '100%',
    height: hp('20%'),
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
},

});

export default TestCreateScreen;
