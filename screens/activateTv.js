import { View, Text, StyleSheet, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from './header'
import { ACCESS_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ActivateTv() {
    const [otp, setOtp] = useState();
    const [otpactivatteError, setotpactivatteError] = useState("");
    const activateTv = async () => {
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        console.log("hi");
        axios.post(FIRETV_BASE_URL_STAGING + "/generate_session_tv", {
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            region: region,
            user: { session_id: sessionId, token: otp }
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            alert("Activated");
            setotpactivatteError("")
        }).catch(error => {
            //console.log(JSON.stringify(error.response.data));
            setotpactivatteError(error.response.data.error.message)
        })
    }
    return (
        <View style={styles.mainContainer}>
            <Header pageName="ACTIVATETV"></Header>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color:'red',fontSize:18}}>{otpactivatteError}</Text>
                <Image
                    source={require('../assets/images/activate-tv-main-icon.png')}
                    style={{ width: '70%', height: '45%', }}
                    resizeMode='stretch'
                />
                <Text style={{ fontWeight: 'bold', color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Activate ETV WIN on your TV</Text>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Enter the Activation code displayed on your TV screen</Text>
                <TextInput
                    textAlign='center'
                    style={styles.input}
                    onChangeText={setOtp}
                    value={otp}
                    placeholder="Enter Activation Code"
                    keyboardType="numeric"
                    placeholderTextColor={NORMAL_TEXT_COLOR}
                />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={activateTv} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Activate</Text></TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    input: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '70%',
        borderBottomColor: NORMAL_TEXT_COLOR,
        borderTopColor: BACKGROUND_COLOR,
        borderRightColor: BACKGROUND_COLOR,
        borderLeftColor: BACKGROUND_COLOR,
        color:NORMAL_TEXT_COLOR,
        fontSize:25
    },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 },
})