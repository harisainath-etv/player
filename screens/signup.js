import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL, AUTH_TOKEN, ACCESS_TOKEN } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation }) {
    const [name, setName] = useState('');
    const [emailMobile, setemailMobile] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailMobileError, setemailMobileError] = useState('');
    const [newpasswordError, setnewpasswordError] = useState('');
    const [confirmpasswordError, setconfirmpasswordError] = useState('');
    const [registerError, setregisterError] = useState('');
    const [registerSuccess, setregisterSuccess] = useState('');

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
        var userId="";
        {type=='email' ? userId=emailMobile : userId=calling_code + emailMobile}
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
                setregisterError('')
                setregisterSuccess('Registered Successfully.')

            }).catch(error => {
                //console.log(error.response.status);
                //console.log(error.response.headers);
                setregisterError(error.response.data.error.message)
            }
            );
    }

    const registerUser = async () => {
        if (name.trim() == "") { setNameError("Please enter name."); return true; } else setNameError("");
        if (emailMobile.trim() == "") { setemailMobileError("Please enter your email or mobile number."); return true; } else setemailMobileError("");
        if (newpassword.trim() == "") { setnewpasswordError("Please enter new password."); return true; } else setnewpasswordError("");
        if (confirmpassword.trim() == "") { setconfirmpasswordError("Please confirm your password."); return true; } else setconfirmpasswordError("");
        if (confirmpassword.trim() != newpassword.trim()) { setconfirmpasswordError("Password Mismatch. Please re-enter"); return true; } else setconfirmpasswordError("");
        if (ValidateEmail(emailMobile)) {
            postData('email');
        }
        else {
            if (CheckPassword(newpassword)) {
                postData('msisdn');
            }
            else {
                setnewpasswordError("Password should be minimum of 8 digits and it should have at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."); return true;
            }
        }

    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <View style={{ flex: 1, }}>

                <View style={styles.header}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Sign Up</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 20, }} onPress={() => navigation.navigate('Home')}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>SKIP</Text></TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <TextInput onChangeText={setName} value={name} style={styles.textinput} placeholder="Name *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                    <Text style={styles.errormessage}>{nameError}</Text>
                    <TextInput onChangeText={setemailMobile} value={emailMobile} style={styles.textinput} placeholder="Email / Mobile *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                    <Text style={styles.errormessage}>{emailMobileError}</Text>
                    <TextInput onChangeText={setnewpassword} secureTextEntry={true} value={newpassword} style={styles.textinput} placeholder="New Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                    <Text style={styles.errormessage}>{newpasswordError}</Text>
                    <TextInput onChangeText={setconfirmpassword} secureTextEntry={true} value={confirmpassword} style={styles.textinput} placeholder="Confirm Password *" placeholderTextColor={NORMAL_TEXT_COLOR} />
                    <Text style={styles.errormessage}>{confirmpasswordError}</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.errormessage}>{registerError}</Text>
                        <Text style={styles.successmessage}>{registerSuccess}</Text>
                        <TouchableOpacity onPress={registerUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>SIGN UP</Text></TouchableOpacity>
                    </View>
                </View>

            </View>
            <StatusBar style="auto" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: { backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, justifyContent: 'center', alignItems: 'center', height: 80 },
    body: { backgroundColor: BACKGROUND_COLOR, height: "100%", padding: 20, },
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5 },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, marginTop: 50, width: 150, padding: 10, borderRadius: 20 },
    errormessage: { color: 'red', fontSize: 15 },
    successmessage: { color: NORMAL_TEXT_COLOR, fontSize: 15 }
});