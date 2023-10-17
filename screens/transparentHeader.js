import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR } from '../constants';
import { StackActions } from '@react-navigation/native';

export default function TransparentHeader() {
    
    const navigation = useNavigation();
    
    return (
        
            <View style={styles.headerContainer}>
                <View style={styles.leftItems}>

                <TouchableOpacity  onPress={()=>{
                    if(navigation.canGoBack())
                    navigation.goBack()
                    else
                    navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                    }}>
                  <Ionicons name="arrow-back" size={30} color="#ffffff" style={{marginTop:30}}/>
                </TouchableOpacity>
                </View>

                
            </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: 5,position:'absolute',zIndex:10000 },
    leftItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
    rightItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },

});