import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ImageBackground, Text, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR, TAB_COLOR, MORE_LINK_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, BUTTON_COLOR, FOOTER_DEFAULT_TEXT_COLOR, } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

export default function Header(props) {
    const pageName = props.pageName;
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [login, setLogin] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePic, setProfilePic] = useState();
    const [subscription_title, setsubscription_title] = useState("");
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        // if(isModalVisible)
        // navigation.openDrawer()
        // else
        // navigation.closeDrawer()
    };
    var menuArray = [{}];
    {
        !login ?
            menuArray = [{ 'iconName': 'home', 'pageName': 'Home', 'text': 'Home', 'type': 1, 'pageFriendlyId': 'featured-1', 'navigateTo': 'Home' },
            { 'iconName': 'television-classic', 'pageName': 'LIVE-TV', 'text': 'Live TV', 'type': 1, 'pageFriendlyId': 'live', 'navigateTo': 'OtherResponse' },
            { 'iconName': 'bell-check', 'pageName': 'SUBSCRIPTION', 'text': 'Subscription', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'Subscribe' },
            { 'iconName': 'more', 'pageName': 'MORE', 'text': 'More', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'More' },
            { 'iconName': 'gear', 'pageName': 'Settings', 'text': 'Settings', 'type': 2, 'pageFriendlyId': '', 'navigateTo': 'Settings' }]

            :

            menuArray = [{ 'iconName': 'home', 'pageName': 'Home', 'text': 'Home', 'type': 1, 'pageFriendlyId': 'featured-1', 'navigateTo': 'Home' },
            { 'iconName': 'television-classic', 'pageName': 'LIVE-TV', 'text': 'Live TV', 'type': 1, 'pageFriendlyId': 'live', 'navigateTo': 'OtherResponse' },
            { 'iconName': 'bell-check', 'pageName': 'SUBSCRIPTION', 'text': 'Subscription', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'Subscribe' },

            { 'iconName': 'download', 'pageName': 'OFFLINE', 'text': 'Offline Videos', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'Offline' },
            { 'iconName': 'television-play', 'pageName': 'TV', 'text': 'Activate TV', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'ActivateTv' },
            { 'iconName': 'sticker-plus', 'pageName': 'WATCH-LATER', 'text': 'Watch Later', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'WatchLater' },

            { 'iconName': 'more', 'pageName': 'MORE', 'text': 'More', 'type': 1, 'pageFriendlyId': '', 'navigateTo': 'More' },
            { 'iconName': 'gear', 'pageName': 'Settings', 'text': 'Settings', 'type': 2, 'pageFriendlyId': '', 'navigateTo': 'Settings' }]

    }

    const loadData = async () => {
        const firstname = await AsyncStorage.getItem('firstname');
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        const profile_pic = await AsyncStorage.getItem('profile_pic');
        const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
        //console.log(profile_pic);
        if (session != "" && session != null) {
            setLogin(true)
            setName(firstname);
            setEmail(email);
            setMobile(mobile_number);
            setsubscription_title(subscriptiontitle)
        }
        if (profile_pic != "" && profile_pic != null)
            setProfilePic(profile_pic)

        //console.log(profile_pic);
    }

    useEffect(() => {
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

    return (
        <View style={{}}>
            {/* Drawer Navigation Modal */}
            <Modal
                isVisible={isModalVisible}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackdropPress={toggleModal}
                backdropColor={"black"}
                backdropOpacity={0.40}
            >
                <View style={styles.drawerContainer}>
                    <View>
                        {!login ?

                            <ImageBackground
                                source={require('../assets/images/drawer_header.png')}
                                resizeMode="cover"
                                style={styles.drawerHeaderImage}>
                                <View style={{ padding: 25 }}>
                                    <Text style={styles.drawerHeaderText}>Hi Guest User!</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
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
                            profilePic != "" && profilePic != null && validURL(profilePic) ?
                                <Pressable onPress={() => { toggleModal(); navigation.navigate('Profile') }}>
                                    <View style={styles.drawerHeaderImage}>
                                        <View style={{ padding: 25, height: 170, backgroundColor: BACKGROUND_TRANSPARENT_COLOR, width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 100, height: 100, borderRadius: 50 }}>
                                                {name != "" && name != null && name != 'null' ?
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                                                    :
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>-</Text>
                                                }
                                            </View>

                                            <View style={{ bottom: 0, position: 'absolute', left: 35, flexDirection: 'row' }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.drawerHeaderText}>Hi {name}</Text>
                                                    {email != "" && email != null && email != 'null' ?
                                                        <Text style={styles.drawerHeaderText}>{email}</Text>
                                                        :
                                                        ""}
                                                </View>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                                    <MaterialCommunityIcons name='greater-than' color={SLIDER_PAGINATION_SELECTED_COLOR} size={18}></MaterialCommunityIcons>
                                                </View>
                                            </View>


                                        </View>
                                    </View>
                                </Pressable>
                                :
                                <Pressable onPress={() => { toggleModal(); navigation.navigate('Profile') }}>
                                    <View style={styles.drawerHeaderImage}>
                                        <View style={{ padding: 25, height: 170, backgroundColor: BACKGROUND_TRANSPARENT_COLOR, width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 100, height: 100, borderRadius: 50 }}>
                                                {name != "" && name != null && name != 'null' ?
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                                                    :
                                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>-</Text>
                                                }
                                            </View>
                                            <View style={{ bottom: 0, position: 'absolute', left: 35, flexDirection: 'row' }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={styles.drawerHeaderText}>Hi {name}</Text>
                                                    {email != "" && email != null && email != 'null' ?
                                                        <Text style={styles.drawerHeaderText}>{email}</Text>
                                                        :
                                                        ""}
                                                </View>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                                    <MaterialCommunityIcons name='greater-than' color={SLIDER_PAGINATION_SELECTED_COLOR} size={18}></MaterialCommunityIcons>
                                                </View>
                                            </View>


                                        </View>
                                    </View>
                                </Pressable>
                        }

                        <View style={{ paddingLeft: 30, marginTop: 20 }}>
                            {menuArray.map((singleMenu) => {

                                return (
                                    <Pressable onPress={() => navigation.dispatch(StackActions.replace(singleMenu.navigateTo, { pageFriendlyId: singleMenu.pageFriendlyId }))} style={styles.menuItem} key={singleMenu.pageName}>
                                        {singleMenu.type == 1 ? <MaterialCommunityIcons name={singleMenu.iconName}
                                            size={27}
                                            color={pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                                            :
                                            <FontAwesome name={singleMenu.iconName}
                                                size={27}
                                                color={pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR}></FontAwesome>}

                                        <Text style={{ color: pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR, marginLeft: 15, width: "85%", fontSize: 17 }}>{singleMenu.text}</Text>
                                    </Pressable>

                                )


                            })}


                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header bar*/}

            <View style={styles.headerContainer}>
                <View style={styles.leftItems}>

                    <TouchableOpacity onPress={toggleModal}>
                        {/* <MaterialCommunityIcons
                            name='menu'
                            size={25}
                            color={NORMAL_TEXT_COLOR}
                        ></MaterialCommunityIcons> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (navigation.canGoBack())
                            navigation.goBack()
                        else
                            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }}>
                        <Ionicons name="arrow-back" size={30} color="#ffffff" style={{}} />
                    </TouchableOpacity>

                    <Image source={require('../assets/images/winlogo.png')} style={styles.logoImage}></Image>
                </View>

                <View style={styles.rightItems}>
                    {subscription_title == '' || subscription_title == null || subscription_title == 'Free' ?
                        <TouchableOpacity onPress={() => navigation.navigate('Subscribe', {})} >
                            <LinearGradient
                                useAngle={true}
                                angle={125}
                                angleCenter={{ x: 0.5, y: 0.5 }}
                                colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                                style={styles.button}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome5 name='lock' size={13} color={NORMAL_TEXT_COLOR} style={{ marginRight: 10 }} />
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Subscribe</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        :
                        ""}
                    {/* <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Search', {}))} style={{ marginRight: 10, marginLeft: 7 }}>
                        <FontAwesome5 name="search" size={20} color="white" />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, },
    drawerHeaderText: { color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: 'bold' },
    drawerHeaderImage: { width: "100%", height: 170 },
    drawerContainer: { flex: 1, backgroundColor: SIDEBAR_BACKGROUND_COLOR, height: PAGE_HEIGHT, width: (PAGE_WIDTH / 1.3), left: -20, position: 'absolute' },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: 5 },
    leftItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
    rightItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },
    logoImage: { width: 100, height: 55, resizeMode: 'contain', marginLeft: 5 },
    subscribeImage: { width: 100, height: 50, resizeMode: 'contain', },
    button: { paddingLeft: 10, paddingRight: 10, paddingBottom: 2, paddingTop: 2, borderRadius: 20, marginRight: 5, borderColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5 },
});