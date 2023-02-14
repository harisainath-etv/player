import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect, } from 'react'
import GoogleCast, { useCastDevice, useDevices, useRemoteMediaClient, } from 'react-native-google-cast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
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
    const castData = () => {
        if (client) {
            client.loadMedia({
                mediaInfo: {
                    contentUrl:
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
                    contentType: 'video/mp4',
                },
            })
        }
    }
    const CastSession = (castSession) =>{
        const sessionManager = GoogleCast.getSessionManager()
        if(castSet)
        {
            sessionManager.endCurrentSession()
            setcastSet(false)
        }
        else
        {
            sessionManager.startSession(castSession)
            setcastSet(true)
        }
    }
    useEffect(() => {
        GoogleCast.getCastState().then(state => {
            setCastSate(state);
        })
        GoogleCast.onCastStateChanged((castState) => {
            setCastSate(castState);
        })
    })
    return (
        <View>
            <View style={styles.footerContainer}>

                {pageName == 'Home' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="home" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>HOME</Text>
                    </View>
                    :
                    <TouchableOpacity  style={styles.iconContainer} onPress={()=>navigation.navigate({ name: 'Home', params: { pageFriendlyId: 'featured-1' }, key: 'featured-1' })}>
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
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="television-classic" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>TV CHANNELS</Text>
                    </View>
                }

                {pageName == 'NEWS' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>NEWS</Text>
                    </View>
                    :
                    <TouchableOpacity style={styles.iconContainer} onPress={()=>navigation.navigate('News',{pageFriendlyId:'news'})}>
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
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="download" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>OFFLINE</Text>
                    </View>
                }
                {pageName == 'WATCH-LATER' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="sticker-plus" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>WATCH LATER</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="sticker-plus" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>WATCH LATER</Text>
                    </View>
                }

            </View>
            
            {castState != NO_CAST_DEVICES ?
                <TouchableOpacity onPress={toggleModal}><View style={styles.chromeCast}><FontAwesome5 name="chromecast" size={20} color="white" /></View></TouchableOpacity>
                : ""}

            {devices ?
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal}
                >
                    <View style={styles.drawerContainer}>
                        {devices.map((singleDevice)=>{
                            return(
                                
                                <TouchableOpacity key={singleDevice.friendlyName} onPress={()=>{CastSession(singleDevice.deviceId)}} style={{width:"100%"}}><View style={styles.deviceContainer}><Text style={styles.devicesList}>{singleDevice.friendlyName}</Text></View></TouchableOpacity>
                            )
                        })}
                    </View>
                </Modal> : ""
            }
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContainer: { backgroundColor: NORMAL_TEXT_COLOR, height: 'auto', justifyContent:'center',alignItems:'center' },
    devicesList:{fontSize:18,justifyContent:'center',alignItems:'center',padding:10},
    deviceContainer:{borderBottomColor:BACKGROUND_COLOR,borderBottomWidth:1,width:"100%", justifyContent:'center',alignItems:'center' },
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