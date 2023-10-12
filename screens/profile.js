import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR, TAB_COLOR, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, VIDEO_AUTH_TOKEN, ACCESS_TOKEN, FIRETV_BASE_URL_STAGING, SLIDER_PAGINATION_UNSELECTED_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, APP_VERSION, BUTTON_COLOR, FOOTER_DEFAULT_TEXT_COLOR, } from '../constants';
import { DETAILS_TEXT_COLOR } from '../constants';
import { StackActions } from '@react-navigation/native';
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';



export default function Profile({ navigation }) {
    const [login, setLogin] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [dob, setdob] = useState("");
    const [gender, setgender] = useState("");
    const [address, setaddress] = useState("");
    const [subscription_title, setsubscription_title] = useState("");
    const [expireson, setexpireson] = useState("");

    const loadData = async () => {
        const firstname = await AsyncStorage.getItem('firstname');
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        const profile_pic = await AsyncStorage.getItem('profile_pic');
        const birthdate = await AsyncStorage.getItem('birthdate');
        const gender = await AsyncStorage.getItem('gender');
        const address = await AsyncStorage.getItem('address');
        const valid_till = await AsyncStorage.getItem('valid_till');
        var datetime = new Date(valid_till);
        const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
        if (session != "" && session != null) {
            setLogin(true)
            setName(firstname);
            setEmail(email);
            setMobile(mobile_number);
            setdob(birthdate);
            setgender(gender)
            setaddress(address)
            setsubscription_title(subscriptiontitle)
            setexpireson(datetime.getDate() + "-" + datetime.getMonth() + "-" + datetime.getFullYear())
        }
        if (profile_pic != "" && profile_pic != null)
            setProfilePic(profile_pic)

        //console.log(profile_pic);
    }
    useEffect(() => {
        loadData();
    })
    const signout = async () => {
        var session = await AsyncStorage.getItem('session');
        var userobj = await AsyncStorage.getItem('userobj');
        axios.post(FIRETV_BASE_URL_STAGING + "users/" + session + "/sign_out", {
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            user: userobj
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch(error => {
            console.log(JSON.stringify(error.response.data));
        })
        await AsyncStorage.clear();
        await loadasyncdata();
        var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/'
        if (await RNFS.exists(downloaddirectory)) {
            await RNFS.unlink(downloaddirectory)
        }
        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
    }

    const signoutall = async () => {
        var session = await AsyncStorage.getItem('session');
        var userobj = await AsyncStorage.getItem('userobj');
        axios.post(FIRETV_BASE_URL_STAGING + "users/" + session + "/sign_out_all", {
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            type: 'session',
            id: session,
            user: userobj
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch(error => {
            console.log(JSON.stringify(error.response.data));
        })
        await AsyncStorage.clear();
        await loadasyncdata()
        var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/'
        if (await RNFS.exists(downloaddirectory)) {
            await RNFS.unlink(downloaddirectory)
        }
        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
    }
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    const loadasyncdata = async () => {
        await AsyncStorage.setItem('firstload', 'no');
        const getCurrentVersion = await AsyncStorage.getItem('currentVersion');

        //fetching ip data
        const ipdetails = FIRETV_BASE_URL + "/regions/autodetect/ip.gzip?auth_token=" + AUTH_TOKEN;
        const ipResp = await fetch(ipdetails);
        const ipData = await ipResp.json();
        await AsyncStorage.setItem('requestIp', ipData.region.request)
        await AsyncStorage.setItem('ip', ipData.region.ip)
        await AsyncStorage.setItem('country_code', ipData.region.country_code2)
        await AsyncStorage.setItem('country_name', ipData.region.country_name)
        await AsyncStorage.setItem('continent_code', ipData.region.continent_code)
        await AsyncStorage.setItem('latitude', JSON.stringify(ipData.region.latitude))
        await AsyncStorage.setItem('longitude', JSON.stringify(ipData.region.longitude))
        await AsyncStorage.setItem('timezone', ipData.region.timezone)
        await AsyncStorage.setItem('calling_code', ipData.region.calling_code)
        await AsyncStorage.setItem('min_digits', JSON.stringify(ipData.region.min_digits))
        await AsyncStorage.setItem('max_digits', JSON.stringify(ipData.region.max_digits))


        if (getCurrentVersion != APP_VERSION) {
            //fetching app config data
            const appConfig = FIRETV_BASE_URL + "/catalogs/message/items/app-config-params.gzip?region=" + ipData.region.country_code2 + "&auth_token=" + AUTH_TOKEN + "&current_version=" + APP_VERSION;
            const appConfigResp = await fetch(appConfig);
            const appConfigData = await appConfigResp.json();
            await AsyncStorage.setItem('configTitle', appConfigData.data.title);
            if (Platform.OS == "android") {
                await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.android_version.current_version);
                await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.android_version.min_version);
                await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.android_version.force_upgrade);
                await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.android_version.message);
                if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.android_version.force_upgrade == true) {
                    alert(appConfigData.data.params_hash2.config_params.android_version.message);
                    return true;
                }
            }
            else
                if (Platform.OS == "ios") {
                    await AsyncStorage.setItem('currentVersion', appConfigData.data.params_hash2.config_params.ios_version.current_version);
                    await AsyncStorage.setItem('minVersion', appConfigData.data.params_hash2.config_params.ios_version.min_version);
                    await AsyncStorage.setItem('forceUpdate', appConfigData.data.params_hash2.config_params.ios_version.force_upgrade);
                    await AsyncStorage.setItem('forceUpdateMessage', appConfigData.data.params_hash2.config_params.ios_version.message);
                    if (APP_VERSION < appConfigData.data.params_hash2.config_params.android_version.min_version || appConfigData.data.params_hash2.config_params.ios_version.force_upgrade == true) {
                        alert(appConfigData.data.params_hash2.config_params.android_version.message);
                        return true;
                    }
                }
            if (appConfigData.data.params_hash2.config_params.popup_details.show_popup) {
                await AsyncStorage.setItem('show_popup', 'yes');
                if (ipData.region.country_code2 == 'IN') {
                    await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.images.high_3_4);
                }
                else {
                    await AsyncStorage.setItem('popupimage', appConfigData.data.params_hash2.config_params.popup_details.other_region_images.high_3_4);
                }
                await AsyncStorage.setItem('redirect_type', appConfigData.data.params_hash2.config_params.popup_details.redirect_type);
            }
            else
                await AsyncStorage.setItem('show_popup', 'no');
            await AsyncStorage.setItem('dndStartTime', appConfigData.data.params_hash2.config_params.dnd[0].start_time);
            await AsyncStorage.setItem('dndEndTime', appConfigData.data.params_hash2.config_params.dnd[0].end_time);
            await AsyncStorage.setItem('faq', appConfigData.data.params_hash2.config_params.faq);
            await AsyncStorage.setItem('contactUs', appConfigData.data.params_hash2.config_params.contact_us);
            const jsonData = ((appConfigData.data.params_hash2.config_params))
            for (var t in jsonData) {
                if (t == 't&c') {
                    await AsyncStorage.setItem('termsCondition', jsonData[t]);
                }
            }
            await AsyncStorage.setItem('privacy', appConfigData.data.params_hash2.config_params.privacy_policy);
            await AsyncStorage.setItem('about', appConfigData.data.params_hash2.config_params.about_us);
            await AsyncStorage.setItem('webPortalUrl', appConfigData.data.params_hash2.config_params.web_portal_url);
            await AsyncStorage.setItem('offlineDeleteDays', appConfigData.data.params_hash2.config_params.offline_deletion_days);
            await AsyncStorage.setItem('globalViewCount', JSON.stringify(appConfigData.data.params_hash2.config_params.global_view_count));
            await AsyncStorage.setItem('commentable', JSON.stringify(appConfigData.data.params_hash2.config_params.commentable));
            await AsyncStorage.setItem('subscriptionUrl', appConfigData.data.params_hash2.config_params.subscription_url);
            await AsyncStorage.setItem('tvLoginUrl', appConfigData.data.params_hash2.config_params.tv_login_url);
        }
    }
    const deleteMyAccount = async () => {
        const sessionId = await AsyncStorage.getItem('session');
        var userinfoid = await AsyncStorage.getItem('appleuserid');
        Alert.alert("Delete My Account", "Are you sure you want to delete the account?", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    if (Platform.OS == 'android') {
                        axios.get(FIRETV_BASE_URL_STAGING + 'users/' + sessionId + '/false/delete_user_account?auth_token=' + AUTH_TOKEN + '&access_token=' + ACCESS_TOKEN).then(resp => {
                            alert(resp.data.message);
                            signoutall();
                        }).catch(error => {
                            alert('Something went wrong. Please try again later.');
                        })
                    }
                    else
                        if (Platform.OS == 'ios') {
                            axios.get(FIRETV_BASE_URL_STAGING + 'users/' + sessionId + '/' + userinfoid + '/delete_user_account?auth_token=' + AUTH_TOKEN + '&access_token=' + ACCESS_TOKEN).then(resp => {
                                alert(resp.data.message);
                                signoutall();
                            }).catch(error => {
                                alert('Something went wrong. Please try again later.');
                            })
                        }
                }
            },
        ])
    }
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            <View style={{ marginTop: 30, marginLeft: 10 }}>
                <TouchableOpacity onPress={() => {
                    if (navigation.canGoBack())
                        navigation.goBack()
                    else
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                }}>
                    <Ionicons name="arrow-back" size={30} color="#ffffff" style={{ marginTop: 10 }} />
                </TouchableOpacity>
            </View>
            {!login ?

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={NORMAL_TEXT_COLOR} />
                </View>

                :
                // profilePic != "" && profilePic != null && validURL(profilePic) ?

                //     <View style={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}>
                //         <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 100, height: 100, borderRadius: 50 }}>
                //             {name != "" && name != null && name != 'null' ?
                //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 30, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                //                 :
                //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 30, fontWeight: 'bold' }}>-</Text>
                //             }
                //         </View>
                //         <Text style={styles.drawerHeaderText}>{name}</Text>
                //         {email != "" && email != null && email != 'null' ?
                //             <Text style={styles.drawerHeaderText}>{email}</Text>
                //             :
                //             ""}
                //     </View>


                //     :

                <View style={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 60, height: 60, borderRadius: 30 }}>
                        {name != "" && name != null && name != 'null' ?
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                            :
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, fontWeight: 'bold' }}>-</Text>
                        }
                    </View>
                    <Text style={styles.drawerHeaderText}>{name}</Text>
                    {email != "" && email != null && email != 'null' ?
                        <Text style={styles.drawerHeaderText}>{email}</Text>
                        :
                        ""}
                </View>

            }
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('EditProfile') }} style={{}}>

                    <LinearGradient
                        useAngle={true}
                        angle={125}
                        angleCenter={{ x: 0.5, y: 0.5 }}
                        colors={[BUTTON_COLOR,TAB_COLOR,BUTTON_COLOR]}
                        style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 22, paddingRight: 22, borderRadius: 20, borderColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}>Edit Profile</Text>
                        </View>
                    </LinearGradient>

                </TouchableOpacity>
            </View>
            <ScrollView style={{ marginTop: 20 }}>
                {dob != "" && dob != null ?
                    <View style={styles.inneroption}>
                        <Text style={styles.detailsheader}>DOB</Text>
                        <Text style={styles.detailsvalue}>{dob}</Text>
                    </View>
                    :
                    ""
                }
                {mobile != "" && mobile != null ?
                    <View style={styles.inneroption}>
                        <Text style={styles.detailsheader}>Mobile Number</Text>
                        <Text style={styles.detailsvalue}>{mobile.substring(4, 14)}</Text>
                    </View>
                    :
                    ""
                }

                {gender != "" && gender != null ?
                    <View style={styles.inneroption}>
                        <Text style={styles.detailsheader}>Gender</Text>
                        <Text style={styles.detailsvalue}>{gender}</Text>
                    </View>
                    :
                    ""
                }

                {address != "" && address != null ?
                    <View style={styles.inneroption}>
                        <Text style={styles.detailsheader}>Location / Pincode</Text>
                        <Text style={styles.detailsvalue}>{address}</Text>
                    </View>
                    :
                    ""
                }

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Subscription Status</Text>
                    {subscription_title == "" || subscription_title == null ?
                        <Pressable onPress={() => navigation.navigate('Subscribe')}><Text style={styles.detailsvalue}>Free</Text></Pressable>
                        :
                        <Pressable onPress={() => navigation.navigate('Subscribe')}><Text style={styles.detailsvalue}>{subscription_title}</Text></Pressable>
                    }
                    {expireson != "" && expireson != null && expireson!='1-0-1970' ?
                        <Text style={styles.detailsheader}>Expires on {expireson}</Text>
                        : ""}
                </View>

                <Pressable style={styles.inneroption} onPress={signout}>
                    <Text style={styles.detailsvalue}>Sign Out</Text>
                </Pressable>

                <Pressable style={styles.inneroption} onPress={signoutall}>
                    <Text style={styles.detailsvalue}>Sign Out All Devices</Text>
                </Pressable>

                <Pressable style={styles.inneroption} onPress={deleteMyAccount}>
                    <Text style={styles.detailsvalue}>Delete My Account</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    drawerHeaderText: { color: NORMAL_TEXT_COLOR, fontSize: 15, fontWeight: 'bold',marginBottom:5 },
    drawerHeaderImage: { width: "100%", height: 120 },
    inneroption: { borderTopColor: FOOTER_DEFAULT_TEXT_COLOR, borderBottomColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5, paddingLeft: 10,paddingRight:10,paddingTop:5,paddingBottom:5 },
    detailsheader: { color: DETAILS_TEXT_COLOR, fontSize: 11 },
    detailsvalue: { color: NORMAL_TEXT_COLOR, fontSize: 14 }
});