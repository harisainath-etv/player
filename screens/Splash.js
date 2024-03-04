import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Video from 'react-native-video'
import { StackActions, useIsFocused } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = ({ navigation }) => {
    const isfocus = useIsFocused()
    useEffect(() => {
        setTimeout(() => {
            Back();
        }, 5000)
    }, [isfocus])
    const Back = async () => {
        try {
                const sessionlo = await AsyncStorage.getItem('session');
                const login = sessionlo; // Parse the session data if needed
                if (login) {
                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }));
                } else {
                    navigation.dispatch(StackActions.replace('Onboarding'));
                }
            
        } catch (error) {
            console.error("Error occurred while navigating:", error);
            // Handle the error as per your requirement
        }
    }
   
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: null, height: null }}>
            <FastImage
                source={require('../assets/launch_screen.gif')}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // opacity: 0.3
                }}
                resizeMode="cover"
            />
        </View>
    )
}

export default Splash
