import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/native';
import { BACKGROUND_COLOR, DETAILS_TEXT_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-date-picker';

export default function FrontProfile({ navigation }) {
    const [open, setOpen] = useState(false)
    const [datofBirth, setdateofbirth] = useState(new Date())
    const [dob, setdob] = useState();
    const [gender, setgender] = useState();
    const [pincode, setpincode] = useState();


    const checkload = async () => {
        var firstload = await AsyncStorage.getItem('firstload');
        if (firstload == 'no') {
            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
        }
    }
    useEffect(() => {
        checkload()
    })
    const updateprofile = async () => {
        var dateofbirth = datofBirth.getDate() + "-" + (+datofBirth.getMonth() + 1) + "-" + datofBirth.getFullYear();
        await AsyncStorage.setItem('frontpagedob', dateofbirth);
        await AsyncStorage.setItem('frontpagegender', gender);
        await AsyncStorage.setItem('frontpagepincode', pincode);
        await AsyncStorage.setItem('firstload', 'no')
        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }));
    }

    return (
        <ScrollView style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold', fontSize: 20 }}>Add Profile Info</Text>
            </View>
            <View style={{ padding: 25 }}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR }}>DOB</Text>
                    {dob != "" && dob != null ?
                        <Pressable style={{ color: NORMAL_TEXT_COLOR, borderBottomColor: DETAILS_TEXT_COLOR, borderBottomWidth: 0.5, padding: 10 }} onPress={() => { setOpen(true) }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, padding: 10 }}>{dob}</Text></Pressable>
                        :
                        <Pressable style={{ color: NORMAL_TEXT_COLOR, borderBottomColor: DETAILS_TEXT_COLOR, borderBottomWidth: 0.5, padding: 10 }} onPress={() => { setOpen(true) }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, padding: 10 }}>{datofBirth.toLocaleDateString()}</Text></Pressable>
                    }
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR }}>Gender</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Pressable onPress={() => { setgender('Male') }} style={gender == 'Male' ? styles.genderSelected : styles.gender}>
                            <MaterialCommunityIcons size={30} color={gender == 'Male' ? SLIDER_PAGINATION_SELECTED_COLOR : NORMAL_TEXT_COLOR} name='gender-male' />
                            <Text style={{ color: gender == 'Male' ? SLIDER_PAGINATION_SELECTED_COLOR : NORMAL_TEXT_COLOR }}>Male</Text>
                        </Pressable>
                        <Pressable onPress={() => { setgender('Female') }} style={gender == 'Female' ? styles.genderSelected : styles.gender}>
                            <MaterialCommunityIcons size={30} color={gender == 'Female' ? SLIDER_PAGINATION_SELECTED_COLOR : NORMAL_TEXT_COLOR} name='gender-female' />
                            <Text style={{ color: gender == 'Female' ? SLIDER_PAGINATION_SELECTED_COLOR : NORMAL_TEXT_COLOR }}>Female</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ marginBottom: 60 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR }}>Pincode</Text>
                    <TextInput placeholder='000000' onChangeText={setpincode} placeholderTextColor={NORMAL_TEXT_COLOR} style={{ color: NORMAL_TEXT_COLOR, borderBottomColor: DETAILS_TEXT_COLOR, borderBottomWidth: 0.5, padding: 10 }} keyboardType='numeric'></TextInput>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                    <Pressable onPress={updateprofile} style={{ padding: 18, borderColor: DETAILS_TEXT_COLOR, borderWidth: 1, borderRadius: 10 }}>
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>Continue</Text>
                    </Pressable>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable onPress={async () => {
                        await AsyncStorage.setItem('firstload', 'no')
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }));
                    }} style={{}}>
                        <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 18 }}>Skip</Text>
                    </Pressable>
                </View>
            </View>
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    gender: { borderColor: DETAILS_TEXT_COLOR, borderRadius: 5, borderWidth: 1, padding: 5, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    genderSelected: { borderColor: SLIDER_PAGINATION_SELECTED_COLOR, borderRadius: 5, borderWidth: 1, padding: 5, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
})