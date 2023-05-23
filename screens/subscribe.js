import { View, Text, FlatList, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import NormalHeader from './normalHeader';
import { ACCESS_TOKEN, BACKGROUND_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Subscribe({navigation}) {
    const [subscribeplans, setsubscribeplans] = useState([]);
    const dataFetchedRef = useRef(false);
    const [selectedplan, setSelectedPlan] = useState('premium_plan');
    const [selectedplandetails, setselectedplandetails] = useState([]);
    const [selectedprice, setselectedprice] = useState();
    const [packdetails, setpackdetails] = useState([]);
    const [selectedname, setselectedname] = useState("");
    const [selectedcategoryid, setselectedcategoryid] = useState("");
    const [selectedpriceforpayment, setselectedpriceforpayment] = useState("");
    const [selectedpriceforduration, setselectedpriceforduration] = useState("");
    const [selectedpricecurrency, setselectedpricecurrency] = useState("");
    const loadData = async () => {
        var items = [];
        AsyncStorage.setItem('selectedplan', selectedplan)
        const region = await AsyncStorage.getItem('country_code');
        axios.get(FIRETV_BASE_URL_STAGING + "catalogs/subscription/items.gzip?region=" + region + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN).then(resp => {
            for (var i = 0; i < resp.data.data.items.length; i++) {

                items.push({ "display_title": resp.data.data.items[i].display_title, "plan_id": resp.data.data.items[i].plan_id, "category_id": resp.data.data.items[i].category_id, "category": resp.data.data.items[i].category, "status": resp.data.data.items[i].status, "catalog_id": resp.data.data.items[i].catalog_id, "pack_details": resp.data.data.items[i].pack_details })
            }
            setsubscribeplans(items);
        }).catch(error => { })
    }
    async function loadpackdetails() {
        var plans = [];
        const region = await AsyncStorage.getItem('country_code');
        const selectedPlan = await AsyncStorage.getItem('selectedplan');
        axios.get(FIRETV_BASE_URL_STAGING + "catalogs/subscription/items.gzip?region=" + region + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN).then(resp => {
            for (var i = 0; i < resp.data.data.items.length; i++) {
                if (resp.data.data.items[i].plan_id == selectedPlan) {
                    setpackdetails(resp.data.data.items[i].pack_details);
                    setselectedname(resp.data.data.items[i].display_title)
                    setselectedcategoryid(resp.data.data.items[i].category_id);
                }
                for (var p = 0; p < resp.data.data.items[i].plans.length; p++) {
                    if (resp.data.data.items[i].plan_id == selectedPlan) {
                        plans.push({ "id": resp.data.data.items[i].plans[p].id, "title": resp.data.data.items[i].plans[p].title, "ext_plan_id": resp.data.data.items[i].plans[p].ext_plan_id, "region": resp.data.data.items[i].plans[p].region, "price": resp.data.data.items[i].plans[p].price, "currency": resp.data.data.items[i].plans[p].currency, "currency_symbol": resp.data.data.items[i].plans[p].currency_symbol, "currency_notation": resp.data.data.items[i].plans[p].currency_notation, "striked_price": resp.data.data.items[i].plans[p].striked_price, "duration": resp.data.data.items[i].plans[p].duration, "period": resp.data.data.items[i].plans[p].period, "display_period": resp.data.data.items[i].plans[p].display_period, "offer_description": resp.data.data.items[i].plans[p].offer_description, "apple_product_id": resp.data.data.items[i].plans[p].apple_product_id, "google_product_id": resp.data.data.items[i].plans[p].google_product_id, "renewable_type": resp.data.data.items[i].plans[p].renewable_type, "screen_limit": resp.data.data.items[i].plans[p].screen_limit, "pack_order": resp.data.data.items[i].plans[p].pack_order, "planlength": resp.data.data.items[i].plans.length })
                    }
                }
            }
            setselectedplandetails(plans);
        }).catch(error => { })

    }
    const rendersubscriptionplans = (item, index) => {
        return (
            <View key={index} style={{ width: '50%', height: '100%' }}>
                <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', width: '100%', height: 100, flexDirection: 'row' }}>
                    {selectedplan == item.item.plan_id && item.item.status == 'published' ?
                        <MaterialCommunityIcons name='radiobox-marked' color={NORMAL_TEXT_COLOR} size={30} />
                        :
                        <Pressable onPress={() => { setSelectedPlan(item.item.plan_id); setselectedprice(""); AsyncStorage.setItem('selectedplan', item.item.plan_id); loadpackdetails(); setselectedname(item.item.display_title);setselectedcategoryid(item.item.category_id) }}><MaterialCommunityIcons name='radiobox-blank' color={NORMAL_TEXT_COLOR} size={30} /></Pressable>
                    }
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>{item.item.display_title}</Text>
                </View>
            </View>
        )
    }
    const proceedtopay = async()=>{
        var session= await AsyncStorage.getItem('session');
        var region= await AsyncStorage.getItem('country_code');
        if(session=='' || session==null)
        {
            navigation.navigate('Login');
        }
        else
        {
            if(selectedprice!="" && selectedprice!=null)
            {
                axios.get(FIRETV_BASE_URL_STAGING+"users/"+session+"/user_plans/upgrade_plan?region="+region+"&auth_token="+VIDEO_AUTH_TOKEN+"&access_token="+ACCESS_TOKEN+"&sub_theme_id="+selectedcategoryid+"&to_plan="+selectedprice).then(resp=>{
                    AsyncStorage.setItem('payable_amount',resp.data.data.payable.payable_amount);
                    AsyncStorage.setItem('payable_currency_symbol',resp.data.data.payable.currency_symbol);
                    AsyncStorage.setItem('payable_selected_name',selectedname);
                    AsyncStorage.setItem('payable_selected_duration',selectedpriceforduration);
                    navigation.navigate("Confirmation");
                }).catch(error=>{})
            }
            else
            {
                alert("Please select a plan to proceed.")
            }
        }
    }
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadData();
        loadpackdetails();
    })
    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <NormalHeader></NormalHeader>
            <View style={{ padding: 20 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 20 }}>Subscription</Text>
                <View style={{ backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR, height: 100, borderRadius: 10, marginTop: 10, width: '100%' }}>
                    {subscribeplans ?
                        <FlatList
                            data={subscribeplans}
                            keyExtractor={(x, i) => i.toString()}
                            renderItem={rendersubscriptionplans}
                            numColumns={2}
                        />
                        : ""}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    {
                        selectedplandetails.map((resp) => {
                            return (
                                <View key={resp.id} style={{ paddingTop: 20, paddingBottom: 20, backgroundColor: TAB_COLOR, borderWidth: 1, borderStyle: 'dashed', borderColor: DETAILS_TEXT_COLOR, marginTop: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: (100 / resp.planlength) - 5 + "%", }}>
                                    {selectedprice == resp.id ?
                                        <MaterialCommunityIcons name='radiobox-marked' size={30} color={NORMAL_TEXT_COLOR} style={{ position: 'absolute', left: 0, top: 0 }} />
                                        :
                                        <Pressable style={{ position: 'absolute', left: 0, top: 0 }} onPress={() => { setselectedprice(resp.id); setselectedpriceforpayment(resp.price); setselectedpriceforduration(resp.display_period); setselectedpricecurrency(resp.currency_symbol); }}><MaterialCommunityIcons name='radiobox-blank' size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                                    }

                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, marginRight: 10, marginTop: 10 }}>{resp.currency_symbol} {resp.price}</Text>
                                        {resp.striked_price ?
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{resp.striked_price}</Text>
                                            :
                                            ""}
                                    </View>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }}>Per {resp.display_period}</Text>
                                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 12, }}>{resp.offer_description}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <View style={{
                        borderWidth: 1, borderColor: DETAILS_TEXT_COLOR, width: '100%'
                        , padding: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10
                    }}>
                        <Text style={{ color: NORMAL_TEXT_COLOR }}>Avalibale Features</Text>
                    </View>
                    <View style={{
                        borderWidth: 1, borderColor: DETAILS_TEXT_COLOR, width: '100%'
                        , padding: 15,
                    }}>

                        {
                            packdetails.map((resp) => {
                                return (
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ justifyContent: 'flex-start', width: '60%' }}>
                                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, }}>{resp.info}</Text>
                                        </View>
                                        <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18 }}>{resp.value}</Text>
                                    </View>
                                )
                            })
                        }


                    </View>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>HD, Full HD, 4K (2160p) Video Qualities are available only when content is supported in their respective resolutions</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {selectedpricecurrency ?
                        <View>
                            <Text style={{ color: DETAILS_TEXT_COLOR, fontSize: 20, }}>{selectedname}</Text>
                            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25 }}>{selectedpricecurrency} {selectedpriceforpayment} <Text style={{ fontSize: 15 }}>/ {selectedpriceforduration}</Text></Text>
                        </View>
                        :
                        <View></View>
                    }
                    <View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={proceedtopay} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Pay</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>


            </View>
        </ScrollView>
    )
}