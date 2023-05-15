import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, FIRETV_BASE_URL_STAGING, AUTH_TOKEN, DETAILS_TEXT_COLOR, MORE_LINK_COLOR } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';

export default function MobileUpdate({ navigation }) {
    const [Mobile, setMobile] = useState('');
    
    const [MobileError, setMobileError] = useState('');
    
    const [signinError, setsigninError] = useState('');
    const [signinSuccess, setsigninSuccess] = useState('');
    
    const updateMobileUser = async () => {
        if (Mobile.trim() == "") { setMobileError("Please enter your mobile number."); return true; } else setMobileError("");
        if (Mobile.trim().length != 10) { setMobileError("Please enter a valid mobile number."); return true; } else setMobileError("");

        await AsyncStorage.setItem("updateMobile","0091"+Mobile);
        const region = await AsyncStorage.getItem('country_code');
        const session_id = await AsyncStorage.getItem('session');
        console.log(FIRETV_BASE_URL_STAGING + "users/"+session_id+"/generate_mobile_otp ");
        axios.post(FIRETV_BASE_URL_STAGING + "users/"+session_id+"/generate_mobile_otp ", {
            auth_token: AUTH_TOKEN,
            profile: { region: region, type: "msisdn",user_id:"0091"+Mobile}
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(updatesresp=>{
                    setMobileError("")
                    navigation.dispatch(StackActions.replace('Otp',{'otpkey':'updateMobile'}));
                
        }).catch(updateerror=>{
            setMobileError(updateerror.response.data.error.message)
        })

    }
    
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <View style={{ flex: 1, }}>

                <View style={styles.header}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Update the Mobile Number</Text>
                </View>
                
                
                    <View style={styles.body}>
                        <TextInput  maxLength={10}  onChangeText={setMobile} value={Mobile} style={styles.textinput} placeholder="Mobile Number*" placeholderTextColor={NORMAL_TEXT_COLOR} keyboardType='phone-pad'/>
                        <Text style={styles.errormessage}>{MobileError}</Text>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.errormessage}>{signinError}</Text>
                            <Text style={styles.successmessage}>{signinSuccess}</Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                    <TouchableOpacity onPress={updateMobileUser} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Next</Text></TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>

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
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 },
    errormessage: { color: 'red', fontSize: 15 },
    successmessage: { color: NORMAL_TEXT_COLOR, fontSize: 15 },
    unselectedBackground: { backgroundColor: NORMAL_TEXT_COLOR, },
    selectedBackground: { backgroundColor: MORE_LINK_COLOR, },
    innerView: { paddingLeft: 30, paddingRight: 30, paddingBottom: 15, paddingTop: 15 }
});