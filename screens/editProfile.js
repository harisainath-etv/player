import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR, TAB_COLOR, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, VIDEO_AUTH_TOKEN, ACCESS_TOKEN, FIRETV_BASE_URL_STAGING, SLIDER_PAGINATION_UNSELECTED_COLOR, BUTTON_COLOR, FOOTER_DEFAULT_TEXT_COLOR, } from '../constants';
import { DETAILS_TEXT_COLOR } from '../constants';
import { StackActions } from '@react-navigation/native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';



export default function EditProfile({ navigation }) {
    const [login, setLogin] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [dob, setdob] = useState();
    const [gender, setgender] = useState("");
    const [address, setaddress] = useState("");
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
        if (session != "" && session != null) {
            setLogin(true)
            setName(firstname);
            setEmail(email);
            setMobile(mobile_number);
            if (birthdate != "" && birthdate != null)
                setdob(birthdate);
            setgender(gender)
            if (address != "" && address != null)
                setaddress(address)
            setsubscription_title(subscriptiontitle)
            setexpireson(valid_till)
        }
        if (profile_pic != "" && profile_pic != null)
            setProfilePic(profile_pic)

        //console.log(profile_pic);
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [])
    );
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    const updateUser = async () => {
        var session = await AsyncStorage.getItem('session');
        var dateofbirth = datofBirth.getDate() + "-" + (+datofBirth.getMonth() + 1) + "-" + datofBirth.getFullYear();
        await axios.put(FIRETV_BASE_URL_STAGING + 'users/' + session + '/account', {
            access_token: ACCESS_TOKEN,
            auth_token: VIDEO_AUTH_TOKEN,
            user: {
                firstname: name,
                birthdate: dateofbirth,
                gender: gender,
                address: address
            }
        }).then(resp => {
            AsyncStorage.setItem('firstname', name);
            AsyncStorage.setItem('birthdate', dateofbirth);
            AsyncStorage.setItem('gender', gender);
            AsyncStorage.removeItem('address').then(respo => {
                AsyncStorage.setItem('address', address);
            }).catch(err => { })
            alert('Updated');
            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
        }).catch(error => { console.log(error.response.data); })

    }
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            <View style={{ marginTop: 30, marginLeft: 10 }}>
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

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={NORMAL_TEXT_COLOR} />
                </View>

                :
                // profilePic != "" && profilePic != null && validURL(profilePic) ?

                //     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                //         <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 100, height: 100, borderRadius: 50 }}>
                //             {name != "" && name != null ?
                //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                //                 :
                //                 <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 50, fontWeight: 'bold' }}>-</Text>
                //             }
                //         </View>
                //     </View>


                //     :

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, width: 60, height: 60, borderRadius: 30 }}>
                            {name != "" && name != null ?
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, fontWeight: 'bold' }}>{name.charAt(0)}</Text>
                                :
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, fontWeight: 'bold' }}>-</Text>
                            }
                        </View>
                    </View>

            }

            <ScrollView style={{ marginTop: 20 }}>

                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Name *</Text>
                    <TextInput value={name} onChange={setName} style={styles.textinput} placeholder='Name' placeholderTextColor={NORMAL_TEXT_COLOR} ></TextInput>
                </View>
                <View style={styles.inneroption}>
                    <Text style={styles.detailsheader}>Location / Pincode</Text>
                    <TextInput value={address} onChangeText={setaddress} style={styles.textinput} placeholder='Location / Pincode' placeholderTextColor={NORMAL_TEXT_COLOR}></TextInput>
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
                                <MaterialCommunityIcons name='radiobox-marked' size={20} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Male</Text>
                            </Pressable>
                            :
                            <Pressable style={{ flexDirection: 'row' }} onPress={() => { setgender('Male') }}>
                                <MaterialCommunityIcons name='radiobox-blank' size={20} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Male</Text>
                            </Pressable>
                        }
                        {gender == 'Female' ?
                            <Pressable style={{ flexDirection: 'row' }}>
                                <MaterialCommunityIcons name='radiobox-marked' size={20} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Female</Text>
                            </Pressable>
                            :
                            <Pressable style={{ flexDirection: 'row' }} onPress={() => { setgender('Female') }}>
                                <MaterialCommunityIcons name='radiobox-blank' size={20} color={NORMAL_TEXT_COLOR} />
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15 }}>Female</Text>
                            </Pressable>
                        }
                    </View>
                </View>


                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                    <TouchableOpacity onPress={updateUser}>

                        <LinearGradient
                            useAngle={true}
                            angle={125}
                            angleCenter={{ x: 0.5, y: 0.5 }}
                            colors={[BUTTON_COLOR, BUTTON_COLOR, BUTTON_COLOR, TAB_COLOR, TAB_COLOR, TAB_COLOR]}
                            style={{ backgroundColor: TAB_COLOR, paddingTop: 7, paddingBottom: 7, paddingLeft: 22, paddingRight: 22, borderRadius: 20, borderColor: FOOTER_DEFAULT_TEXT_COLOR, borderWidth: 0.5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13 }}>Update</Text>
                            </View>
                        </LinearGradient>

                    </TouchableOpacity>
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
    inneroption: { borderTopColor: DETAILS_TEXT_COLOR, borderBottomColor: DETAILS_TEXT_COLOR, borderWidth: 0.5, padding: 5 },
    detailsheader: { color: DETAILS_TEXT_COLOR, fontSize: 11 },
    detailsvalue: { color: NORMAL_TEXT_COLOR, fontSize: 14 },
    textinput: { width: "100%", color: NORMAL_TEXT_COLOR, padding: 5 }
});