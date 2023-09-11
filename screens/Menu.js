import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { StackActions } from '@react-navigation/native';
import { NORMAL_TEXT_COLOR, BACKGROUND_COLOR, TAB_COLOR, MORE_LINK_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, SIDEBAR_BACKGROUND_COLOR, PAGE_HEIGHT, PAGE_WIDTH, FIRETV_BASE_URL_STAGING, VIDEO_AUTH_TOKEN, ACCESS_TOKEN, DARKED_BORDER_COLOR } from '../constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, ImageBackground, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native-elements';
import Footer from './footer';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
var watchlaterTasks = [];
export default function Menu() {
  const pageName = "";
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [subscription_title, setsubscription_title] = useState("");
  const [watchlistVideo, setWatchlistVideo] = useState();
  const dataFetchedRef = useRef(false);
  const [otp, setOtp] = useState();
  const [otpactivatteError, setotpactivatteError] = useState("");


  const loadData = async () => {
    const firstname = await AsyncStorage.getItem('firstname');
    const email = await AsyncStorage.getItem('email_id');
    const mobile_number = await AsyncStorage.getItem('mobile_number');
    const session = await AsyncStorage.getItem('session');
    const profile_pic = await AsyncStorage.getItem('profile_pic');
    const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
    if (session != "" && session != null) {
      setLogin(true)
      setName(firstname);
      setEmail(email);
      setMobile(mobile_number);
      setsubscription_title(subscriptiontitle)
    }
    if (profile_pic != "" && profile_pic != null)
      setProfilePic(profile_pic)
    await loadWatchLaterData()
  }


  const loadWatchLaterData = async () => {
    var sessionId = await AsyncStorage.getItem('session');
    var region = await AsyncStorage.getItem('country_code');

    axios.get(FIRETV_BASE_URL_STAGING + "/users/" + sessionId + "/playlists/watchlater/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(response => {
      console.log(JSON.stringify(response.data.data.items.length));
      for (var i = 0; i < response.data.data.items.length; i++) {
        watchlaterTasks.push({ 'title': response.data.data.items[i].title, 'thumbnail': response.data.data.items[i].thumbnails.high_4_3.url, 'seo_url': response.data.data.items[i].seo_url, 'theme': response.data.data.items[i].theme, 'listitem_id': response.data.data.items[i].listitem_id, 'contentId': response.data.data.items[i].content_id })
      }
      setWatchlistVideo(watchlaterTasks)
      watchlaterTasks = [];
    }).catch(error => {
      //console.log(JSON.stringify(error.response.data));
    })
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData();
  })
  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  const activateTv = async () => {
    var sessionId = await AsyncStorage.getItem('session');
    var region = await AsyncStorage.getItem('country_code');
    axios.post(FIRETV_BASE_URL_STAGING + "/generate_session_tv", {
      auth_token: VIDEO_AUTH_TOKEN,
      access_token: ACCESS_TOKEN,
      region: region,
      user: { session_id: sessionId, token: otp }
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      alert("Activated");
      setotpactivatteError("")
    }).catch(error => {
      //console.log(JSON.stringify(error.response.data));
      setotpactivatteError(error.response.data.error.message)
    })
  }

  return (
    <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: PAGE_WIDTH, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.leftItems}>
            <Image source={require('../assets/images/winlogo.png')} style={styles.logoImage}></Image>
          </View>
          <View style={{ position: 'absolute', right: 30 }}>
            <Pressable onPress={() => { navigation.navigate('More') }}>
              <FontAwesome name='support' color={NORMAL_TEXT_COLOR} size={40} />
            </Pressable>
          </View>
        </View>
        <View style={{marginBottom:50}}>
          {!login ?

            <ImageBackground
              source={require('../assets/images/drawer_header.png')}
              resizeMode="cover"
              style={styles.drawerHeaderImage}>
              <View style={{ padding: 25 }}>
                <Text style={styles.drawerHeaderText}>Hi Guest User!</Text>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity onPress={() => { toggleModal(); navigation.dispatch(StackActions.replace('Login', {})); }} style={{ backgroundColor: TAB_COLOR, padding: 13, borderRadius: 10, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.drawerHeaderText}>SIGN IN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { toggleModal(); navigation.dispatch(StackActions.replace('Signup', {})); }} style={{ borderColor: TAB_COLOR, padding: 13, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.drawerHeaderText}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>

            :
            <Pressable onPress={() => { navigation.navigate('Profile') }}>
              <View style={styles.drawerHeaderImage}>
                <View style={{ padding: 15, height: 70, backgroundColor: BACKGROUND_TRANSPARENT_COLOR, width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 60, height: 60, borderRadius: 30 }}>

                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 40, fontWeight: 'bold' }}><MaterialCommunityIcons name='account-edit' color={NORMAL_TEXT_COLOR} size={50} style={{}}></MaterialCommunityIcons></Text>

                  </View>
                  <View style={{ bottom: 0, flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={styles.drawerHeaderText}>Hi {name}</Text>
                      {email != "" && email != null && email != 'null' ?
                        <Text style={styles.drawerHeaderText}>{email}</Text>
                        :
                        ""}
                    </View>
                  </View>


                </View>
              </View>
            </Pressable>
          }
          {login ?
            subscription_title == '' || subscription_title == null || subscription_title == 'Free' ?
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>{subscription_title.split('"').join("")}</Text>
                <Pressable onPress={() => navigation.navigate('Subscribe', {})} style={{ position: 'absolute', right: 20 }}>
                  <Image source={require('../assets/images/subscribe.png')} style={styles.subscribeImage}></Image>
                </Pressable>
              </TouchableOpacity>
              :
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>{subscription_title.split('"').join("")}</Text>
                <Pressable onPress={() => navigation.navigate('Subscribe', {})} style={{ backgroundColor: TAB_COLOR, paddingRight: 15, paddingLeft: 15, paddingTop: 10, paddingBottom: 10, borderRadius: 25, position: 'absolute', right: 20 }}>
                  <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20, fontWeight: 'bold' }}>Upgrade</Text>
                </Pressable>
              </TouchableOpacity>
            :
            ""
          }
          {login ?
            <View style={{ padding: 15 }}>
              {watchlistVideo ?

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                  <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 22 }}>Watch List</Text>
                  <Pressable onPress={() => { navigation.navigate('WatchLater') }} style={{ position: 'absolute', right: 20 }}>
                    <Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 15 }}>More</Text>
                  </Pressable>
                </View>
                : ""}
              <ScrollView horizontal={true} style={{ width: '100%' }}>
                {watchlistVideo ?
                  watchlistVideo.map((singleVideo, index) => {
                    return (
                      <View key={index} style={{ borderRadius: 15, borderWidth: 1, marginRight: 5, width: (PAGE_WIDTH / 2) - 17 }}>
                        {singleVideo.thumbnail ?
                          <Pressable onPress={() => navigation.dispatch(StackActions.replace('Episode', { seoUrl: singleVideo.seo_url, theme: singleVideo.theme }))} style={{ alignItems: 'center', }}>


                            <FastImage
                              style={{ width: "100%", height: 120, left: 0, borderRadius: 15, marginRight: 5 }}
                              source={{ uri: singleVideo.thumbnail, priority: FastImage.priority.high }}
                              resizeMode={FastImage.resizeMode.stretch}
                            />
                            {/* <View style={{ justifyContent: 'center', alignSelf: 'center', width: "100%", marginRight: 2 }}>
                          <Text style={{ color: NORMAL_TEXT_COLOR }}>{singleVideo.title}</Text>
                        </View> */}
                          </Pressable>
                          : ""}
                      </View>
                    )
                  })
                  :
                  ""
                }
              </ScrollView>
            </View>
            :
            ""}
          {login ?
            <View style={{ padding: 15 }}>
              <View style={{ alignItems: 'center', marginBottom: 20, }}>
                <Text style={{ fontWeight: 'bold', color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Activate ETV WIN on your TV</Text>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}>Enter the Activation code displayed on your TV screen</Text>
                <View style={{flexDirection:'row'}}>
                  <TextInput
                    textAlign='center'
                    style={styles.input}
                    onChangeText={setOtp}
                    value={otp}
                    placeholder="Enter Activation Code"
                    keyboardType="numeric"
                    placeholderTextColor={NORMAL_TEXT_COLOR}
                  />
                  <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity onPress={activateTv} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Activate</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            :
            ""}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Footer pageName="MENU" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  drawerHeaderText: { color: NORMAL_TEXT_COLOR, fontSize: 25, fontWeight: 'bold' },
  drawerHeaderImage: { width: "100%", height: 120 },
  drawerContainer: { flex: 1, backgroundColor: SIDEBAR_BACKGROUND_COLOR, height: PAGE_HEIGHT, width: (PAGE_WIDTH / 1.3), left: -20, position: 'absolute' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 },
  leftItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
  rightItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },
  logoImage: { width: 100, height: 55, resizeMode: 'contain', marginLeft: 5 },
  subscribeImage: { width: 150, height: 80, resizeMode: 'contain', },
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '70%',
    borderBottomColor: NORMAL_TEXT_COLOR,
    borderTopColor: BACKGROUND_COLOR,
    borderRightColor: BACKGROUND_COLOR,
    borderLeftColor: BACKGROUND_COLOR,
    color: NORMAL_TEXT_COLOR,
    fontSize: 20
  },
  button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 100, padding: 15, borderRadius: 10, marginRight: 20 },
});