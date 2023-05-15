import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, AUTH_TOKEN, DETAILS_TEXT_COLOR, MORE_LINK_COLOR, FIRETV_BASE_URL_STAGING, WEB_CLIENT_ID, ACCESS_TOKEN, VIDEO_AUTH_TOKEN } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [Mobile, setMobile] = useState('');
    const [newpassword, setnewpassword] = useState('');

    const [MobileError, setMobileError] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [newpasswordError, setnewpasswordError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [emailRegError, setemailRegError] = useState('');

    const [signinError, setsigninError] = useState('');
    const [signinSuccess, setsigninSuccess] = useState('');
    const [selected, setSelected] = useState('mobile');
    const [popup, setpopup] = useState(false);
    const [user, setuser] = useState({});

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
        isSignedIn()
    }, [])

    const signin = async () => {
        try {
            signOut();
            await GoogleSignin.hasPlayServices();
            const region = await AsyncStorage.getItem('country_code');
            const userinfo = await GoogleSignin.signIn();
            var frontpagedob = await AsyncStorage.getItem('frontpagedob');
            var frontpagegender = await AsyncStorage.getItem('frontpagegender');
            var frontpagepincode = await AsyncStorage.getItem('frontpagepincode');
            setuser(userinfo)
            axios.post(FIRETV_BASE_URL_STAGING + '/users/external_auth/sign_in',
                {
                    access_token: ACCESS_TOKEN,
                    auth_token: VIDEO_AUTH_TOKEN,
                    user: {
                        ext_account_email_id: userinfo.user.email,
                        firstname: userinfo.user.givenName,
                        provider: "google",
                        region: region,
                        uid: userinfo.user.id
                    }
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => {
                    AsyncStorage.setItem('userobj', JSON.stringify(response.data.data))
                    AsyncStorage.setItem('ext_account_email_id', response.data.data.ext_account_email_id)
                    AsyncStorage.setItem('first_time_login', JSON.stringify(response.data.data.first_time_login))
                    AsyncStorage.setItem('ext_user_id', response.data.data.ext_user_id)
                    AsyncStorage.setItem('firstname', response.data.data.firstname)
                    AsyncStorage.setItem('login_type', response.data.data.login_type)
                    AsyncStorage.setItem('profile_pic', userinfo.user.photo)
                    AsyncStorage.setItem('session', response.data.data.session)
                    AsyncStorage.setItem('user_id', response.data.data.user_id)
                    AsyncStorage.setItem('email_id', userinfo.user.email)
                    AsyncStorage.setItem('mobile_number', response.data.data.mobile_number)
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
                        AsyncStorage.setItem('firstname', resp.data.data.firstname)
                        AsyncStorage.setItem('gender', resp.data.data.gender)
                        AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
                        AsyncStorage.setItem('login_type', resp.data.data.login_type)
                        AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
                        AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
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
                    }).catch(planerror => {
                        console.log(planerror.response.data);
                    })
                    console.log(JSON.stringify(response.data.data));

                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1', popup: false }))

                }).catch(err => {
                    console.log(JSON.stringify(err));
                    //alert(err.response.data.message)
                 })
        }
        catch (error) {
            console.log(error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("sign in cancelled");
            }
            else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("signing in");
            }
            else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("not available");
            }
            else {
                console.log("some error");
            }
        }
    }
    const isSignedIn = async () => {
        const issignedin = await GoogleSignin.isSignedIn();
        if (!!issignedin) {
            getCurrentUserInfo();
        }
        else {
            console.log("please login");
        }
    }
    const getCurrentUserInfo = async () => {
        try {
            const userinfo = await GoogleSignin.signInSilently();
            console.log("silent" + userinfo);
            setuser(userinfo)
        }
        catch (error) {
            if (error.code = statusCodes.SIGN_IN_REQUIRED) {
                console.log("login required");
            }
            else {
                console.log("something wrong");
            }

        }
    }
    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setuser({});
        }
        catch (error) {
            console.log(error);
        }
    }

    function ValidateEmail(input) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex))
            return true;
        else
            return false;
    }

    const signinMobileUser = async () => {
        if (Mobile.trim() == "") { setMobileError("Please enter your mobile number."); return true; } else setMobileError("");
        if (Mobile.trim().length != 10) { setMobileError("Please enter a valid mobile number."); return true; } else setMobileError("");

        await AsyncStorage.setItem("loginMobile", "0091" + Mobile);
        const region = await AsyncStorage.getItem('country_code');
        axios.post(FIRETV_BASE_URL_STAGING + "users/generate_signin_otp", {
            auth_token: AUTH_TOKEN,
            user: { user_id: "0091" + Mobile, region: region, type: "msisdn" }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(JSON.stringify(response.data));
                if (response.data.status_code == 200) {
                    setOtpError("")
                    navigation.dispatch(StackActions.replace('Otp', { 'otpkey': 'loginMobile' }));
                }
                else {
                    setOtpError(error.response.data.error.message)
                }
            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
            }
            );
    }
    const signinEmailUser = async () => {
        if (email.trim() == "") { setEmailError("Please enter your email id."); return true; } else setEmailError("");
        if (newpassword.trim() == "") { setnewpasswordError("Please enter your password."); return true; } else setnewpasswordError("");
        if (ValidateEmail(email)) {
            setEmailError("");
            var frontpagedob = await AsyncStorage.getItem('frontpagedob');
            var frontpagegender = await AsyncStorage.getItem('frontpagegender');
            var frontpagepincode = await AsyncStorage.getItem('frontpagepincode');

            //if (CheckPassword(newpassword)) {
            const region = await AsyncStorage.getItem('country_code');
            axios.post(FIRETV_BASE_URL_STAGING + "users/sign_in", {
                auth_token: AUTH_TOKEN,
                user: { email_id: email, region: region, password: newpassword }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                setemailRegError("");
                AsyncStorage.setItem('userobj', JSON.stringify(response.data.data))
                AsyncStorage.setItem('add_profile', JSON.stringify(response.data.data.add_profile))
                AsyncStorage.setItem('first_time_login', JSON.stringify(response.data.data.first_time_login))
                AsyncStorage.setItem('firstname', response.data.data.profile_obj.firstname)
                AsyncStorage.setItem('is_device_limit_status', JSON.stringify(response.data.data.is_device_limit_status))
                AsyncStorage.setItem('lastname', JSON.stringify(response.data.data.profile_obj.lastname))
                AsyncStorage.setItem('login_type', response.data.data.login_type)
                AsyncStorage.setItem('mobile_number', response.data.data.mobile_number)
                //AsyncStorage.setItem('mobile_number',"")
                AsyncStorage.setItem('default_profile', response.data.data.profile_obj.default_profile)
                AsyncStorage.setItem('profile_id', response.data.data.profile_obj.profile_id)
                AsyncStorage.setItem('region', response.data.data.profile_obj.region)
                AsyncStorage.setItem('profile_pic', response.data.data.profile_pic)
                AsyncStorage.setItem('session', response.data.data.session)
                AsyncStorage.setItem('user_id', response.data.data.user_id)
                AsyncStorage.setItem('email_id', response.data.data.email_id)

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
                    //AsyncStorage.setItem('ext_user_id',resp.data.data.ext_user_id)
                    AsyncStorage.setItem('firstname', resp.data.data.firstname)
                    AsyncStorage.setItem('gender', resp.data.data.gender)
                    //AsyncStorage.setItem('is_mobile_verify',JSON.stringify(resp.data.data.is_mobile_verify))
                    AsyncStorage.setItem('lastname', JSON.stringify(resp.data.data.lastname))
                    AsyncStorage.setItem('login_type', resp.data.data.login_type)
                    AsyncStorage.setItem('mobile_number', resp.data.data.mobile_number)
                    //AsyncStorage.setItem('mobile_number',"")
                    AsyncStorage.setItem('primary_id', resp.data.data.primary_id)
                    AsyncStorage.setItem('profile_pic', resp.data.data.profile_pic)
                    AsyncStorage.setItem('user_email_id', resp.data.data.user_email_id)
                    AsyncStorage.setItem('user_id', resp.data.data.user_id)
                    setpopup(false)

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
                }).catch(planerror => {
                    console.log(planerror.response.data);
                })
                navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1', popup: false }))
                //navigation.navigate('MobileUpdate')
            }).catch(error => {
                setemailRegError(error.response.data.error.message);
            })
            // }
            // else {
            //     setnewpasswordError("Password should be minimum of 8 digits and it should have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."); return true;
            // }
        }
        else {
            setEmailError("Please enter a valid email id."); return true;
        }
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <View style={{ flex: 1, }}>

                <View style={styles.header}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Sign In</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 20, }} onPress={() => navigation.navigate('Home')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>SKIP</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, }}>
                    <Pressable onPress={() => setSelected('mobile')} style={[selected == 'mobile' ? styles.selectedBackground : styles.unselectedBackground, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}><View style={styles.innerView}><Text style={{ fontWeight: 'bold' }}>Mobile No</Text></View></Pressable>
                    <Pressable onPress={() => setSelected('email')} style={[selected == 'email' ? styles.selectedBackground : styles.unselectedBackground, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}><View style={styles.innerView}><Text style={{ fontWeight: 'bold' }}>Email Id</Text></View></Pressable>
                </View>
                {selected == 'mobile' ?
                    <View style={styles.body}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{otpError}</Text>
                        </View>
                        <TextInput maxLength={10} onChangeText={setMobile} value={Mobile} style={styles.textinput} placeholder="Mobile Number*" placeholderTextColor={NORMAL_TEXT_COLOR} keyboardType='phone-pad' />
                        <Text style={styles.errormessage}>{MobileError}</Text>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{signinError}</Text>
                            <Text style={styles.successmessage}>{signinSuccess}</Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                    <TouchableOpacity onPress={signinMobileUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text></TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Not a Member?</Text>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: DETAILS_TEXT_COLOR }}>----- OR -----</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>

                            {/* {!user.idToken ? */}
                                <GoogleSigninButton
                                    style={{ width: 200, height: 50 }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={signin}
                                ></GoogleSigninButton>
                                {/* :
                                ""
                            } */}

                        </View>

                    </View>
                    :

                    <View style={styles.body}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{emailRegError}</Text>
                        </View>
                        <TextInput onChangeText={setEmail} value={email} style={styles.textinput} placeholder="Email Id*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{EmailError}</Text>

                        <TextInput secureTextEntry={true} onChangeText={setnewpassword} value={newpassword} style={styles.textinput} placeholder="Password*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{newpasswordError}</Text>
                        <View>
                            <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
                                <Text style={{ color: NORMAL_TEXT_COLOR }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{signinError}</Text>
                            <Text style={styles.successmessage}>{signinSuccess}</Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                    <TouchableOpacity onPress={signinEmailUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text></TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Not a Member?</Text>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: DETAILS_TEXT_COLOR }}>----- OR -----</Text>
                        </View>


                    </View>
                }


            </View>
            <StatusBar style="auto" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: { justifyContent: 'center', alignItems: 'center', height: 80 },
    body: { backgroundColor: BACKGROUND_COLOR, height: "100%", padding: 20, },
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5 },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 },
    errormessage: { color: 'red', fontSize: 15 },
    successmessage: { color: NORMAL_TEXT_COLOR, fontSize: 15 },
    unselectedBackground: { backgroundColor: NORMAL_TEXT_COLOR, },
    selectedBackground: { backgroundColor: MORE_LINK_COLOR, },
    innerView: { paddingLeft: 30, paddingRight: 30, paddingBottom: 15, paddingTop: 15 }
});