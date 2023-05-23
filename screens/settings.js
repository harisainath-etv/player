import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from './header'
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, } from '../constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings() {
    const [notification, setnotification] = useState('no');
    const [dnd, setdnd] = useState('no');
    const [dndStartTime, setdndStartTime] = useState();
    const [dndEndTime, setdndEndTime] = useState();
    const notificationset = async () => {
        if (notification == 'no') {
            await AsyncStorage.setItem('receivenotification', 'yes')
            setnotification('yes')
        }
        if (notification == 'yes') {
            await AsyncStorage.setItem('receivenotification', 'no')
            setnotification('no')
        }
    }
    const dndset = async () => {
        if (dnd == 'no') {
            await AsyncStorage.setItem('dndpref', 'yes')
            setdnd('yes')
        }
        if (dnd == 'yes') {
            await AsyncStorage.setItem('dndpref', 'no')
            setdnd('no')
        }
    }
    const loadData = async () => {
        var receivenotification = await AsyncStorage.getItem('receivenotification');
        var dndStartTime = await AsyncStorage.getItem('dndStartTime');
        var dndEndTime = await AsyncStorage.getItem('dndEndTime');
        var dndpref = await AsyncStorage.getItem('dndpref');
        if (receivenotification == 'yes') {
            setnotification('yes')
        }
        else {
            setnotification('no')
        }

        if (dndpref == 'yes') {
            setdnd('yes')
        }
        else {
            setdnd('no')
        }
        setdndStartTime(dndStartTime)
        setdndEndTime(dndEndTime)

    }
    useEffect(() => {
        loadData()
    })
    return (
        <ScrollView style={styles.mainContainer}>
            <Header name="More"></Header>
            <TouchableOpacity onPress={notificationset}>
                <View style={styles.item}>
                    <View style={{ width: "10%" }}>
                        <MaterialIcons name='notifications' size={20} color={NORMAL_TEXT_COLOR} style={{ position: 'absolute', top: 2 }} />
                    </View>
                    <View style={{ width: "70%" }}>
                        <Text style={styles.textstyle}>Notifications</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                        {notification == 'yes' ?
                            <MaterialIcons name='toggle-on' size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                            :
                            <MaterialIcons name='toggle-off' size={35} color={NORMAL_TEXT_COLOR} style={{ position: 'absolute', right: 0 }} />
                        }
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={dndset}>
                <View style={styles.item}>
                    <View style={{ width: "10%" }}>
                        <MaterialIcons name='dnd-forwardslash' size={20} color={NORMAL_TEXT_COLOR} style={{ position: 'absolute', top: 10 }} />
                    </View>
                    <View style={{ width: "70%" }}>
                        <Text style={styles.textstyle}>Do Not Disturb</Text>
                        <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 12 }}>{dndStartTime} - {dndEndTime}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                        {dnd == 'yes' ?
                            <MaterialIcons name='toggle-on' size={35} color={SLIDER_PAGINATION_SELECTED_COLOR} style={{ position: 'absolute', right: 0 }} />
                            :
                            <MaterialIcons name='toggle-off' size={35} color={NORMAL_TEXT_COLOR} style={{ position: 'absolute', right: 0 }} />
                        }
                    </View>
                </View>
            </TouchableOpacity>


            <StatusBar barStyle={'default'}></StatusBar>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    item: { padding: 15, borderBottomColor: DARKED_BORDER_COLOR, borderWidth: 1, flexDirection: 'row', },
    textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})