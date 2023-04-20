import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, DETAILS_TEXT_COLOR, MORE_LINK_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, BACKGROUND_TRANSPARENT_COLOR, DARKED_BORDER_COLOR, FIRETV_BASE_URL_STAGING } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';

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
    const [popup,setpopup] = useState(false);

    const getData = async () => {
        var loginMobile = await AsyncStorage.getItem(otpkey);
        setLoginRegisterMobile(loginMobile.substring(4,14));
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
    const verifyOtp = async () =>{
        const region = await AsyncStorage.getItem('country_code');
        const loginMobile = await AsyncStorage.getItem('loginMobile');
        axios.post(FIRETV_BASE_URL_STAGING + "users/verify_otp", {
            auth_token: AUTH_TOKEN,
            user: { action: "signin", region: region, type: "msisdn", key: otp1+otp2+otp3+otp4+otp5+otp6, user_id:loginMobile}
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                AsyncStorage.setItem('add_profile',JSON.stringify(response.data.data.add_profile))
                AsyncStorage.setItem('first_time_login',JSON.stringify(response.data.data.first_time_login))
                AsyncStorage.setItem('firstname',response.data.data.profile_obj.firstname)
                AsyncStorage.setItem('is_device_limit_status',JSON.stringify(response.data.data.is_device_limit_status))
                AsyncStorage.setItem('lastname',response.data.data.profile_obj.lastname)
                AsyncStorage.setItem('login_type',response.data.data.login_type)
                AsyncStorage.setItem('mobile_number',response.data.data.mobile_number)
                AsyncStorage.setItem('default_profile',response.data.data.profile_obj.default_profile)
                AsyncStorage.setItem('profile_id',response.data.data.profile_obj.profile_id)
                AsyncStorage.setItem('region',response.data.data.profile_obj.region)
                AsyncStorage.setItem('profile_pic',response.data.data.profile_pic)
                AsyncStorage.setItem('session',response.data.data.session)
                AsyncStorage.setItem('user_id',response.data.data.user_id)
                axios.get(FIRETV_BASE_URL_STAGING + "users/"+response.data.data.session+"/account.gzip?auth_token="+AUTH_TOKEN).then(resp=>{
                AsyncStorage.setItem('address',resp.data.data.address)
                AsyncStorage.setItem('age',resp.data.data.age)
                AsyncStorage.setItem('birthdate',resp.data.data.birthdate)
                AsyncStorage.setItem('email_id',resp.data.data.email_id)
                AsyncStorage.setItem('ext_account_email_id',resp.data.data.ext_account_email_id)
                AsyncStorage.setItem('ext_user_id',resp.data.data.ext_user_id)
                AsyncStorage.setItem('firstname',resp.data.data.firstname)
                AsyncStorage.setItem('gender',resp.data.data.gender)
                AsyncStorage.setItem('is_mobile_verify',JSON.stringify(resp.data.data.is_mobile_verify))
                AsyncStorage.setItem('lastname',JSON.stringify(resp.data.data.lastname))
                AsyncStorage.setItem('login_type',resp.data.data.login_type)
                AsyncStorage.setItem('mobile_number',resp.data.data.mobile_number)
                AsyncStorage.setItem('primary_id',resp.data.data.primary_id)
                AsyncStorage.setItem('profile_pic',resp.data.data.profile_pic)
                AsyncStorage.setItem('user_email_id',resp.data.data.user_email_id)
                AsyncStorage.setItem('user_id',resp.data.data.user_id)
                if(otpkey=='loginMobile')
                setpopup(false)
                else
                setpopup(true)
                navigation.dispatch(StackActions.replace('Home',{pageFriendlyId:'featured-1',popup:popup}))

                }).catch(err=>{
                    alert("Error in fetching account details. Please try again later.")
                })


            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
            }
            );
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <View style={{ flex: 1, padding: 10 }}>

                <View style={styles.header}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>OTP Verification</Text>
                    <TouchableOpacity style={{ position: 'absolute', left: 20, }} onPress={() => navigation.navigate('Login')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}> <MaterialCommunityIcons name="less-than" size={25} color={SLIDER_PAGINATION_SELECTED_COLOR} /> </Text></TouchableOpacity>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>Enter the OTP sent to your mobile </Text>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>number via SMS </Text>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, marginTop: 20 }}>{LoginRegisterMobile}</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12 }}>Enter 6 digit code</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp1} value={otp1} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp2} value={otp2} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp3} value={otp3} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp4} value={otp4} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp5} value={otp5} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <TextInput secureTextEntry={true} maxLength={1} textAlign='center' style={styles.otp} onChangeText={setotp6} value={otp6} placeholder='0' placeholderTextColor={DETAILS_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                        <View style={styles.timer}>
                            <Text>{seconds} Sec</Text>
                        </View>
                    </View>
                </View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.errormessage}>{otpError}</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>OTP will be sent to the above mentioned </Text>
                    <Text style={{ color: DETAILS_TEXT_COLOR }}>Mobile Number </Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <TouchableOpacity onPress={verifyOtp} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Verify OTP</Text></TouchableOpacity>
                </View>

            </View>
            <StatusBar style="auto" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: { justifyContent: 'center', alignItems: 'center', height: 80 },
    body: { backgroundColor: BACKGROUND_COLOR, height: "100%", padding: 20, },
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5 },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, },
    otp: { width: '12.5%', justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: DARKED_BORDER_COLOR, borderRadius: 10, borderColor: DETAILS_TEXT_COLOR, borderWidth: 1, marginRight: 3, color: NORMAL_TEXT_COLOR },
    timer: { width: '20%', justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: DETAILS_TEXT_COLOR, borderRadius: 10, borderColor: DETAILS_TEXT_COLOR, borderWidth: 1, color: NORMAL_TEXT_COLOR },
    errormessage: { color: 'red', fontSize: 15 },
});