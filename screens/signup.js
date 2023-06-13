import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, ACCESS_TOKEN, MORE_LINK_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

    async function postData(type) {
        const region = await AsyncStorage.getItem('country_code');
        const calling_code = await AsyncStorage.getItem('calling_code');
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

            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
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
                    navigation.navigate('Otp',{ 'otpkey': 'signupMobile' })
                }
                setshowresend(true);

            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setOtpError(error.response.data.error.message)
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
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            {region == 'IN' ?
                <View style={{ flex: 1, }}>
                    <View style={styles.header}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Sign Up</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20, }} onPress={() => navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>SKIP</Text></TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, }}>
                        <Pressable onPress={() => { setSelected('mobile'); setTermsCheck(false); }} style={[selected == 'mobile' ? styles.selectedBackground : styles.unselectedBackground, { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]}><View style={styles.innerView}><Text style={{ fontWeight: 'bold' }}>Mobile No</Text></View></Pressable>
                        <Pressable onPress={() => { setSelected('email'); setTermsCheck(false); }} style={[selected == 'email' ? styles.selectedBackground : styles.unselectedBackground, { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}><View style={styles.innerView}><Text style={{ fontWeight: 'bold' }}>Email Id</Text></View></Pressable>
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
                            <View style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', width: '100%', }}>
                                {termscheck ?
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                                    :
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                                }
                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}>I agree to the <Pressable onPress={() => navigatetopage('termsCondition')}><Text style={{ color: NORMAL_TEXT_COLOR }}>TERMS OF USE</Text></Pressable> and <Pressable><Text style={{ color: NORMAL_TEXT_COLOR }} onPress={() => navigatetopage('privacy')}>PRIVACY POLICY</Text></Pressable></Text>


                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={signUpMobileUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text></TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
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

                            <View style={{ marginBottom: 10, marginTop: 10, flexDirection: 'row', width: '100%', }}>
                                {termscheck ?
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                                    :
                                    <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                                }
                                <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}>I agree to the <Pressable onPress={() => navigatetopage('termsCondition')}><Text style={{ color: NORMAL_TEXT_COLOR }}>TERMS OF USE</Text></Pressable> and <Pressable><Text style={{ color: NORMAL_TEXT_COLOR }} onPress={() => navigatetopage('privacy')}>PRIVACY POLICY</Text></Pressable></Text>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <Text style={styles.errormessage}>{registerError}</Text>
                                    <Text style={styles.successmessage}>{registerSuccess}</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={registerEmailUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text></TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                </View>
                :
                <View style={{ flex: 1, }}>
                    <View style={styles.body}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 30 }}>Sign Up</Text>
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
                                <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-marked' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                                :
                                <Pressable onPress={() => { setTermsCheck(!termscheck) }}><MaterialCommunityIcons name='checkbox-blank-outline' size={35} color={NORMAL_TEXT_COLOR} /></Pressable>
                            }
                            <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16, marginLeft: 10, flex: 1, flexWrap: 'wrap' }}>I agree to the <Pressable onPress={() => navigatetopage('termsCondition')}><Text style={{ color: NORMAL_TEXT_COLOR }}>TERMS OF USE</Text></Pressable> and <Pressable><Text style={{ color: NORMAL_TEXT_COLOR }} onPress={() => navigatetopage('privacy')}>PRIVACY POLICY</Text></Pressable></Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <Text style={styles.errormessage}>{registerError}</Text>
                                <Text style={styles.successmessage}>{registerSuccess}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <TouchableOpacity onPress={registerEmailUserInternational} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign Up</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 50 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 16 }}>Already a Member?</Text>
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
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