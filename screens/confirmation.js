import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, SECRET_KEY, SLIDER_PAGINATION_SELECTED_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import NormalHeader from './normalHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { stringMd5 } from 'react-native-quick-md5';

export default function Confirmation({navigation}) {
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
    const makepayment = async () => {
        var session = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        var actual_price = await AsyncStorage.getItem('actual_price');
        var payable_currency = await AsyncStorage.getItem('payable_currency');
        var payable_category = await AsyncStorage.getItem('payable_category');
        var payable_catalog_id = await AsyncStorage.getItem('payable_catalog_id');
        var payable_category_id = await AsyncStorage.getItem('payable_category_id');
        var payable_plan_id = await AsyncStorage.getItem('payable_plan_id');
        var payable_description = await AsyncStorage.getItem('payable_description');
        var payable_upgrade = await AsyncStorage.getItem('payable_upgrade');
        var mobile_number = await AsyncStorage.getItem('mobile_number');
        var ext_account_email_id = await AsyncStorage.getItem('ext_account_email_id');
        if(ext_account_email_id=="" || ext_account_email_id==null)
        {
            var user_email_id = await AsyncStorage.getItem('user_email_id');
            if(user_email_id=="" || user_email_id==null)
            var email =''
            else
            var email =user_email_id
        }
        else
        {
            var email = await AsyncStorage.getItem('ext_user_id');;
        }
        if(payable_upgrade=='no')
        var palnupgrade=false;
        else
        var palnupgrade=true;
        var hashcalculated = stringMd5(SECRET_KEY+session+region+payable_plan_id);
        axios.post(FIRETV_BASE_URL_STAGING + 'users/' + session + '/transactions', {
            auth_token: VIDEO_AUTH_TOKEN,
            access_token: ACCESS_TOKEN,
            auto_renew: false,
            us: hashcalculated,
            region: region,
            payment_gateway: "billdesk",
            platform: "android",
            payment_info: {net_amount:amount,price_charged:amount,currency:payable_currency,packs:[{plan_type:"",category:payable_category,subscription_catalog_id:payable_catalog_id,category_pack_id:payable_category_id,plan_id:payable_plan_id}]},
            transaction_info:{app_txn_id:1,txn_message:payable_description,txn_status:'init',order_id:"",pg_transaction_id:""},
            upgrade_plan:palnupgrade,
            user_info:{email: email,mobile_number:mobile_number},
            miscellaneous:{browser:"chrome",device_brand:"unknown",device_IMEI: "NA",device_model: "NA",device_OS: Platform.OS,device_type: 'Android Mobile',inet: "NA",isp: "NA",operator: "NA"}
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(resp => { 

            console.log(resp.data.data);
            navigation.navigate('Webview',{uri:resp.data.data.payment_url+"?msg="+resp.data.data.msg})

        }).catch(error => {
            console.log(error.response.data);
         })
    }
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

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <TouchableOpacity onPress={makepayment} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Make Payment</Text></TouchableOpacity>
            </View>

        </View>
    )
}