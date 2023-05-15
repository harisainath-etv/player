import { View, ScrollView, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR } from '../constants'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import NormalHeader from './normalHeader';
import Footer from './footer';
import { StackActions } from '@react-navigation/native';

export default function Calendarscreen({ navigation, route }) {
    var { episodeUrl } = route.params;
    const [fromDate, setfromDate] = useState();
    const [toDate, settoDate] = useState();
    const [counter, setCounter] = useState(0);

    const setDates = (day) => {
        { counter == 0 ? setfromDate(day.dateString) : settoDate(day.dateString) }
        { counter == 0 ? setCounter(1) : setCounter(0) }
    }
    const searchCalendar = async () =>{
        if(fromDate=="" || fromDate== null || toDate=="" || toDate== null)
        {
            alert("Please select from and to date");
        }
        else
        navigation.dispatch(StackActions.replace('SearchCalendarEpisodes',{episodeUrl:episodeUrl,fromDate:fromDate,toDate:toDate}))
    }
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <NormalHeader></NormalHeader>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: 50 }}>
                    <TextInput onChangeText={setfromDate} editable={false} value={fromDate} style={[styles.textinput, { color: counter == 0 ? TAB_COLOR : NORMAL_TEXT_COLOR }]} placeholder="From Date" placeholderTextColor={
                        counter == 0 ? TAB_COLOR : NORMAL_TEXT_COLOR
                    } />
                    <TextInput onChangeText={settoDate} editable={false} value={toDate} style={[styles.textinput, { color: counter == 1 ? TAB_COLOR : NORMAL_TEXT_COLOR }]} placeholder="To Date" placeholderTextColor={
                        counter == 1 ? TAB_COLOR : NORMAL_TEXT_COLOR
                    } />
                </View>

                <Calendar
                    markingType={'period'}
                    onDayPress={day => {
                    }}
                    maxDate={new Date().toLocaleString()}
                    hideExtraDays={true}
                    disableAllTouchEventsForDisabledDays={true}
                    enableSwipeMonths={true}
                    style={{ backgroundColor: BACKGROUND_COLOR, color: NORMAL_TEXT_COLOR, }}
                    theme={{
                        backgroundColor: BACKGROUND_COLOR,
                        calendarBackground: BACKGROUND_COLOR,
                        textSectionTitleColor: NORMAL_TEXT_COLOR,
                        todayTextColor: TAB_COLOR,
                        monthTextColor: NORMAL_TEXT_COLOR
                    }}
                    dayComponent={({ date, state }) => {
                        return (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        { state === 'disabled' ? "" : setDates(date) }
                                    }}>
                                    <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : NORMAL_TEXT_COLOR, fontSize: 25 }}>{date.day}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}

                />
                <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:15 }}>
                    <TouchableOpacity onPress={searchCalendar} style={{ backgroundColor: TAB_COLOR,paddingTop:10,paddingBottom:10,paddingLeft:18,paddingRight:18,borderRadius:15 }}><Text style={{color:NORMAL_TEXT_COLOR,fontWeight:'bold'}}>Apply</Text></TouchableOpacity>
                </View>
            </ScrollView>
            <Footer></Footer>
        </View>
    )
}


const styles = StyleSheet.create({
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 10, width: '50%' },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, marginTop: 50, width: 150, padding: 10, borderRadius: 20 },
});