import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR } from '../constants';
import { StackActions } from '@react-navigation/native';

export default function NormalHeader(props) {
    
    const navigation = useNavigation();
    const color = props.color? props.color : "#ffffff";
    
    return (
        
            <View style={styles.headerContainer}>
                <View style={styles.leftItems}>

                <TouchableOpacity  onPress={()=>{
                    if(navigation.canGoBack())
                    navigation.goBack()
                    else
                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }}>
                  <Ionicons name="arrow-back" size={30} color={color} style={{marginTop:10}}/>
                </TouchableOpacity>
                </View>

                <View style={styles.rightItems}>
                    <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace( 'Search', {}))} style={{ marginRight: 10, marginLeft: 7 }}>
                        {/* <FontAwesome5 name="search" size={20} color={color} /> */}
                    </TouchableOpacity>
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5,position:'absolute',top:40,zIndex:1000,width:"100%" },
    leftItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
    rightItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },

});