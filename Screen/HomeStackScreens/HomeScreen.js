import React, {useState, useEffect, useRef, useLayoutEffect, Component} from 'react';
import {useIsFocused} from '@react-navigation/native';
import InformationCard from "@paraboly/react-native-information-card";
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
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {showMessage} from 'react-native-flash-message';


//예를들어 문자열 변수명 테스트
const t1 = "1일 1알고리즘"
const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    getMultidata();
    // Put Your Code Here Which You Want To Refresh or Reload on Coming Back to This Screen.
  }, [isFocused]);

  const preURL = require('../../preURL/preURL');

  const [userData, setUserData] = useState([]);
  const [workbookData, setWorkbookData] = useState([]);
  const [acabookData, setAcabookData] = useState([]);
  const [incornoteData, setIncornoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState([]);
  const [stuId, setStuId] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [colorURL, setColorURL] = useState('https://i.ibb.co/vsv7pWR/red.png');

  const refRBSheet = useRef();
  const createNoterefRBSheet = useRef();
  const minitestSheet = useRef();

  const getUserid = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    return userId;
  };

  const getUserdata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );

    if (response.status === 200) {
      const responseJson = await response.json();
      return responseJson.data.retrievedUser;
    } else {
      throw new Error('unable to get your User');
    }
  };

  const getMyMissiondata = async (userId) => {
    const response = await fetch(
      preURL.preURL +
        '/api/home/MyMission?' +
        new URLSearchParams({
          stu_id: userId,
        }),
      {
        method: 'GET',
      },
    );

    if (response.status === 200) {
      const responseJson = await response.json();
      if (responseJson.status === 'success') {
        return responseJson.data.bookInfo;
      } else if (responseJson.status === 'null') {
        return [];
      }
    } else {
      throw new Error('unable to get your Mission');
    }
  };

  // const getIncornotedata = async (userId) => {
  //   const response = await fetch(
  //     preURL.preURL +
  //       '/api/home/incor-note?' +
  //       new URLSearchParams({
  //         stu_id: userId,
  //       }),
  //     {
  //       method: 'GET',
  //     },
  //   );

  //   if (response.status === 200) {
  //     const responseJson = await response.json();
  //     if (responseJson.status === 'success') {
  //       return responseJson.data.bookInfo;
  //     } else if (responseJson.status === 'null') {
  //       return [];
  //     }
  //   }
  // };

  //assemble multi Apifetch functions
  const getMultidata = async () => {
    const userId = await getUserid();
    setStuId(userId);
    const userdata = await getUserdata(userId);
    setUserData(userdata);

    const workbookdata = await getWorkbookdata(userId);
    setWorkbookData(workbookdata);

    const acabookdata = await getAcabookdata(userId);
    setAcabookData(acabookdata);
    await getIncornotedata(userId);
    const incornotedata = await getIncornotedata(userId);
    setIncornoteData(incornotedata);
    setLoading(false);

    return incornotedata;
  };
  // const createNote = (stuId) => {
  //   var dataToSend = {
  //     stu_id: stuId,
  //     note_name: noteTitle,
  //     note_photo: colorURL,
  //   };
  //   var formBody = [];
  //   for (var key in dataToSend) {
  //     var encodedKey = encodeURIComponent(key);
  //     var encodedValue = encodeURIComponent(dataToSend[key]);
  //     formBody.push(encodedKey + '=' + encodedValue);
  //   }
  //   formBody = formBody.join('&');

  //   fetch(preURL.preURL + '/api/book-list/incor-note', {
  //     method: 'POST',
  //     body: formBody,
  //     headers: {
  //       //Header Defination
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.log(responseJson);
  //       // If server response message same as Data Matched
  //       if (responseJson.status === 'success') {
  //         console.log('create note is Successful.');
  //       } else {
  //         console.log('create note is fail..');
  //       }
  //     })
  //     .catch((error) => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.error(error);
  //     });
  // };

  useEffect(() => {
    setLoading(true);
    getMultidata();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{paddingRight: 20}}
          onPress={() => {
            {
              navigation.navigate('Search', {
                stu_id: stuId,
              });
            }
          }}>
          <Icon name="search-outline" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);

const missionBtn = () => {
  return (
    <TouchableOpacity
      style={{}}
      onPress={() => {
        {
          navigation.navigate('MissionDetail', {
            stu_id: stuId,
          });
        }
      }}>
      <Text style={{
        color: "#fff",
        textAlign:"right",
        fontWeight: "bold"}}>미션하기</Text>
    </TouchableOpacity>
  );
};
    return (
    <View style={styles.container}>
      {/* 미션 카테고리 탭 */}
      <View style={styles.container_category}>
      <TouchableOpacity style={styles.category_btn}
        onPress={() => {
          {
            navigation.navigate('Study', {
              stu_id: stuId,
            });
          }
        }}>
        <Text style={{color: 'white'}}>스터디/공부</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.category_btn}>
                <Text style={{color: 'white'}}>운동/건강</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.category_btn}>
                <Text style={{color: 'white'}}>일상/습관</Text>
      </TouchableOpacity>
      </View>
        {/*user's Mission*/}
        <View style={styles.container_bookheader}>
          <View style={styles.container_bookctgtitle}>
            <Text style={{color: 'grey',fontSize: wp(4)}}>
              {userData.stu_nick}님의 미션</Text>
          </View>
          <View style={styles.container_bookbtn}>
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate('MyHome', {
                    stu_id: stuId,
                  });
                }
              }}>
              <Icon name="chevron-forward-outline" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={[styles.container_book]}>
          <FlatList
            style={styles.list}
            horizontal={true}
            data={Object.values(Data)}
            renderItem={Items}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={plusBook()}
          />
        </View> */}
      {/* 랜덤 미션 목록 추천순? */}
      <ScrollView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={{ marginTop: 12 }}>

          <InformationCard
            fontFamily="Montserrat-Regular"
            title = {`${t1}`}
            description= "1일1알고리즘으로 실력을 키우자!"
            dateTitle="진행 중"
            dateText="10일 째"
            secondaryDateTitle="참여인원"
            secondaryDateText="1명"
            statusText={missionBtn()}
            borderColor="#46c3ad"
            statusColor="#46c3ad"
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <InformationCard
            fontFamily="Montserrat-Regular"
            title = '매일 걷기 30분👟'
            description= "건강을 위해 매일 걷자!"
            dateTitle="진행 중"
            dateText="28일 째"
            secondaryDateTitle="참여인원"
            secondaryDateText="6명"
            statusText={missionBtn()}
            borderColor="#46c3ad"
            statusColor="#46c3ad"
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <InformationCard
            fontFamily="Montserrat-Regular"
            title = '헬스장 출석🏋️'
            description= "미루지 말고 같이 해요!"
            dateTitle="진행 중"
            dateText="2일 째"
            secondaryDateTitle="참여인원"
            secondaryDateText="5명"
            statusText={missionBtn()}
            borderColor="#46c3ad"
            statusColor="#46c3ad"
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <InformationCard
            fontFamily="Montserrat-Regular"
            title = '하루 물 2리터💧'
            description= "물마시는 습관 같이 만들어요~"
            dateTitle="진행 중"
            dateText="14일 째"
            secondaryDateTitle="참여인원"
            secondaryDateText="8명"
            statusText={missionBtn()}
            borderColor="#46c3ad"
            statusColor="#46c3ad"
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <InformationCard
            fontFamily="Montserrat-Regular"
            title = '토익 스터디📝'
            description= "토익 공부 인증하면서 같이 점수 올립시다!"
            dateTitle="진행 중"
            dateText="4일 째"
            secondaryDateTitle="참여인원"
            secondaryDateText="10명"
            statusText={missionBtn()}
            borderColor="#46c3ad"
            statusColor="#46c3ad"
          />
        </View>
        </SafeAreaView>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    // paddingLeft: wp(7),
    // paddingRight: wp(7),
  },
  container_category: {
    // flex: 0.15,
    height: hp(6),
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  category_btn:{
    margin: wp(4),
    height: wp(6),
    width: '25%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#46c3ad',

  },
  container_book: {
    // flex: 3,
    height: hp(18),
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  },
  container_bookheader: {
    width: wp(100),
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'space-between',
  },

  container_bookctgtitle: {
    width: wp(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: wp(7),
  },

  container_bookbtn: {
    paddingRight: wp(1),
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  first: {
    backgroundColor: 'lightgoldenrodyellow',
  },
  second: {
    backgroundColor: 'lightgrey',
  },
  third: {
    backgroundColor: 'lightpink',
  },

  book: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 0,
    borderRadius: 5,

    elevation: 7,

    ...Platform.select({
      ios: {
        margin: wp(3),
        marginBottom: wp(5),
        overflow: 'visible',
        width: wp(32),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.15,
        shadowRadius: 9.51,
      },
      android: {
        overflow: 'visible',
        margin: wp(3),
        width: wp(29),
      },
    }),
  },
  bookimg: {
    resizeMode: 'cover',
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,

    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },

  list: {
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },

  titleText: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  txtArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnArea: {
    flex: 1,
    // height: hp(7),
    // backgroundColor: 'orange',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },

  btn: {
    // margin: wp(6),
    // marginTop: 0,
    // flex: 1,
    // width: wp(75),
    // borderRadius: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'black',
  },
  btnoutline: {
    margin: wp(6),
    marginBottom: 0,
    flex: 1,
    width: wp(75),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
export default HomeScreen;
