import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, } from 'react'
import GoogleCast, { useCastDevice, useDevices, useRemoteMediaClient, CastButton } from 'react-native-google-cast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, StackActions, useIsFocused } from '@react-navigation/native';
import { PAGE_WIDTH, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, NO_CAST_DEVICES, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, FIRETV_BASE_URL_STAGING, AUTH_TOKEN, FOOTER_DEFAULT_TEXT_COLOR, PAGE_HEIGHT } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Footer(props) {
    const pageName = props.pageName;
    const navigation = useNavigation();
    const [castState, setCastSate] = useState();
    const [castSet, setcastSet] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const [login, setLogin] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePic, setProfilePic] = useState();
    const [subscription_title, setsubscription_title] = useState("");
    const [castDisplay, setCastDisplay] = useState('basic_plan');
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const isfocued = useIsFocused()
    var client = useRemoteMediaClient()
    const castDevice = useCastDevice()
    const devices = useDevices()
    useEffect(()=>{
        const finalSes =async()=>{
            try {
                const session_hand = await AsyncStorage.getItem('session');
                setLogin(session_hand ? JSON.stringify(session_hand):null);
            } catch (error) {
                setLogin(null);
            }
        }
        finalSes();
    },[isfocued])
    const loadData = async () => {
        const firstname = await AsyncStorage.getItem('firstname');
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        const profile_pic = await AsyncStorage.getItem('profile_pic');
        const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
        const plandetail = await AsyncStorage.getItem('plan_id');
        setCastDisplay(plandetail);
        if (session != "" && session != null) {
            await axios.get(FIRETV_BASE_URL_STAGING + "user/session/" + session + "?auth_token=" + AUTH_TOKEN).then(resp => {
                if (resp.data.message == 'Valid session id.') {
                    setName(firstname);
                    setEmail(email);
                    setMobile(mobile_number);
                    setsubscription_title(subscriptiontitle)
                }
            }).catch(err => {
                console.log(err);
            })
        }
        if (profile_pic != "" && profile_pic != null)
            setProfilePic(profile_pic)

        //console.log(profile_pic);
    }

    const CastSession = (castSession) => {
        const sessionManager = GoogleCast.getSessionManager()
        if (castSet) {
            sessionManager.endCurrentSession()
            setcastSet(false)
            alert('Disconnected');
        }
        else {
            sessionManager.startSession(castSession)
            setcastSet(true)
            toggleModal()
            alert('Connected');
        }
    }
    useEffect(() => {
        loadData();
        GoogleCast.getCastState().then(state => {
            setCastSate(state);
            if (state == 'connected') {
                setcastSet(true)
            }
            else {
                setcastSet(false)
            }
        })
        GoogleCast.onCastStateChanged((castState) => {
            setCastSate(castState);
            if (castState == 'connected') {
                setcastSet(true)
            }
            else {
                setcastSet(false)
            }
        })
    })
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, position: 'absolute', bottom: 0 }}>
            <View style={styles.footerContainer}>
                {pageName == 'Home' ?

                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))}>
                        <MaterialCommunityIcons name="home" size={20} color={NORMAL_TEXT_COLOR} />
                        <Text style={[styles.footerText, { color: NORMAL_TEXT_COLOR }]}>Home</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))}>
                        <MaterialCommunityIcons name="home" size={20} color={FOOTER_DEFAULT_TEXT_COLOR} />
                        <Text style={styles.footerText}>Home</Text>
                    </TouchableOpacity>

                }

                {pageName == 'LIVE' || pageName == 'live' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="youtube-tv" size={20} color={NORMAL_TEXT_COLOR} />
                        <Text style={[styles.footerText, { color: NORMAL_TEXT_COLOR }]}>Live</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('OtherResponse', { pageFriendlyId: 'live' }))}>
                        <MaterialCommunityIcons name="youtube-tv" size={20} color={FOOTER_DEFAULT_TEXT_COLOR} />
                        <Text style={styles.footerText}>Live Tv</Text>
                    </TouchableOpacity>
                }



                <View style={styles.iconContainer}>
                    {pageName == 'SHORTS' ?
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="video-box" size={20} color={NORMAL_TEXT_COLOR} />
                            <Text style={[styles.footerText, { color: NORMAL_TEXT_COLOR, }]}>Shorts</Text>
                        </View>
                        :
                        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Shorts', { pageFriendlyId: 'channels' }))}>
                            <MaterialCommunityIcons name="video-box" size={20} color={FOOTER_DEFAULT_TEXT_COLOR} />
                            <Text style={[styles.footerText]}>Shorts</Text>
                        </TouchableOpacity>
                    }
                </View>

                {pageName == 'SEARCH' ?

                    <View style={styles.iconContainer}>
                        <MaterialIcons name="search" size={20} color={NORMAL_TEXT_COLOR} />
                        <Text style={[styles.footerText, { color: NORMAL_TEXT_COLOR }]}>Search</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Search', {}))}>
                        <MaterialIcons name="search" size={20} color={FOOTER_DEFAULT_TEXT_COLOR} />
                        <Text style={styles.footerText}>Search</Text>
                    </TouchableOpacity>
                }
                {pageName == 'MENU' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="account-wrench" size={20} color={NORMAL_TEXT_COLOR} />
                        <Text style={[styles.footerText, { color: NORMAL_TEXT_COLOR }]}>My Space</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() =>
                        login ?
                            navigation.dispatch(StackActions.replace('Menu', { pageFriendlyId: 'Menu' }))
                            :
                            navigation.dispatch(StackActions.replace('Login'))
                    }>
                        <MaterialCommunityIcons name="account-wrench" size={20} color={FOOTER_DEFAULT_TEXT_COLOR} />
                        <Text style={styles.footerText}>My Space</Text>
                    </TouchableOpacity>
                }
            </View>

            {/* {castState != NO_CAST_DEVICES && pageName != 'SHORTS' ?
                castSet ?
                    <TouchableOpacity onPress={CastSession}><View style={styles.chromeCast}><MaterialCommunityIcons name="cast-connected" size={20} color="white" /></View></TouchableOpacity>
                    :
                    <TouchableOpacity onPress={toggleModal}><View style={styles.chromeCast}><FontAwesome5 name="chromecast" size={20} color="white" /></View></TouchableOpacity> */}

            {/* : ""} */}

            {devices ?
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal}
                >
                    <View style={styles.drawerContainer}>
                        {devices.map((singleDevice) => {
                            return (

                                <TouchableOpacity key={singleDevice.friendlyName} onPress={() => { CastSession(singleDevice.deviceId) }} style={{ width: "100%" }}><View style={styles.deviceContainer}><Text style={styles.devicesList}>{singleDevice.friendlyName}</Text></View></TouchableOpacity>
                            )
                        })}
                    </View>
                </Modal> :

                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal}
                >
                    <View style={styles.drawerContainer}>
                        <View style={{ width: "100%" }}><View style={styles.deviceContainer}><Text style={styles.devicesList}>No Devices Available</Text></View></View>
                    </View>
                </Modal>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContainer: { backgroundColor: NORMAL_TEXT_COLOR, height: 'auto', justifyContent: 'center', alignItems: 'center' },
    devicesList: { fontSize: 14, justifyContent: 'center', alignItems: 'center', padding: 10 },
    deviceContainer: { borderBottomColor: BACKGROUND_COLOR, borderBottomWidth: 1, width: "100%", justifyContent: 'center', alignItems: 'center' },
    chromeCast: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: BACKGROUND_TRANSPARENT_COLOR,
        position: 'absolute',
        bottom: 50,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    footerText: { color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 9, marginTop: 2 },
    footerContainer: { width: PAGE_WIDTH, flexDirection: 'row', justifyContent: 'space-around', alignItems: "center", paddingLeft: 10, paddingRight: 10, marginBottom: 6, marginTop: 6 },
    iconContainer: { justifyContent: 'center', alignItems: 'center' },
})