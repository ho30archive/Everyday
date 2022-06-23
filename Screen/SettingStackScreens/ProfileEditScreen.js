import React, {useState, createRef, useLayoutEffect, useEffect} from 'react';

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

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import {showMessage, hideMessage} from 'react-native-flash-message';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const ProfileEditScreen = ({route, navigation}) => {
  const {stu_nick, stu_grade, stu_photo} = route.params;

  const preURL = require('../../preURL/preURL');

  const nameInputRef = createRef();
  const gradeInputRef = createRef();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGrade, setUserGrade] = useState('');
  const [userPhoto, setUserPhoto] = useState(stu_photo);
  const [filedata, setFiledata] = useState([]);
  const [isChangeImg, setisChangeImg] = useState(false);
  const [userId, setuserId] = useState('');

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  // const getUserdata = async (userId) => {
  //   const response = await fetch(
  //     preURL.preURL +
  //       '/api/home?' +
  //       new URLSearchParams({
  //         stu_id: userId,
  //       }),
  //     {
  //       method: 'GET',
  //     },
  //   );
  //
  //   if (response.status === 200) {
  //     const responseJson = await response.json();
  //     return responseJson.data.retrievedUser;
  //   } else {
  //     throw new Error('unable to get your User');
  //   }
  // };

  const postImage = async () => {
    const fd = new FormData();
    // console.log('==postimage filedata==');
    // console.log(filedata);

    fd.append('profile_img', {
      name: filedata.fileName,
      uri: filedata.uri,
      type: filedata.type,
    });
    //
    console.log('====fd===');
    console.log(fd);

    await axios
      .post(preURL.preURL + '/api/user/profile/', fd, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const response = res.data;
        console.log(response);
        console.log('The file is successfully uploaded');
        console.log(response.data.file.location);
        setUserPhoto(response.data.file.location);
        updateProfile(response.data.file.location);
      })

      .catch((err) => {
        console.log('에러...');
        console.error(err);
      });
  };

  const updateProfile = (photo) => {
    // console.log('👕지금 보내려는 거...! ');
    // console.log(userName);
    // console.log(userGrade);
    // console.log(photo);

    var dataToSend = {
      stu_nick: userName,
      stu_grade: userGrade,
      stu_photo: photo,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(preURL.preURL + '/api/user/profile/' + userId, {
      method: 'PUT',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          console.log('update profile is Successful.');
        } else {
          console.log('update profile is fail..');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const completeEdit = async () => {
    if (isChangeImg) {
      const editedImg = await postImage();
    } else {
      updateProfile(userPhoto);
    }

    showMessage({
      message: '프로필 정보가 수정되었습니다.',
      type: 'default',
      duration: 2500,
      // autoHide: false,
    });
  };

  const getMultidata = async () => {
    const userId = await getUserid();
    setuserId(userId);
    // setUserName(userdata.stu_nick);
    // setUserGrade(userdata.stu_grade);
    // setUserPhoto(userdata.stu_photo);

    setLoading(false);

    return userId;
  };

  useEffect(() => {
    setUserName(stu_nick);
    setUserPhoto(stu_photo);
    setUserGrade(stu_grade);

    setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => 
      <Image
      source={require('../../src/myProfile.png')}
      style={{width: wp(25), height: hp(20), resizeMode: 'contain'}}
      />,
    });
  }, []);

  useEffect(() => {
    console.log('🙂filedata');
    console.log(filedata);
  }, [filedata]);

  useEffect(() => {
    console.log('👑userPhoto');
    console.log(userPhoto);
  }, [userPhoto]);

  return (
    <View style={styles.container}>
      {/* <Loader loading={loading} /> */}

      <View
        style={{
          height: hp(3),
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginTop: hp(2),
        }}>
        <TouchableOpacity
          onPress={() => {
            completeEdit();
          }}>
          <Text style={{fontSize: wp(4.5), color: 'black'}}>수정완료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imgContainer}>
        <Image source={{uri: userPhoto}} style={styles.profileimg} />
        <View style={styles.uploadBtn}>
          <TouchableOpacity
            // style={{paddingRight: 20}}
            onPress={() => {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 200,
                  maxWidth: 200,
                },
                (response) => {
                  console.log('==response==');
                  console.log(response);

                  if (response.didCancel != true) {
                    setFiledata(response);
                    setUserPhoto(response.uri);
                    setisChangeImg(true);
                  }
                },
              );
            }}>
            <Icon name="image-outline" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formInfoTxt}>닉네임</Text>
        <TextInput
          editable={true}
          style={styles.textForm}
          placeholder={userName}
          placeholderTextColor="black"
          onChangeText={(userName) => setUserName(userName)}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            gradeInputRef.current && gradeInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        </View>
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

  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },

  editbtn: {
    fontSize: wp(4),
    paddingRight: wp(4),
  },

  imgContainer: {
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileimg: {
    resizeMode: 'cover',
    width: wp(40),
    height: wp(40),
    borderRadius: 400,
    borderColor: '#E0E0E0',
  },

  uploadBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 400,
    position: 'absolute',
    left: 210,
    top: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8.3,

    elevation: 14,
  },

  formContainer: {
    marginBottom: hp(3),
    justifyContent: 'center',
  },

  textForm: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4.5),
    marginBottom: 30,
  },

  formInfoTxt: {
    fontSize: wp(4.5),
    color: 'grey',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4),
    marginBottom: 30,
  },

  inputAndroid: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingRight: 10,
    fontSize: wp(4),
    marginBottom: 30,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default ProfileEditScreen;
