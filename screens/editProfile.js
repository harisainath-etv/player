import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR, TAB_COLOR, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, VIDEO_AUTH_TOKEN, ACCESS_TOKEN, FIRETV_BASE_URL_STAGING, SLIDER_PAGINATION_UNSELECTED_COLOR, } from '../constants';
import { DETAILS_TEXT_COLOR } from '../constants';
import { StackActions } from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';



export default function EditProfile({ navigation }) {
    const [login, setLogin] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [dob, setdob] = useState();
    const [gender, setgender] = useState("");
    const [address, setaddress] = useState("");
    const [pincode, setpincode] = useState("");
    const [subscription_title, setsubscription_title] = useState("");
    const [expireson, setexpireson] = useState("");
    const [open, setOpen] = useState(false)
    const [datofBirth, setdateofbirth] = useState(new Date())

    const ref = useRef(null);

    const loadData = async () => {
        const firstname = await AsyncStorage.getItem('firstname');
        const email = await AsyncStorage.getItem('email_id');
        const mobile_number = await AsyncStorage.getItem('mobile_number');
        const session = await AsyncStorage.getItem('session');
        const profile_pic = await AsyncStorage.getItem('profile_pic');
        const birthdate = await AsyncStorage.getItem('birthdate');
        const gender = await AsyncStorage.getItem('gender');
        const address = await AsyncStorage.getItem('address');
        const valid_till = await AsyncStorage.getItem('valid_till');
        const subscriptiontitle = await AsyncStorage.getItem('subscription_title');
        const pincode = await AsyncStorage.getItem('pincode');
        if (session != "" && session != null) {
            setLogin(true)
            setName(firstname);
            setEmail(email);
            setMobile(mobile_number);
            if (birthdate != "" && birthdate != null)
                setdob(birthdate);
            setgender(gender)
            setaddress(address)
            setsubscription_title(subscriptiontitle)
            setexpireson(valid_till)
            setpincode(pincode);
        }
        if (profile_pic != "" && profile_pic != null)
            setProfilePic(profile_pic)

        //console.log(profile_pic);
    }
    useEffect(() => {
        if (ref.current == true)
            return
        ref.current = true;
        loadData();
    })
    const updateUser = async () => {
        var session = await AsyncStorage.getItem('session');
        var dateofbirth = datofBirth.getFullYear() + "-" + datofBirth.getMonth() + "-" + datofBirth.getDate();
        await axios.put(FIRETV_BASE_URL_STAGING + 'users/' + session + '/account', {
            access_token: ACCESS_TOKEN,
            auth_token: VIDEO_AUTH_TOKEN,
            user: {
                firstname: name,
                birthdate: dateofbirth,
                gender: gender
            }
        }).then(resp => {
            AsyncStorage.setItem('firstname', name);
            AsyncStorage.setItem('birthdate', dateofbirth);
            AsyncStorage.setItem('gender', gender);
            alert('Updated');
        }).catch(error => { console.log(error.response.data); })

    }

    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            <View style={{ marginTop: 20, marginLeft: 10 }}>
                <TouchableOpacity onPress={() => {
                    if (navigation.canGoBack())
                        navigation.goBack()
                    else
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                }}>
                    <Ionicons name="arrow-back" size={30} color="#ffffff" style={{ marginTop: 10 }} />
                </TouchableOpacity>
            </View>
            {!login ?

                <ImageBackground
                    source={require('../assets/images/drawer_header.png')}
                    resizeMode="cover"
                    style={styles.drawerHeaderImage}>
                    <View style={{ padding: 25 }}>
                        <Text style={styles.drawerHeaderText}>Hi Guest User!</Text>
                        <View style={{ flexDirection: 'row', marginTop: 25 }}>
                            <TouchableOpacity onPress={() => { toggleModal(); navigation.dispatch(StackActions.replace('Login', {})); }} style={{ backgroundColor: TAB_COLOR, padding: 13, borderRadius: 10, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.drawerHeaderText}>SIGN IN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { toggleModal(); navigation.dispatch(StackActions.replace('Signup', {})); }} style={{ borderColor: TAB_COLOR, padding: 13, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.drawerHeaderText}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                :
                profilePic != "" && profilePic != null ?

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: profilePic }}
                            resizeMode="center"
                            style={styles.drawerHeaderImage}
                        ></Image>
                    </View>


                    :

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/usericon.png')}
                            resizeMode="center"
                            style={styles.drawerHeaderImage}
                        ></Image>
                    </View>

            }

            <ScrollView style={{ marginTop: 20 }}>

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Name *</Text>
                    <TextInput value={name} onChange={setName} style={styles.textinput} placeholder='Name' placeholderTextColor={NORMAL_TEXT_COLOR} ></TextInput>
                </View>

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>DOB</Text>
                    {dob != "" && dob != null ?
                        <Pressable onPress={() => { setOpen(true) }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, padding: 10 }}>{dob}</Text></Pressable>
                        :
                        <Pressable onPress={() => { setOpen(true) }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, padding: 10 }}>{datofBirth.toLocaleDateString()}</Text></Pressable>
                    }
                </View>

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Gender</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {gender == 'Male' ?
                            <Pressable style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name='radiobox-marked' size={25} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Male</Text>
                            </Pressable>
                            :
                            <Pressable style={{ flexDirection: 'row' }} onPress={() => { setgender('Male') }}>
                                <MaterialCommunityIcons name='radiobox-blank' size={25} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Male</Text>
                            </Pressable>
                        }
                        {gender == 'Female' ?
                            <Pressable style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name='radiobox-marked' size={25} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Female</Text>
                            </Pressable>
                            :
                            <Pressable style={{ flexDirection: 'row' }} onPress={() => { setgender('Female') }}>
                                <MaterialCommunityIcons name='radiobox-blank' size={25} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Female</Text>
                            </Pressable>
                        }
                    </View>
                </View>

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Pincode</Text>
                    <TextInput value={pincode} onChange={setpincode} style={styles.textinput} placeholder='Pincode' placeholderTextColor={NORMAL_TEXT_COLOR} keyboardType='number-pad'></TextInput>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                    <TouchableOpacity onPress={updateUser} style={{ backgroundColor: TAB_COLOR, paddingTop: 10, paddingBottom: 10, paddingLeft: 22, paddingRight: 22, borderRadius: 20 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>Update</Text></TouchableOpacity>
                </View>
            </ScrollView>

            <DatePicker
                modal
                open={open}
                date={datofBirth}
                onConfirm={(date) => {
                    setOpen(false)
                    setdateofbirth(date)
                    setdob("");
                }}
                onCancel={() => {
                    setOpen(false)
                }}
                mode='date'
            />
        </View>
    )
}
const styles = StyleSheet.create({
    drawerHeaderText: { color: NORMAL_TEXT_COLOR, fontSize: 18, fontWeight: 'bold' },
    drawerHeaderImage: { width: "100%", height: 120 },
    inneroption: { borderTopColor: DETAILS_TEXT_COLOR, borderBottomColor: DETAILS_TEXT_COLOR, borderWidth: 0.5, padding: 10 },
    detailsheader: { color: DETAILS_TEXT_COLOR, fontSize: 14 },
    detailsvalue: { color: NORMAL_TEXT_COLOR, fontSize: 17 },
    textinput: { width: "100%", color: NORMAL_TEXT_COLOR, padding: 10 }
});