import React, { useEffect, } from 'react'
import { StackActions } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { BACKGROUND_COLOR, NORMAL_TEXT_COLOR } from '../constants';

export default function Reload({navigation,route}){
    const {routename} = route.params;
    useEffect(()=>{
        setTimeout(function (){
            console.log(routename);
           navigation.dispatch(StackActions.replace(routename))
        },2000)
    })

    return(
        <View style={{flex:1,backgroundColor:BACKGROUND_COLOR,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator color={NORMAL_TEXT_COLOR} size='small'></ActivityIndicator>
        </View>
    )
}