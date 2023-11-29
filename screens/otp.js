import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, DETAILS_TEXT_COLOR, MORE_LINK_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, BACKGROUND_TRANSPARENT_COLOR, DARKED_BORDER_COLOR, FIRETV_BASE_URL_STAGING, ACCESS_TOKEN, VIDEO_AUTH_TOKEN, BUTTON_COLOR, FOOTER_DEFAULT_TEXT_COLOR } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import messaging from '@react-native-firebase/messaging';

export default function Otp({ navigation, route }) {
    const { otpkey } = route.params;
    const [LoginRegisterMobile, setLoginRegisterMobile] = useState();
    const [otp1, setotp1] = useState();
    const [otp2, setotp2] = useState();
    const [otp3, setotp3] = useState();
    const [otp4, setotp4] = useState();
    const [otp5, setotp5] = useState();
    const [otp6, setotp6] = useState();
    const [seconds, setSeconds] = useState(60);
    const [otpError, setOtpError] = useState('');
    var otp1ref = useRef(null);
    var otp2ref = useRef(null);
    var otp3ref = useRef(null);
    var otp4ref = useRef(null);
    var otp5ref = useRef(null);
    var otp6ref = useRef(null);
    const getData = async () => {
        var loginMobile = await AsyncStorage.getItem(otpkey);
        setLoginRegisterMobile(loginMobile.substring(4, 14));
        setTimeout(function () {
            if (seconds > 0)
                setSeconds(seconds - 1);
            else
                setSeconds(0);
        }, 1000)
    }
    useEffect(() => {
        getData();
    })
    const triggersuccessanalytics = async (name, method, u_id, device_id) => {
        await analytics().logEvent(name, {
            method: method,
            u_id: u_id,
            device_id: device_id
        }).then(resp => { console.log(resp); }).catch(err => { console.log(err); })
    }
    const triggerfailureanalytics = async (name, error_type, method, device_id) => {
        await analytics().logEvent(name, {
            error_type: error_type,
            method: method,
            device_id: device_id
        }).then(resp => { console.log(resp); }).catch(err => { console.log(err); })
    }

    const verifyOtp = async () => {
        const region = await AsyncStorage.getItem('country_code');
        const loginMobile = await AsyncStorage.getItem(otpkey);
        const session_id = await AsyncStorage.getItem('session');
        var email_id = await AsyncStorage.getItem('email_id');
        const user_id = await AsyncStorage.getItem('user_id');
        const uniqueid = await DeviceInfo.getUniqueId();
        if (email_id == "" || email_id == null) {
            email_id = await AsyncStorage.getItem('ext_user_id');
        }
        var frontpagedob = await AsyncStorage.getItem('frontpagedob');
        var frontpagegender = await AsyncStorage.getItem('frontpagegender');
        var frontpagepincode = await AsyncStorage.getItem('frontpagepincode');
        const device_token = await messaging().getToken();
        if (otpkey == "loginMobile") {
            console.log(JSON.stringify({ action: "signin", region: region, type: "msisdn", key: otp1 + otp2 + otp3 + otp4 + otp5 + otp6, user_id: loginMobile, mobile_number: loginMobile, device_token: device_token }));
            axios.post(FIRETV_BASE_URL_STAGING + "users/verify_otp", {
                auth_token: AUTH_TOKEN,
                user: { action: "signin", region: region, type: "msisdn", key: otp1 + otp2 + otp3 + otp4 + otp5 + otp6, user_id: loginMobile, mobile_number: loginMobile, device_token: device_token }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    triggersuccessanalytics('login_success', 'phone number', user_id, uniqueid)
                    AsyncStorage.setItem('userobj', JSON.stringify(response.data.data))
                    AsyncStorage.setItem('add_profile', JSON.stringify(response.data.data.add_profile))
                    AsyncStorage.setItem('first_time_login', JSON.stringify(response.data.data.first_time_login))
                    AsyncStorage.setItem('firstname', response.data.data.profile_obj.firstname)
                    AsyncStorage.setItem('is_device_limit_status', JSON.stringify(response.data.data.is_device_limit_status))
                    AsyncStorage.setItem('lastname', JSON.stringify(response.data.data.profile_obj.lastname))
                    AsyncStorage.setItem('login_type', response.data.data.login_type)
                    AsyncStorage.setItem('mobile_number', response.data.data.mobile_number)
                    AsyncStorage.setItem('default_profile', response.data.data.profile_obj.default_profile)
                    AsyncStorage.setItem('profile_id', response.data.data.profile_obj.profile_id)
                    AsyncStorage.setItem('region', response.data.data.profile_obj.region)
                    AsyncStorage.setItem('profile_pic', response.data.data.profile_pic)
                    AsyncStorage.setItem('session', response.data.data.session)
                    AsyncStorage.setItem('user_id', response.data.data.user_id)

                    if ((frontpagedob != "" && frontpagedob != null) || (frontpagegender != "" && frontpagegender != null) || (frontpagepincode != "" && frontpagepincode != null)) {

                        axios.put(FIRETV_BASE_URL_STAGING + 'users/' + response.data.data.session + '/account', {
                            access_token: ACCESS_TOKEN,
                            auth_token: VIDEO_AUTH_TOKEN,
                            user: {
                                birthdate: frontpagedob,
                                gender: frontpagegender,
                                address: frontpagepincode
                            }
                        }).then(resp => {
                            AsyncStorage.removeItem('frontpagedob');
                            AsyncStorage.removeItem('frontpagegender');
                            AsyncStorage.removeItem('frontpagepincode');
                        }).catch(error => { console.log(error.response.data); })

                    }

                    axios.get(FIRETV_BASE_URL_STAGING + "users/" + response.data.data.session + "/account.gzip?auth_token=" + AUTH_TOKEN).then(resp => {
                        AsyncStorage.setItem('address', resp.data.data.address)
                        AsyncStorage.setItem('age', resp.data.data.age)
                        AsyncStorage.setItem('birthdate', resp.data.data.birthdate)
                        AsyncStorage.setItem('email_id', resp.data.data.email_id)
                        AsyncStorage.setItem('ext_account_email_id', resp.data.data.ext_account_email_id)
                        AsyncStorage.setItem('ext_user_id', resp.data.data.ext_user_id)
                        AsyncStorage.setItem('firstname', resp.data.data.firstname)
                        AsyncStorage.setItem('gender', resp.data.data.gender)
                        //AsyncStorage.setItem('is_mobile_verify', JSON.stringify(resp.data.data.is_mobile_verify))
                        AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
                        AsyncStorage.setItem('login_type', resp.data.data.login_type)
                        AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
                        AsyncStorage.setItem('primary_id', resp.data.data.primary_id)
                        AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
                        AsyncStorage.setItem('user_email_id', resp.data.data.user_email_id)
                        AsyncStorage.setItem('user_id', resp.data.data.user_id)

                    }).catch(err => {
                        alert("Error in fetching account details. Please try again later.")
                    })

                    axios.get(FIRETV_BASE_URL_STAGING + "users/" + response.data.data.session + "/user_plans.gzip?auth_token=" + AUTH_TOKEN + "&tran_history=true&region=" + region).then(planresponse => {
                        if (planresponse.data.data.length > 0) {
                            AsyncStorage.setItem('subscription', 'done');
                            AsyncStorage.setItem('user_id', planresponse.data.data[0].user_id);
                            AsyncStorage.setItem('subscription_id', planresponse.data.data[0].subscription_id);
                            AsyncStorage.setItem('plan_id', planresponse.data.data[0].plan_id);
                            AsyncStorage.setItem('category', planresponse.data.data[0].category);
                            AsyncStorage.setItem('valid_till', planresponse.data.data[0].valid_till);
                            AsyncStorage.setItem('start_date', planresponse.data.data[0].start_date);
                            AsyncStorage.setItem('transaction_id', planresponse.data.data[0].transaction_id);
                            AsyncStorage.setItem('created_at', planresponse.data.data[0].created_at);
                            AsyncStorage.setItem('updated_at', planresponse.data.data[0].updated_at);
                            AsyncStorage.setItem('plan_status', planresponse.data.data[0].plan_status);
                            AsyncStorage.setItem('invoice_inc_id', JSON.stringify(planresponse.data.data[0].invoice_inc_id));
                            AsyncStorage.setItem('price_charged', JSON.stringify(planresponse.data.data[0].price_charged));
                            AsyncStorage.setItem('email_id', JSON.stringify(planresponse.data.data[0].email_id));
                            AsyncStorage.setItem('plan_title', JSON.stringify(planresponse.data.data[0].plan_title));
                            AsyncStorage.setItem('subscription_title', JSON.stringify(planresponse.data.data[0].subscription_title));
                            AsyncStorage.setItem('invoice_id', JSON.stringify(planresponse.data.data[0].invoice_id));
                            AsyncStorage.setItem('currency', JSON.stringify(planresponse.data.data[0].currency));
                            AsyncStorage.setItem('currency_symbol', JSON.stringify(planresponse.data.data[0].currency_symbol));
                            AsyncStorage.setItem('status', JSON.stringify(planresponse.data.data[0].status));
                        }
                        else {
                            AsyncStorage.setItem('subscription_title', 'Free');
                        }
                    }).catch(planerror => {
                        console.log(planerror.response.data);
                    })

                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1', popup: false, mobilescreenunshow: true }))

                }).catch(error => {
                    //console.log(error.response.status);
                    //console.log(error.response.headers);
                    setOtpError(error.response.data.error.message)
                }
                );
        }
        else
            if (otpkey == "signupMobile") {


                axios.get(FIRETV_BASE_URL_STAGING + "users/verification/" + otp1 + otp2 + otp3 + otp4 + otp5 + otp6 + "?mobile_number=" + loginMobile + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&device_token=" + device_token)
                    .then(response => {
                        triggersuccessanalytics('signup_success', 'phone number', user_id, uniqueid)
                        AsyncStorage.setItem('userobj', JSON.stringify(response.data.data))
                        AsyncStorage.setItem('add_profile', JSON.stringify(response.data.data.add_profile))
                        AsyncStorage.setItem('first_time_login', JSON.stringify(response.data.data.first_time_login))
                        AsyncStorage.setItem('firstname', response.data.data.profile_obj.firstname)
                        AsyncStorage.setItem('is_device_limit_status', JSON.stringify(response.data.data.is_device_limit_status))
                        AsyncStorage.setItem('lastname', JSON.stringify(response.data.data.profile_obj.lastname))
                        AsyncStorage.setItem('login_type', response.data.data.login_type)
                        AsyncStorage.setItem('mobile_number', response.data.data.mobile_number)
                        AsyncStorage.setItem('default_profile', response.data.data.profile_obj.default_profile)
                        AsyncStorage.setItem('profile_id', response.data.data.profile_obj.profile_id)
                        AsyncStorage.setItem('region', response.data.data.profile_obj.region)
                        AsyncStorage.setItem('profile_pic', response.data.data.profile_pic)
                        AsyncStorage.setItem('session', response.data.data.session)
                        AsyncStorage.setItem('user_id', response.data.data.user_id)

                        if ((frontpagedob != "" && frontpagedob != null) || (frontpagegender != "" && frontpagegender != null) || (frontpagepincode != "" && frontpagepincode != null)) {

                            axios.put(FIRETV_BASE_URL_STAGING + 'users/' + response.data.data.session + '/account', {
                                access_token: ACCESS_TOKEN,
                                auth_token: VIDEO_AUTH_TOKEN,
                                user: {
                                    birthdate: frontpagedob,
                                    gender: frontpagegender,
                                    address: frontpagepincode
                                }
                            }).then(resp => {
                                AsyncStorage.removeItem('frontpagedob');
                                AsyncStorage.removeItem('frontpagegender');
                                AsyncStorage.removeItem('frontpagepincode');
                            }).catch(error => { console.log(error.response.data); })

                        }

                        axios.get(FIRETV_BASE_URL_STAGING + "users/" + response.data.data.session + "/account.gzip?auth_token=" + AUTH_TOKEN).then(resp => {
                            AsyncStorage.setItem('address', resp.data.data.address)
                            AsyncStorage.setItem('age', resp.data.data.age)
                            AsyncStorage.setItem('birthdate', resp.data.data.birthdate)
                            AsyncStorage.setItem('email_id', resp.data.data.email_id)
                            AsyncStorage.setItem('ext_account_email_id', resp.data.data.ext_account_email_id)
                            AsyncStorage.setItem('ext_user_id', resp.data.data.ext_user_id)
                            AsyncStorage.setItem('firstname', resp.data.data.firstname)
                            AsyncStorage.setItem('gender', resp.data.data.gender)
                            //AsyncStorage.setItem('is_mobile_verify', JSON.stringify(resp.data.data.is_mobile_verify))
                            AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
                            AsyncStorage.setItem('login_type', resp.data.data.login_type)
                            AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
                            AsyncStorage.setItem('primary_id', resp.data.data.primary_id)
                            AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
                            AsyncStorage.setItem('user_email_id', resp.data.data.user_email_id)
                            AsyncStorage.setItem('user_id', resp.data.data.user_id)

                        }).catch(err => {
                            alert("Error in fetching account details. Please try again later.")
                        })

                        axios.get(FIRETV_BASE_URL_STAGING + "users/" + response.data.data.session + "/user_plans.gzip?auth_token=" + AUTH_TOKEN + "&tran_history=true&region=" + region).then(planresponse => {
                            if (planresponse.data.data.length > 0) {
                                AsyncStorage.setItem('subscription', 'done');
                                AsyncStorage.setItem('user_id', planresponse.data.data[0].user_id);
                                AsyncStorage.setItem('subscription_id', planresponse.data.data[0].subscription_id);
                                AsyncStorage.setItem('plan_id', planresponse.data.data[0].plan_id);
                                AsyncStorage.setItem('category', planresponse.data.data[0].category);
                                AsyncStorage.setItem('valid_till', planresponse.data.data[0].valid_till);
                                AsyncStorage.setItem('start_date', planresponse.data.data[0].start_date);
                                AsyncStorage.setItem('transaction_id', planresponse.data.data[0].transaction_id);
                                AsyncStorage.setItem('created_at', planresponse.data.data[0].created_at);
                                AsyncStorage.setItem('updated_at', planresponse.data.data[0].updated_at);
                                AsyncStorage.setItem('plan_status', planresponse.data.data[0].plan_status);
                                AsyncStorage.setItem('invoice_inc_id', JSON.stringify(planresponse.data.data[0].invoice_inc_id));
                                AsyncStorage.setItem('price_charged', JSON.stringify(planresponse.data.data[0].price_charged));
                                AsyncStorage.setItem('email_id', JSON.stringify(planresponse.data.data[0].email_id));
                                AsyncStorage.setItem('plan_title', JSON.stringify(planresponse.data.data[0].plan_title));
                                AsyncStorage.setItem('subscription_title', JSON.stringify(planresponse.data.data[0].subscription_title));
                                AsyncStorage.setItem('invoice_id', JSON.stringify(planresponse.data.data[0].invoice_id));
                                AsyncStorage.setItem('currency', JSON.stringify(planresponse.data.data[0].currency));
                                AsyncStorage.setItem('currency_symbol', JSON.stringify(planresponse.data.data[0].currency_symbol));
                                AsyncStorage.setItem('status', JSON.stringify(planresponse.data.data[0].status));
                            }
                            else {
                                AsyncStorage.setItem('subscription_title', 'Free');
                            }
                        }).catch(planerror => {
                            console.log(planerror.response.data);
                        })

                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1', popup: false, mobilescreenunshow: true }))

                    }).catch(error => {
                        //console.log(error.response.status);
                        //console.log(error.response.headers);
                        setOtpError(error.response.data.error.message)
                        triggerfailureanalytics('signup_failure', error.response.data.error.message, 'phone number', uniqueid)
                    }
                    );

            }
            else
                if (otpkey == "updateMobile") {

                    axios.post(FIRETV_BASE_URL_STAGING + "users/verify_otp", {
                        auth_token: AUTH_TOKEN,
                        user: { action: "update_mobile", region: region, type: "msisdn", key: otp1 + otp2 + otp3 + otp4 + otp5 + otp6, user_id: email_id, mobile_number: loginMobile, session_id: session_id, device_token: device_token }
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => {
                            AsyncStorage.setItem('add_profile', JSON.stringify(response.data.data.add_profile))
                            AsyncStorage.setItem('first_time_login', JSON.stringify(response.data.data.first_time_login))
                            AsyncStorage.setItem('firstname', response.data.data.profile_obj.firstname)
                            AsyncStorage.setItem('is_device_limit_status', JSON.stringify(response.data.data.is_device_limit_status))
                            AsyncStorage.setItem('lastname', JSON.stringify(response.data.data.profile_obj.lastname))
                            AsyncStorage.setItem('login_type', response.data.data.login_type)
                            AsyncStorage.setItem('mobile_number', response.data.data.mobile_number)
                            AsyncStorage.setItem('default_profile', response.data.data.profile_obj.default_profile)
                            AsyncStorage.setItem('profile_id', response.data.data.profile_obj.profile_id)
                            AsyncStorage.setItem('region', response.data.data.profile_obj.region)
                            AsyncStorage.setItem('profile_pic', response.data.data.profile_pic)
                            AsyncStorage.setItem('session', response.data.data.session)
                            AsyncStorage.setItem('user_id', response.data.data.user_id)

                            if ((frontpagedob != "" && frontpagedob != null) || (frontpagegender != "" && frontpagegender != null) || (frontpagepincode != "" && frontpagepincode != null)) {

                                axios.put(FIRETV_BASE_URL_STAGING + 'users/' + response.data.data.session + '/account', {
                                    access_token: ACCESS_TOKEN,
                                    auth_token: VIDEO_AUTH_TOKEN,
                                    user: {
                                        birthdate: frontpagedob,
                                        gender: frontpagegender,
                                        address: frontpagepincode
                                    }
                                }).then(resp => {
                                    AsyncStorage.removeItem('frontpagedob');
                                    AsyncStorage.removeItem('frontpagegender');
                                    AsyncStorage.removeItem('frontpagepincode');
                                }).catch(error => { console.log(error.response.data); })
                            }

                            axios.get(FIRETV_BASE_URL_STAGING + "users/" + response.data.data.session + "/account.gzip?auth_token=" + AUTH_TOKEN).then(resp => {
                                AsyncStorage.setItem('address', resp.data.data.address)
                                AsyncStorage.setItem('age', resp.data.data.age)
                                AsyncStorage.setItem('birthdate', resp.data.data.birthdate)
                                AsyncStorage.setItem('email_id', resp.data.data.email_id)
                                AsyncStorage.setItem('ext_account_email_id', resp.data.data.ext_account_email_id)
                                AsyncStorage.setItem('ext_user_id', resp.data.data.ext_user_id)
                                AsyncStorage.setItem('firstname', resp.data.data.firstname)
                                AsyncStorage.setItem('gender', resp.data.data.gender)
                                //AsyncStorage.setItem('is_mobile_verify', JSON.stringify(resp.data.data.is_mobile_verify))
                                AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
                                AsyncStorage.setItem('login_type', resp.data.data.login_type)
                                AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
                                AsyncStorage.setItem('primary_id', resp.data.data.primary_id)
                                AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
                                AsyncStorage.setItem('user_email_id', resp.data.data.user_email_id)
                                AsyncStorage.setItem('user_id', resp.data.data.user_id)
                                navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1', popup: true, mobilescreenunshow: true }))
                            }).catch(err => {
                                alert("Error in fetching account details. Please try again later.")
                            })

                        }).catch(error => {
                            //console.log(error.response.status);
                            //console.log(error.response.headers);
                            setOtpError(error.response.data.error.message)
                        }
                        );
                }
    }
    const resendOtp = async () => {

        const region = await AsyncStorage.getItem('country_code');
        const loginMobile = await AsyncStorage.getItem(otpkey);
        const session_id = await AsyncStorage.getItem('session');

        if (otpkey == "updateMobile") {
            axios.post(FIRETV_BASE_URL_STAGING + "users/" + session_id + "/generate_mobile_otp", {
                auth_token: AUTH_TOKEN,
                profile: { region: region, type: "msisdn", user_id: loginMobile }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(updatesresp => {
                setSeconds(60);
                setOtpError("Message Sent");
            }).catch(updateerror => {
                setOtpError(updateerror.response.data.error.message)
            })
        }
        else
            if (otpkey == "loginMobile") {
                axios.post(FIRETV_BASE_URL_STAGING + "users/generate_signin_otp", {
                    auth_token: AUTH_TOKEN,
                    user: { region: region, type: "msisdn", user_id: loginMobile }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(updatesresp => {
                    setSeconds(60);
                    setOtpError("Message Sent");
                }).catch(updateerror => {
                    setOtpError(updateerror.response.data.error.message)
                })
            }
            else {
                axios.post(FIRETV_BASE_URL_STAGING + "users/resend_verification_link", {
                    auth_token: AUTH_TOKEN,
                    access_token: ACCESS_TOKEN,
                    user: { email_id: loginMobile, region: region, type: "msisdn" }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(sentotp => {
                    setSeconds(60);
                    setOtpError("Message Sent");
                }).catch(errorotp => { setOtpError(errorotp.response.data.error.message) })
            }

    }
    const gobacknavigation = (key) => {
        if (key == "loginMobile") {
            navigation.dispatch(StackActions.replace('Login'));
        }
        else
            if (key == "updateMobile") {
                navigation.dispatch(StackActions.replace('MobileUpdate'));
            }
            else
                if (key == "signupMobile") {
                    navigation.dispatch(StackActions.replace('Signup'));
                }
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <View style={{ flex: 1, padding: 10, marginTop: 30 }}>

                <View style={styles.header}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>OTP Verification</Text>
                    <TouchableOpacity style={{ position: 'absolute', left: 20, }} onPress={() => gobacknavigation(otpkey)}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}> <MaterialCommunityIcons name="less-than" size={25} color={SLIDER_PAGINATION_SELECTED_COLOR} /> </Text></TouchableOpacity>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>Enter the OTP sent to your mobile </Text>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>number via SMS </Text>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, marginTop: 20 }}>{LoginRegisterMobile}</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12 }}>Enter 6 digit code</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <TextInput ref={otp1ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp1} value={otp1} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                            }
                            else
                            otp2ref.current.focus()
                        }}></TextInput>
                        <TextInput ref={otp2ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp2} value={otp2} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace')
                            otp1ref.current.focus()
                            else
                            otp3ref.current.focus()
                        }}></TextInput>
                        <TextInput ref={otp3ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp3} value={otp3} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace')
                            otp2ref.current.focus()
                            else
                            otp4ref.current.focus()
                        }}></TextInput>
                        <TextInput ref={otp4ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp4} value={otp4} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace')
                            otp3ref.current.focus()
                            else
                            otp5ref.current.focus()
                        }}></TextInput>
                        <TextInput ref={otp5ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp5} value={otp5} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace')
                            otp4ref.current.focus()
                            else
                            otp6ref.current.focus()
                        }}></TextInput>
                        <TextInput ref={otp6ref} secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp6} value={otp6} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad' onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace')
                            otp5ref.current.focus()
                        }}></TextInput>
                    </View>

                    <View style={styles.timer}>
                        <Text style={{ color: NORMAL_TEXT_COLOR }}>{seconds} Sec</Text>
                    </View>

                    {seconds == 0 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Pressable onPress={resendOtp}><Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 18 }}>Resend OTP</Text></Pressable>
                        </View>
                        :
                        ""
                    }

                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.errormessage}>{otpError}</Text>
                </View>

                {/* <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>OTP will be sent to the above mentioned </Text>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>Mobile Number </Text>
                </View> */}

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <TouchableOpacity onPress={verifyOtp}>
                        <LinearGradient
                            useAngle={true}
                            angle={125}
                            angleCenter={{ x: 0.5, y: 0.5 }}
                            colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                            style={styles.button}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome5 name='lock' size={13} color={NORMAL_TEXT_COLOR} style={{ marginRight: 10 }} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13, fontWeight: 'bold' }}>Verify OTP</Text>
                            </View>
                        </LinearGradient>

                    </TouchableOpacity>
                </View>

            </View>
            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: { justifyContent: 'center', alignItems: 'center', height: 80 },
    body: { backgroundColor: BACKGROUND_COLOR, height: "100%", padding: 20, },
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5 },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 12, borderRadius: 10, borderColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5 },
    otp: { width: '15%', justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: DARKED_BORDER_COLOR, borderRadius: 10, borderColor: DETAILS_TEXT_COLOR, borderWidth: 1, marginRight: 6, color: NORMAL_TEXT_COLOR, height: 50 },
    timer: { width: '100%', justifyContent: 'center', alignItems: 'center', padding: 15, },
    errormessage: { color: 'red', fontSize: 15 },
});