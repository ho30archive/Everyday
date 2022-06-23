import React, {useLayoutEffect} from 'react';
import FlashMessage from 'react-native-flash-message';

import {Image, StyleSheet, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import HomeScreen from './Screen/HomeStackScreens/HomeScreen';
import MyHomeScreen from './Screen/HomeStackScreens/MyHomeScreen';
import MissionDetailScreen from './Screen/HomeStackScreens/MissionDetailScreen';
import SearchScreen from './Screen/HomeStackScreens/SearchScreen';
import SearchResultScreen from './Screen/HomeStackScreens/SearchResultScreen';


import TestScreen from './Screen/TestStackScreens/TestScreen';
import TestCreateScreen from './Screen/TestStackScreens/TestCreateScreen';
import TestReadScreen from './Screen/TestStackScreens/TestReadScreen';
import TestReadEachScreen from './Screen/TestStackScreens/TestReadEachScreen';
import ProfileScreen from './Screen/SettingStackScreens/ProfileScreen';
import ProfileEditScreen from './Screen/SettingStackScreens/ProfileEditScreen';

import BackBtn from './Screen/Components/BackBtn';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const TestStack = createStackNavigator();
const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const Tab = createBottomTabNavigator();

//뒤로 가기 버튼 Image 컴포넌트
// function BackBtn() {
//   return (
//     <Image
//       source={require('./src/back-btn.png')}
//       style={{marginLeft: 10, width: 22, height: 22}}
//     />
//   );
// }

const HomeStackScreen = ({navigation, route}) => {
  const getrouteName = async () => {
    const routeName = await getFocusedRouteNameFromRoute(route);

    if (routeName === 'Home' || routeName === undefined) {
      navigation.setOptions({tabBarVisible: true});
    } else {
      navigation.setOptions({tabBarVisible: false});
    }
    return routeName;
  };

  useLayoutEffect(() => {
    const routeName = getrouteName();
  }, [navigation, route]);

  return (
    <Stack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          headerTitle: '',
          headerLeft: () => (
            <Image
              style={{width: wp(25), height: hp(6), resizeMode: 'contain'}}
              source={require('./src/logo2.png')}
            />
          ),
          tabBarVisible: true,
        })}
        component={HomeScreen}
      />
      <HomeStack.Screen name="MyHome" component={MyHomeScreen} />
      <HomeStack.Screen name="MissionDetail" component={MissionDetailScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="SearchResult" component={SearchResultScreen} />
    </Stack.Navigator>
  );
};

const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <SettingStack.Screen name="Profile" component={ProfileScreen} />
      <SettingStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
};

const TestStackScreen = () => {
  return (
    <Stack.Navigator>
      <TestStack.Screen name="Test" component={TestScreen} />
      <TestStack.Screen name="TestCreate" component={TestCreateScreen} />
      <TestStack.Screen name="TestRead" component={TestReadScreen} />
      <TestStack.Screen name="TestReadEach" component={TestReadEachScreen} />
    </Stack.Navigator>
  );
};

const MainTabScreen = ({navigation, route}) => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          let icon = "▲";

          if (route.name === 'TestStack') {
            icon = "🏅";
          } else if (route.name === 'HomeStack') {
            icon = "🌈";
          } else if (route.name === 'SettingStack') {
            icon = "🌙";
          }

          // You can return any component that you like here!
          return (
            <Text style={{ color: (focused && "#46c3ad") || "#888" }}>
              {icon}
            </Text>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#46c3ad",
        inactiveTintColor: "#888",
        showLabel: false,
      }}>
      <Tab.Screen name="TestStack" component={TestStackScreen} />
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="SettingStack" component={SettingStackScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator for Login and Register and Logout Screen
const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackImage: BackBtn,
        }}
      />
    </Stack.Navigator>
  );
};

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTab"
          // options={({route}) => ({
          //   headerTitle: getHeaderTitle(route),
          // })}
          component={MainTabScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
},
wrapButton: {
    width: wp('100%'),
    height: hp('8%'),
    paddingLeft: wp('8%'),
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  }
});

export default App;