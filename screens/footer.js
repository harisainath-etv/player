import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, } from 'react'
import GoogleCast, { useCastDevice, useDevices, useRemoteMediaClient, } from 'react-native-google-cast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, StackActions } from '@react-navigation/native';
import { PAGE_WIDTH, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, NO_CAST_DEVICES, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants'

export default function Footer(props) {
    const pageName = props.pageName;
    const navigation = useNavigation();
    const [castState, setCastSate] = useState();
    const [castSet, setcastSet] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    var client = useRemoteMediaClient()
    const castDevice = useCastDevice()
    const devices = useDevices()

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
        <View>
            <View style={{ zIndex: 1000, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: BACKGROUND_COLOR, width: 100, position: 'absolute',padding:20,borderTopRightRadius:50,borderTopLeftRadius:50 }}>

                    {pageName == 'SHORTS' ?
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="video-check" size={40} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                            <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR,fontSize:15,fontWeight:'bold' }]}>SHORTS</Text>
                        </View>
                        :
                        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Shorts', { pageFriendlyId: 'channels' }))}>
                            <MaterialCommunityIcons name="video-check" size={40} color={NORMAL_TEXT_COLOR} />
                            <Text style={[styles.footerText,{fontSize:15,fontWeight:'bold'}]}>SHORTS</Text>
                        </TouchableOpacity>
                    }

                </View>
            </View>
            <View style={styles.footerContainer}>
                {pageName == 'Home' || pageName == 'live' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="home" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>HOME</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))}>
                        <MaterialCommunityIcons name="home" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>HOME</Text>
                    </TouchableOpacity>

                }

                {pageName == 'TV-CHANNELS' ?
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="television-classic" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>TV CHANNELS</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Channels', { pageFriendlyId: 'channels' }))}>
                        <MaterialCommunityIcons name="television-classic" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>TV CHANNELS</Text>
                    </TouchableOpacity>
                }


                
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="video-check" size={28} color={BACKGROUND_COLOR} />
                        <Text style={[styles.footerText, { color: BACKGROUND_COLOR }]}>TV CHANNELS</Text>
                    </View>

                {pageName == 'NEWS' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>NEWS</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('News', { pageFriendlyId: 'news' }))}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>NEWS</Text>
                    </TouchableOpacity>
                }
                {pageName == 'OFFLINE' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="download" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>OFFLINE</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('Offline', { pageFriendlyId: 'Offline' }))}>
                        <MaterialCommunityIcons name="download" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>OFFLINE</Text>
                    </TouchableOpacity>
                }
                {/* {pageName == 'WATCH-LATER' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="sticker-plus" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>WATCH LATER</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.dispatch(StackActions.replace('WatchLater', { pageFriendlyId: 'WatchLater' }))}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="sticker-plus" size={28} color={NORMAL_TEXT_COLOR} />
                            <Text style={styles.footerText}>WATCH LATER</Text>
                        </View>
                    </TouchableOpacity>
                } */}

            </View>

            {castState != NO_CAST_DEVICES ?
                castSet ?
                    <TouchableOpacity onPress={CastSession}><View style={styles.chromeCast}><MaterialCommunityIcons name="cast-connected" size={20} color="white" /></View></TouchableOpacity>
                    :
                    <TouchableOpacity onPress={toggleModal}><View style={styles.chromeCast}><FontAwesome5 name="chromecast" size={20} color="white" /></View></TouchableOpacity>

                : ""}

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
    devicesList: { fontSize: 18, justifyContent: 'center', alignItems: 'center', padding: 10 },
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
    footerText: { color: NORMAL_TEXT_COLOR, fontSize: 12 },
    footerContainer: { width: PAGE_WIDTH, backgroundColor: BACKGROUND_COLOR, height: 50, borderTopLeftRadius: 15, borderTopRightRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", paddingLeft: 10, paddingRight: 10 },
    iconContainer: { justifyContent: 'center', alignItems: 'center' },
})