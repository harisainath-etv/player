import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView,Pressable } from 'react-native'
import React,{useState} from 'react'
import Header from './header'
import { ANDROID_PACKAGE_NAME, ANDROID_SHARE_MESSAGE, ANDROID_SHARE_URL, BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Share from 'react-native-share';
import Rate, { AndroidMarket } from 'react-native-rate'

export default function More({navigation}) {
    const loadView = async (key) =>{
        var url = await AsyncStorage.getItem(key);
        navigation.navigate('Webview',{uri:url})
    }
    const navigatetopage = async() =>{
        navigation.navigate('Feedback')
    }
    const [shareUrl, setShareUrl] = useState(ANDROID_SHARE_URL);
    const shareOptions = async () => {
        const shareOptions = {
            title: "Check out the ETV Win App",
            failOnCancel: false,
            message: ANDROID_SHARE_MESSAGE+shareUrl,
        };
        const ShareResponse = await Share.open(shareOptions);
    }
    const options = {
        AppleAppID:"",
        GooglePackageName:ANDROID_PACKAGE_NAME,
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp:false,
        openAppStoreIfInAppFails:true,
      }

    return (
        <ScrollView style={styles.mainContainer}>
            <Header name="More"></Header>
            
            <TouchableOpacity onPress={()=>loadView('about')}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>About Us</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>loadView('contactUs')}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Contact Us</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>loadView('privacy')}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Privacy Policy</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>loadView('termsCondition')}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Terms of Service</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>loadView('faq')}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>FAQ</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigatetopage}>
            <View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Feedback</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </TouchableOpacity>

            <Pressable onPress={shareOptions}><View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Share the app</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </Pressable>

            <Pressable onPress={()=>{
                Rate.rate(options, (success, errorMessage)=>{
                    if (success) {
                    }
                    if (errorMessage) {
                      // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                      console.error(`Example page Rate.rate() error: ${errorMessage}`)
                    }
                  })
        
            }}><View style={styles.item}>
                <View style={{width:"80%"}}>
                    <Text style={styles.textstyle}>Rate the app</Text>
                </View>
                <View style={{width:"20%"}}>
                    <MaterialCommunityIcons name='greater-than' size={20} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                </View>
            </View>
            </Pressable>
            <StatusBar barStyle={'default'}></StatusBar>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    item: { padding: 15, borderBottomColor: DARKED_BORDER_COLOR, borderWidth: 1, flexDirection: 'row', },
    textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})