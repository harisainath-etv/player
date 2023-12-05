import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, ACCESS_TOKEN, MORE_LINK_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, SLIDER_PAGINATION_SELECTED_COLOR, BUTTON_COLOR, FOOTER_DEFAULT_TEXT_COLOR } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';

export default function Signup({ navigation }) {
    const [name, setName] = useState('');
    const [Name, setname] = useState('');
    const [emailMobile, setemailMobile] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [nameerror, setnameError] = useState('');
    const [emailMobileError, setemailMobileError] = useState('');
    const [newpasswordError, setnewpasswordError] = useState('');
    const [confirmpasswordError, setconfirmpasswordError] = useState('');
    const [registerError, setregisterError] = useState('');
    const [registerSuccess, setregisterSuccess] = useState('');
    const [selected, setSelected] = useState('mobile');
    const [Mobile, setMobile] = useState('');
    const [MobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [termscheck, setTermsCheck] = useState(false);
    const [showresend, setshowresend] = useState(false);
    const [region, setregion] = useState();



    function CheckPassword(inputtxt) {
        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (inputtxt.match(decimal)) {
            return true;
        }
        else {
            return false;
        }
    }
    function ValidateEmail(input) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex))
            return true;
        else
            return false;
    }
    const triggersuccessanalytics = async (name, method, u_id, device_id) => {
        sdk.trackEvent(name, {
            method: method,
            u_id: u_id,
            device_id: device_id
        });
    }
    const triggerfailureanalytics = async (name, error_type, method, device_id) => {
        sdk.trackEvent(name, {
            error_type: error_type,
            method: method,
            device_id: device_id
        });
    }
    async function postData(type) {
        const region = await AsyncStorage.getItem('country_code');
        const calling_code = await AsyncStorage.getItem('calling_code');
        const user_id = await AsyncStorage.getItem('user_id');
        const uniqueid = await DeviceInfo.getUniqueId();
        var userId = "";
        { type == 'email' ? userId = emailMobile : userId = calling_code + emailMobile }
        //posting data
        axios.post(FIRETV_BASE_URL + "users", {
            auth_token: AUTH_TOKEN,
            user: { email_id: userId, firstname: name, password: newpassword, region: region }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                //console.log(JSON.stringify(response));
                setOtpError('')
                setOtpError('Verification link has been sent to \r\n \r\n ' + userId + '. \r\n \r\n Please click the link in that email to continue.');
                setshowresend(true);
                triggersuccessanalytics('signup_success', 'email id', user_id, uniqueid)

            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
                triggerfailureanalytics('signup_failure', error.response.data.error.message, 'email id', uniqueid)
            }
            );
    }


    const resendEmail = async () => {
        setOtpError("");
        const region = await AsyncStorage.getItem('country_code');

        axios.post(FIRETV_BASE_URL_STAGING + "users/resend_verification_link", {
            auth_token: AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            user: { email_id: emailMobile, region: region, type: "email" }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(sentotp => {
            setregisterError('')
            setOtpError('Verification link has been sent to \r\n \r\n' + emailMobile + '. \r\n \r\n Please click the link in that email to continue.');
        }).catch(errorotp => { setOtpError(errorotp.response.data.error.message) })


    }

    const registerEmailUser = async () => {
        if (name.trim() == "") { setNameError("Please enter name."); return true; } else setNameError("");
        if (emailMobile.trim() == "") { setemailMobileError("Please enter your email."); return true; } else setemailMobileError("");
        if (newpassword.trim() == "") { setnewpasswordError("Please enter new password."); return true; } else setnewpasswordError("");
        if (confirmpassword.trim() == "") { setconfirmpasswordError("Please confirm your password."); return true; } else setconfirmpasswordError("");
        if (confirmpassword.trim() != newpassword.trim()) { setconfirmpasswordError("Password Mismatch. Please re-enter"); return true; } else setconfirmpasswordError("");
        if (ValidateEmail(emailMobile)) {
            setemailMobileError("");
            if (CheckPassword(newpassword)) {
                setnewpasswordError("");
                if (!termscheck) {
                    setOtpError('Please select Terms Of Use and Privacy Policy.');
                    return true;
                }
                else {
                    setOtpError('');
                    postData('email');
                }
            }
            else {
                setnewpasswordError("Password should be minimum of 8 digits and it should have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."); return true;
            }
        }
        else {
            setemailMobileError("Please enter a valid email")
        }

    }
    const signUpMobileUser = async () => {
        if (Name.trim() == "") { setnameError("Please enter your name."); return true; } else setnameError("");

        if (Mobile.trim() == "") { setMobileError("Please enter your mobile number."); return true; } else setMobileError("");
        if (Mobile.trim().length != 10) { setMobileError("Please enter a valid mobile number."); return true; } else setMobileError("");
        if (!termscheck) {
            setOtpError('Please select Terms Of Use and Privacy Policy.');
            return true;
        }
        else {
            setOtpError("");
        }
        const calling_code = await AsyncStorage.getItem('calling_code');
        await AsyncStorage.setItem("signupMobile", calling_code + Mobile);
        const region = await AsyncStorage.getItem('country_code');
        axios.post(FIRETV_BASE_URL_STAGING + "users/signup_otp", {
            auth_token: AUTH_TOKEN,
            user: { user_id: calling_code + Mobile, region: region, type: "msisdn", firstname: Name }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(JSON.stringify(response.data));
                navigation.dispatch(StackActions.replace('Otp', { 'otpkey': 'signupMobile' }));
            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
            }
            );
    }
    const navigatetopage = async (key) => {
        var url = await AsyncStorage.getItem(key);
        navigation.navigate('Webview', { uri: url })
    }
    const loaddata = async () => {
        const region = await AsyncStorage.getItem('country_code');
        setregion(region);
    }
    useEffect(() => {
        loaddata();
    })

    async function postDataInternational(type) {
        const region = await AsyncStorage.getItem('country_code');
        const calling_code = await AsyncStorage.getItem('calling_code');
        const user_id = await AsyncStorage.getItem('user_id');
        const uniqueid = await DeviceInfo.getUniqueId();
        var userId = "";
        { type == 'email' ? userId = emailMobile : userId = calling_code + emailMobile }
        //posting data
        axios.post(FIRETV_BASE_URL + "users", {
            auth_token: AUTH_TOKEN,
            user: { user_id: userId, firstname: name, password: newpassword, region: region, type: type }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                //console.log(JSON.stringify(response));
                setOtpError('')
                {
                    type == 'email' ?
                        setOtpError('Verification link has been sent to \r\n \r\n ' + userId + '. \r\n \r\n Please click the link in that email to continue.')
                        :
                        navigation.navigate('Otp', { 'otpkey': 'signupMobile' })

                    type == 'email' ? triggersuccessanalytics('signup_success', 'email id', user_id, uniqueid) : ""
                }
                setshowresend(true);

            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
                type == 'email' ? triggerfailureanalytics('signup_failure', error.response.data.error.message, 'email id', uniqueid) : ""
            }
            );
    }
    const registerEmailUserInternational = async () => {
        if (name.trim() == "") { setNameError("Please enter name."); return true; } else setNameError("");
        if (emailMobile.trim() == "") { setemailMobileError("Please enter your email or mobile no."); return true; } else setemailMobileError("");
        if (newpassword.trim() == "") { setnewpasswordError("Please enter new password."); return true; } else setnewpasswordError("");
        if (confirmpassword.trim() == "") { setconfirmpasswordError("Please confirm your password."); return true; } else setconfirmpasswordError("");
        if (confirmpassword.trim() != newpassword.trim()) { setconfirmpasswordError("Password Mismatch. Please re-enter"); return true; } else setconfirmpasswordError("");
        if (ValidateEmail(emailMobile)) {
            setemailMobileError("");
            if (CheckPassword(newpassword)) {
                setnewpasswordError("");
                if (!termscheck) {
                    setOtpError('Please select Terms Of Use and Privacy Policy.');
                    return true;
                }
                else {
                    setOtpError('');
                    postDataInternational('email');
                }
            }
            else {
                setnewpasswordError("Password should be minimum of 8 digits and it should have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."); return true;
            }
        }
        else {


            setemailMobileError("");
            if (CheckPassword(newpassword)) {
                setnewpasswordError("");
                if (!termscheck) {
                    setOtpError('Please select Terms Of Use and Privacy Policy.');
                    return true;
                }
                else {
                    setOtpError('');
                    postDataInternational('mobile');
                }
            }
            else {
                setnewpasswordError("Password should be minimum of 8 digits and it should have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."); return true;
            }

        }

    }
    const loadView = async (key) => {
        var url = await AsyncStorage.getItem(key);
        navigation.navigate('Webview', { uri: url })
    }
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            {region == 'IN' ?
                <ScrollView style={{ flex: 1, }}>
                    <View style={styles.header}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 17, fontWeight: '500' }}>Sign Up</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20, }} onPress={() => navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13, fontWeight: '500' }}>SKIP</Text></TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, }}>
                        <Pressable onPress={() => { setSelected('mobile'); setTermsCheck(false); }} style={[selected == 'mobile' ? styles.selectedBackground : styles.unselectedBackground, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}><View style={styles.innerView}><Text style={selected == 'mobile' ? { fontWeight: 'bold', color: NORMAL_TEXT_COLOR } : { fontWeight: 'bold' }}>Mobile No</Text></View></Pressable>
                        <Pressable onPress={() => { setSelected('email'); setTermsCheck(false); }} style={[selected == 'email' ? styles.selectedBackground : styles.unselectedBackground, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}><View style={styles.innerView}><Text style={selected == 'email' ? { fontWeight: 'bold', color: NORMAL_TEXT_COLOR } : { fontWeight: 'bold' }}>Email Id</Text></View></Pressable>
                    </View>

                    {selected == 'mobile' ?
                        <View style={styles.body}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.errormessage}>{otpError}</Text>
                            </View>
                            <TextInput maxLength={10} onChangeText={setname} value={Name} style={styles.textinput} placeholder="Name*" placeholderTextColor={NORMAL_TEXT_COLOR} keyboardType='default' />
                            <Text style={styles.errormessage}>{nameerror}</Text>

                            <TextInput maxLength={10} onChangeText={setMobile} value={Mobile} style={styles.textinput} placeholder="Mobile Number*" placeholderTextColor={NORMAL_TEXT_COLOR} keyboardType='phone-pad' />
                            <Text style={styles.errormessage}>{MobileError}</Text>
                            <View style={{ marginBottom: 20, marginTop: 10, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {termscheck ?
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                                    :
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                                }

                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12, justifyContent: 'center', alignItems: 'center', }}> I agree to the </Text>

                                <Pressable onPress={() => navigatetopage('termsCondition')}>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }}> TERMS OF USE </Text>
                                </Pressable>

                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12, justifyContent: 'center', alignItems: 'center', }}>and</Text>

                                <Pressable onPress={() => navigatetopage('privacy')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }} > PRIVACY POLICY </Text></Pressable>


                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={signUpMobileUser}>
                                            <LinearGradient
                                                useAngle={true}
                                                angle={125}
                                                angleCenter={{ x: 0.5, y: 0.5 }}
                                                colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]} style={styles.button}>
                                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Login'))} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>


                        </View>
                        :
                        <View style={styles.body}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.errormessage}>{otpError}</Text>
                            </View>
                            {showresend ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                                    <Pressable onPress={resendEmail}><Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 18 }}>Resend Email</Text></Pressable>
                                </View>
                                :
                                ""
                            }

                            <TextInput onChangeText={setName} value={name} style={styles.textinput} placeholder="Name *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                            <Text style={styles.errormessage}>{nameError}</Text>
                            <TextInput onChangeText={setemailMobile} value={emailMobile} style={styles.textinput} placeholder="Email*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                            <Text style={styles.errormessage}>{emailMobileError}</Text>
                            <TextInput onChangeText={setnewpassword} secureTextEntry={true} value={newpassword} style={styles.textinput} placeholder="New Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                            <Text style={styles.errormessage}>{newpasswordError}</Text>
                            <TextInput onChangeText={setconfirmpassword} secureTextEntry={true} value={confirmpassword} style={styles.textinput} placeholder="Confirm Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                            <Text style={styles.errormessage}>{confirmpasswordError}</Text>

                            <View style={{ marginBottom: 20, marginTop: 10, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {termscheck ?
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                                    :
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                                }
                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12, justifyContent: 'center', alignItems: 'center', }}> I agree to the </Text>

                                <Pressable onPress={() => navigatetopage('termsCondition')}>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }}> TERMS OF USE </Text>
                                </Pressable>

                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12, justifyContent: 'center', alignItems: 'center', }}>and</Text>

                                <Pressable onPress={() => navigatetopage('privacy')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }} > PRIVACY POLICY </Text></Pressable>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <Text style={styles.errormessage}>{registerError}</Text>
                                    <Text style={styles.successmessage}>{registerSuccess}</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={registerEmailUser}>

                                            <LinearGradient
                                                useAngle={true}
                                                angle={125}
                                                angleCenter={{ x: 0.5, y: 0.5 }}
                                                colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]} style={styles.button}>
                                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text>
                                            </LinearGradient>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Login'))} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                </ScrollView>
                :
                <ScrollView style={{ flex: 1, }}>
                    <View style={styles.body}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 17, fontWeight: '500' }}>Sign Up</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{otpError}</Text>
                        </View>
                        {showresend ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                                <Pressable onPress={resendEmail}><Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 18 }}>Resend Email</Text></Pressable>
                            </View>
                            :
                            ""
                        }

                        <TextInput onChangeText={setName} value={name} style={styles.textinput} placeholder="Name *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{nameError}</Text>
                        <TextInput onChangeText={setemailMobile} value={emailMobile} style={styles.textinput} placeholder="Email / Mobile No*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{emailMobileError}</Text>
                        <TextInput onChangeText={setnewpassword} secureTextEntry={true} value={newpassword} style={styles.textinput} placeholder="New Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{newpasswordError}</Text>
                        <TextInput onChangeText={setconfirmpassword} secureTextEntry={true} value={confirmpassword} style={styles.textinput} placeholder="Confirm Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                        <Text style={styles.errormessage}>{confirmpasswordError}</Text>

                        <View style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', width: '100%', }}>
                            {termscheck ?
                                <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                                :
                                <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={22} color={NORMAL_TEXT_COLOR} /></Pressable>
                            }
                            <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 14, marginLeft: 10, flex: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>I agree to the

                                <Pressable onPress={() => navigatetopage('termsCondition')}>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 11, fontWeight: '500' }}> TERMS OF USE </Text>
                                </Pressable> and

                                <Pressable onPress={() => navigatetopage('privacy')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 11, fontWeight: '500' }} > PRIVACY POLICY </Text></Pressable>

                            </Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Text style={styles.errormessage}>{registerError}</Text>
                                <Text style={styles.successmessage}>{registerSuccess}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <TouchableOpacity onPress={registerEmailUserInternational}>

                                        <LinearGradient
                                            useAngle={true}
                                            angle={125}
                                            angleCenter={{ x: 0.5, y: 0.5 }}
                                            colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]} style={styles.button}>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign Up</Text>
                                        </LinearGradient>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 50 }}>
                            <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Login'))} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }

            <View style={{ width: "100%", position: 'absolute', bottom: 30, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Pressable onPress={() => loadView('privacy')}><Text style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 11 }}>Privacy Policy</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('HTMLRender', { pagename: 'terms_conditions' })}><Text style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 11 }}>Terms of Use</Text></Pressable>
                <Pressable onPress={() => loadView('faq')}><Text style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 11 }}>FAQ</Text></Pressable>
                <Pressable onPress={() => loadView('contactUs')}><Text style={{ color: FOOTER_DEFAULT_TEXT_COLOR, fontSize: 11 }}>Contact Us</Text></Pressable>
            </View>
            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: { justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    body: { backgroundColor: BACKGROUND_COLOR, height: "100%", padding: 20, },
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 20, fontSize: 12, color: NORMAL_TEXT_COLOR, padding: 2 },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 10, borderRadius: 10, marginRight: 20, borderColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5 },
    errormessage: { color: 'red', fontSize: 15 },
    successmessage: { color: NORMAL_TEXT_COLOR, fontSize: 15 },
    unselectedBackground: { backgroundColor: NORMAL_TEXT_COLOR, },
    selectedBackground: { backgroundColor: MORE_LINK_COLOR, },
    innerView: { paddingLeft: 30, paddingRight: 30, paddingBottom: 15, paddingTop: 15 }
});