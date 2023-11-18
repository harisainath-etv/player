import { View, Text, TouchableOpacity, Platform, TextInput, Image, Pressable,StyleSheet,StatusBar } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ACCESS_TOKEN, BACKGROUND_COLOR, BACKGROUND_TRANSPARENT_COLOR, BUTTON_COLOR, DARKED_BORDER_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, FOOTER_DEFAULT_TEXT_COLOR, NORMAL_TEXT_COLOR, SECRET_KEY, SLIDER_PAGINATION_SELECTED_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import NormalHeader from './normalHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { stringMd5 } from 'react-native-quick-md5';
import { StackActions } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Confirmation({ navigation }) {
    const [amount, setAmount] = useState();
    const [chargedamount, setchargedamount] = useState();
    const [currency, setcurrency] = useState();
    const [planname, setplanname] = useState();
    const [planduration, setplanduration] = useState();
    const [coupon, setcoupon] = useState("");
    const [discountmessage, setdiscountmessage] = useState("");
    const [usersubscribed, setusersubscribed] = useState();
    const [paymentgateway, setpaymentgateway] = useState('billdesk');
    const [region, setregion] = useState('IN');
    const dataFetchedRef = useRef(null);
    const loadData = async () => {
        setAmount(await AsyncStorage.getItem('payable_amount'));
        setcurrency(await AsyncStorage.getItem('payable_currency_symbol'));
        setplanname(await AsyncStorage.getItem('payable_selected_name'));
        setplanduration(await AsyncStorage.getItem('payable_selected_duration'));
        setusersubscribed(await AsyncStorage.getItem('payable_coupon_display'));
        setregion(await AsyncStorage.getItem('country_code'));
        const payment_gateway = await AsyncStorage.getItem('payment_gateway');
        if (payment_gateway) {
            setpaymentgateway(payment_gateway);
        }
    }
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
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
        const brand = await DeviceInfo.getManufacturer();
        const model = await DeviceInfo.getModel();
        const network = await DeviceInfo.getCarrier();
        if (ext_account_email_id == "" || ext_account_email_id == null) {
            var user_email_id = await AsyncStorage.getItem('user_email_id');
            if (user_email_id == "" || user_email_id == null)
                var email = ''
            else
                var email = user_email_id
        }
        else {
            var email = await AsyncStorage.getItem('ext_user_id');;
        }
        if (payable_upgrade == 'no')
            var palnupgrade = false;
        else
            var palnupgrade = true;
        var hashcalculated = stringMd5(SECRET_KEY + session + region + payable_plan_id);

        if (coupon != "")
            var paymentinfoobj = { coupon_code: coupon, net_amount: amount, price_charged: chargedamount.toString(), currency: payable_currency, packs: [{ plan_type: "", category: payable_category, subscription_catalog_id: payable_catalog_id, category_pack_id: payable_category_id, plan_id: payable_plan_id }] };
        else
            var paymentinfoobj = { net_amount: amount, price_charged: amount, currency: payable_currency, packs: [{ plan_type: "", category: payable_category, subscription_catalog_id: payable_catalog_id, category_pack_id: payable_category_id, plan_id: payable_plan_id }] };
        const renew = await AsyncStorage.getItem('renew');
        if (region == 'IN') {
            if (paymentgateway == 'billdesk') {
                axios.post(FIRETV_BASE_URL_STAGING + 'users/' + session + '/transactions', {
                    auth_token: VIDEO_AUTH_TOKEN,
                    access_token: ACCESS_TOKEN,
                    auto_renew: false,
                    us: hashcalculated,
                    region: region,
                    payment_gateway: "billdesk",
                    platform: "android",
                    payment_info: paymentinfoobj,
                    transaction_info: { app_txn_id: 1, txn_message: payable_description, txn_status: 'init', order_id: "", pg_transaction_id: "" },
                    upgrade_plan: palnupgrade,
                    user_info: { email: email, mobile_number: mobile_number },
                    miscellaneous: { browser: "chrome", device_brand: brand, device_IMEI: "NA", device_model: model, device_OS: Platform.OS, device_type: 'Android Mobile', inet: "NA", isp: "NA", operator: network },
                    renew_plan:renew
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(resp => {
                    if (resp.data.data.code != "1070")
                        navigation.navigate('Webview', { uri: resp.data.data.payment_url + "?msg=" + resp.data.data.msg })
                    else {
                        alert(resp.data.data.message);
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }

                }).catch(error => {
                    console.log(error.response.data);
                })
            }
            else if (paymentgateway == 'ccavenue') {
                axios.post(FIRETV_BASE_URL_STAGING + 'users/' + session + '/transactions', {
                    auth_token: VIDEO_AUTH_TOKEN,
                    access_token: ACCESS_TOKEN,
                    auto_renew: false,
                    us: hashcalculated,
                    region: region,
                    payment_gateway: "ccavenue",
                    platform: "android",
                    payment_info: paymentinfoobj,
                    transaction_info: { app_txn_id: 1, txn_message: payable_description, txn_status: 'init', order_id: "", pg_transaction_id: "" },
                    upgrade_plan: palnupgrade,
                    user_info: { email: email, mobile_number: mobile_number },
                    miscellaneous: { browser: "chrome", device_brand: brand, device_IMEI: "NA", device_model: model, device_OS: Platform.OS, device_type: 'Android Mobile', inet: "NA", isp: "NA", operator: network },
                    renew_plan:renew
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(resp => {
                    if (resp.data.data.code != "1070") {
                        navigation.navigate('Webview', { uri: resp.data.data.payment_url + "&encRequest=" + resp.data.data.msg + "&access_code=" + resp.data.data.access_code })
                    }
                    else {
                        alert(resp.data.data.message);
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }

                }).catch(error => {
                    console.log(error.response.data);
                })
            }
        }
        else {
            axios.post(FIRETV_BASE_URL_STAGING + 'users/' + session + '/transactions', {
                auth_token: VIDEO_AUTH_TOKEN,
                access_token: ACCESS_TOKEN,
                auto_renew: false,
                us: hashcalculated,
                region: region,
                payment_gateway: "mpgs",
                platform: "android",
                payment_info: paymentinfoobj,
                transaction_info: { app_txn_id: 1, txn_message: payable_description, txn_status: 'init', order_id: "", pg_transaction_id: "" },
                upgrade_plan: palnupgrade,
                user_info: { email: email, mobile_number: mobile_number },
                miscellaneous: { browser: "chrome", device_brand: brand, device_IMEI: "NA", device_model: model, device_OS: Platform.OS, device_type: 'Android Mobile', inet: "NA", isp: "NA", operator: network },
                renew_plan:renew
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(resp => {
                if (resp.data.data.code == "200") {
                    console.log(resp.data.data.mpgs.session_id);
                    navigation.navigate('HtmlWebview', { sessionid: resp.data.data.mpgs.session_id, description: resp.data.data.mpgs.description, transactionid: resp.data.data.transaction_id, referenceid: resp.data.data.mpgs.reference_id, name: resp.data.data.mpgs.name, line1: resp.data.data.mpgs.address1, line2: resp.data.data.mpgs.address1 })
                }
                else {
                    alert(resp.data.data.message);
                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                }

            }).catch(error => {
                console.log(error.response.data);
            })
        }
    }

    const applycoupon = async () => {
        var session = await AsyncStorage.getItem('session');
        var payable_category_id = await AsyncStorage.getItem('payable_category_id');
        var payable_plan_id = await AsyncStorage.getItem('payable_plan_id');
        var region = await AsyncStorage.getItem('country_code');
        var hashcalculated = stringMd5(SECRET_KEY + session + region + payable_plan_id);

        axios.post(FIRETV_BASE_URL_STAGING + "users/" + session + "/apply_coupon_code",
            {
                access_token: ACCESS_TOKEN,
                auth_token: VIDEO_AUTH_TOKEN,
                category_pack_id: payable_category_id,
                coupon_code: coupon,
                plan_id: payable_plan_id,
                region: region,
                us: hashcalculated
            }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            //console.log(response.data.data.payment);
            setchargedamount(response.data.data.payment.net_amount);
            setdiscountmessage("Promo Code Applied. You will get " + currency + " " + (amount - response.data.data.payment.net_amount) + " discount");
        }).catch(error => {
            setdiscountmessage(error.response.data.error.message)
        })
    } 

    function renderProcessSection(val) {
        const styles = StyleSheet.create({
            container: {
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
            },
            number: {
                color: "white",
                fontSize: 14,
            },
            horizontalLine: {
                width: 35,
                height: 1,
                backgroundColor: NORMAL_TEXT_COLOR,
                marginTop: -10,
                alignItems: "center",
                justifyContent: "center",
            },
        });
        return (
            <View
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    padding: 10,
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    {val == 1 ?
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={TAB_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: TAB_COLOR, fontWeight: '500' }}>Package</Text>
                        </>
                        :
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={NORMAL_TEXT_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: NORMAL_TEXT_COLOR, fontWeight: '500' }}>Package</Text>
                        </>
                    }

                </View>
                <View style={styles.container}>
                    <View style={styles.horizontalLine} />
                </View>
                <View
                    style={{
                        alignItems: "center",
                    }}
                >

                    {val == 2 ?
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={TAB_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: TAB_COLOR, fontWeight: '500' }}>Plan</Text>
                        </>
                        :
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={NORMAL_TEXT_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: NORMAL_TEXT_COLOR, fontWeight: '500' }}>Plan</Text>
                        </>
                    }


                </View>
                <View style={styles.container}>
                    <View style={styles.horizontalLine} />
                </View>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >


                    {val == 3 ?
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={TAB_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: TAB_COLOR, fontWeight: '500' }}>Payment</Text>
                        </>
                        :
                        <>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={NORMAL_TEXT_COLOR}
                            />
                            <Text style={{ fontSize: 12, paddingTop: 6, color: NORMAL_TEXT_COLOR, fontWeight: '500' }}>Payment</Text>
                        </>
                    }


                </View>
            </View>
        );
    }

    async function paymentGatewayAvailable(name) {
        const arr = await AsyncStorage.getItem('availableGateways');
        
        const data = JSON.parse(arr);
        const { length } = data;
        const id = length + 1;
        const found = data.some(el => el.name === name);
        if (found) 
        return true
        else
        return false;
      }

    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>

            <TouchableOpacity onPress={() => {
                    if (navigation.canGoBack())
                        navigation.goBack()
                    else
                        navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
            }}>
                <Ionicons name="arrow-back" size={30} color={NORMAL_TEXT_COLOR} style={{ marginTop: 60,marginLeft:10 }} />
            </TouchableOpacity>
            {renderProcessSection(3)}
            <View style={{ paddingLeft: 35,paddingRight:35, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: SLIDER_PAGINATION_SELECTED_COLOR, fontSize: 15 }}>{planname}  / <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 14 }}>{planduration}</Text></Text>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>{currency} {amount}</Text>
                </View>
                {usersubscribed == 'yes' ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, }}>
                        <View style={{marginRight:15,width:"75%"}}>
                        <TextInput
                            placeholder='Enter Coupon Code'
                            placeholderTextColor={DETAILS_TEXT_COLOR}
                            style={{ width: '100%',color: NORMAL_TEXT_COLOR,backgroundColor:DARKED_BORDER_COLOR,borderColor:FOOTER_DEFAULT_TEXT_COLOR,borderWidth:0.5,padding:8,borderRadius:8 }}
                            onChangeText={setcoupon}
                            value={coupon}
                        />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'flex-end', width:"25%", }}>
                            <TouchableOpacity onPress={() => applycoupon()}>

                                <LinearGradient
                                    useAngle={true}
                                    angle={125}
                                    angleCenter={{ x: 0.5, y: 0.5 }}
                                    colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR,  paddingLeft: 15,paddingRight: 15,paddingTop:10,paddingBottom:10,width:"100%", borderRadius: 10, }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13, fontWeight: 'bold' }}>Apply</Text>
                                    </View>
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>

                    </View>
                    :
                    ""}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#00FF00' }}>{discountmessage}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 15,fontWeight:'600' }}>Total Amount Payable</Text>
                    {(chargedamount != "" && chargedamount != null) || (chargedamount == "0") ?
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>{currency} {chargedamount}</Text>
                        :
                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>{currency} {amount}</Text>
                    }
                </View>

                {region == 'IN' ?
                    paymentgateway == 'billdesk' ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                            {paymentGatewayAvailable('billdesk') ?
                            <Pressable onPress={() => setpaymentgateway('billdesk')} style={{ width: "45%" }}>
                                <Image source={require('../assets/billdesk-tick.png')} style={{ width: '100%', height: 50 }} />
                            </Pressable>
                            :""}
                            {paymentGatewayAvailable('ccavenue') ?
                            <Pressable onPress={() => setpaymentgateway('ccavenue')} style={{ width: "45%" }}>
                                <Image source={require('../assets/ccavenue-untick.png')} style={{ width: '100%', height: 50 }} />
                            </Pressable>
                            :""}
                        </View>
                        :
                        paymentgateway == 'ccavenue' ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                {paymentGatewayAvailable('billdesk') ?
                                <Pressable onPress={() => setpaymentgateway('billdesk')} style={{ width: "45%" }}>
                                    <Image source={require('../assets/billdesk-untick.png')} style={{ width: '100%', height: 50 }} />
                                </Pressable>
                                 :""}
                                 {paymentGatewayAvailable('ccavenue') ?
                                <Pressable onPress={() => setpaymentgateway('ccavenue')} style={{ width: "45%" }}>
                                    <Image source={require('../assets/ccavenue-tick.png')} style={{ width: '100%', height: 50 }} />
                                </Pressable>
                                :""}
                            </View>
                            :
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                {paymentGatewayAvailable('billdesk') ?
                                <Pressable onPress={() => setpaymentgateway('billdesk')} style={{ width: "45%" }}>
                                    <Image source={require('../assets/billdesk-tick.png')} style={{ width: '100%', height: 50 }} />
                                </Pressable>
                                :""}
                                {paymentGatewayAvailable('ccavenue') ?
                                <Pressable onPress={() => setpaymentgateway('ccavenue')} style={{ width: "45%" }}>
                                    <Image source={require('../assets/ccavenue-untick.png')} style={{ width: '100%', height: 50 }} />
                                </Pressable>
                                :""}
                            </View>
                    :
                    ""
                }

            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <TouchableOpacity onPress={makepayment} >

                    <LinearGradient
                        useAngle={true}
                        angle={125}
                        angleCenter={{ x: 0.5, y: 0.5 }}
                        colors={[BUTTON_COLOR, TAB_COLOR, TAB_COLOR,TAB_COLOR, BUTTON_COLOR]}
                        style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 10, borderRadius: 20, marginRight: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 13, fontWeight: 'bold' }}>Make Payment</Text>
                        </View>
                    </LinearGradient>

                </TouchableOpacity>
            </View>
            <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </View>
    )
}