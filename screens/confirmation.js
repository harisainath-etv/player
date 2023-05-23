import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR, TAB_COLOR } from '../constants'
import NormalHeader from './normalHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Confirmation() {
    const [amount, setAmount] = useState();
    const [currency, setcurrency] = useState();
    const [planname, setplanname] = useState();
    const [planduration, setplanduration] = useState();
    const loadData = async () => {
        setAmount(await AsyncStorage.getItem('payable_amount'));
        setcurrency(await AsyncStorage.getItem('payable_currency_symbol'));
        setplanname(await AsyncStorage.getItem('payable_selected_name'));
        setplanduration(await AsyncStorage.getItem('payable_selected_duration'));
    }
    useEffect(() => {
        loadData()
    })
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            <NormalHeader></NormalHeader>
            <View style={{ padding: 20 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 30, marginBottom: 30 }}>Confirm</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 20 }}>{planname}  / <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>{planduration}</Text></Text>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>{currency} {amount}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 100 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Total Amount Payable</Text>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>{currency} {amount}</Text>
                </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop:50}}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Make Payment</Text></TouchableOpacity>
            </View>

        </View>
    )
}