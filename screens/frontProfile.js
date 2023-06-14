import { View, Text, TextInput, StyleSheet, Pressable, ScrollView,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/native';
import { BACKGROUND_COLOR, DETAILS_TEXT_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, SLIDER_PAGINATION_SELECTED_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR } from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-date-picker';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
export default function FrontProfile({ navigation }) {
    const [open, setOpen] = useState(false)
    const [showslider, setshowslider] = useState(true)
    const [datofBirth, setdateofbirth] = useState(new Date())
    const [dob, setdob] = useState();
    const [gender, setgender] = useState();
    const [pincode, setpincode] = useState();
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [autoPlay, setAutoPlay] = useState(false);
    const [isVertical, setIsVertical] = useState(false);


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
    const [colors, setColors] = useState([
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
        SLIDER_PAGINATION_SELECTED_COLOR,
    ]);
    const progressValue = useSharedValue(0);
    const baseOptions = ({
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
    });
    // const PaginationItem = (props) => {
    //     const { animValue, index, length, backgroundColor, isRotate } = props;
    //     const width = 10;
    
    //     const animStyle = useAnimatedStyle(() => {
    //         let inputRange = [index - 1, index, index + 1];
    //         let outputRange = [-width, 0, width];
    
    //         if (index === 0 && animValue?.value > length - 1) {
    //             inputRange = [length - 1, length, length + 1];
    //             outputRange = [-width, 0, width];
    //         }
    
    //         return {
    //             transform: [
    //                 {
    //                     translateX: interpolate(
    //                         animValue?.value,
    //                         inputRange,
    //                         outputRange,
    //                         Extrapolate.CLAMP
    //                     ),
    //                 },
    //             ],
    //         };
    //     }, [animValue, index, length]);
    //     return (
    //         <View
    //             style={{
    //                 backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
    //                 width,
    //                 height: width,
    //                 borderRadius: 50,
    //                 overflow: 'hidden',
    //                 transform: [
    //                     {
    //                         rotateZ: isRotate ? '90deg' : '0deg',
    //                     },
    //                 ],
    //             }}
    //         >
    //             <Animated.View
    //                 style={[
    //                     {
    //                         borderRadius: 50,
    //                         backgroundColor,
    //                         flex: 1,
    //                     },
    //                     animStyle,
    //                 ]}
    //             />
    //         </View>
    //     );
    // };
    const [data, setData] = useState([...new Array(5).keys()]);
    return (
        <View style={{ backgroundColor: BACKGROUND_COLOR, flex: 1 }}>
            {showslider ?

                <View>
                    <Carousel
                        {...baseOptions}
                        loop
                        pagingEnabled={pagingEnabled}
                        snapEnabled={snapEnabled}
                        autoPlay={autoPlay}
                        autoPlayInterval={2000}
                        onProgressChange={(_, absoluteProgress) =>
                            (progressValue.value = absoluteProgress)
                        }
                        mode="parallax"
                        windowSize={3}
                        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
                        modeConfig={{
                            parallaxScrollingScale: 1.1,
                            parallaxAdjacentItemScale: 1,
                        }}
                        data={data}
                        style={{ top: -15, }}
                        renderItem={({ item, index }) => 
                        <View>
                        {index==0 ? <Image key={index} style={styles.image} source={require("../assets/images/slide0.jpg")} resizeMode='contain'/> : ""}
                        {index==1 ? <Image key={index} style={styles.image} source={require("../assets/images/slide1.jpg")} resizeMode='contain'/> : ""}
                        {index==2 ? <Image key={index} style={styles.image} source={require("../assets/images/slide2.jpg")} resizeMode='contain'/> : ""}
                        {index==3 ? <Image key={index} style={styles.image} source={require("../assets/images/slide3.jpg")} resizeMode='contain'/> : ""}
                        {index==4 ? <Image key={index} style={styles.image} source={require("../assets/images/slide4.jpg")} resizeMode='contain'/> : ""}
                        </View>
                    }
                    />
                    <View style={{position:'absolute',zIndex:10000,bottom:70,width:'100%'}}>
                        <Pressable style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{setshowslider(false)}}><Text style={{color:SLIDER_PAGINATION_SELECTED_COLOR,fontSize:18,fontWeight:'bold'}}>Skip</Text></Pressable>
                    </View>
                    {/* <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: 200,
                            alignSelf: 'center',
                            top: -10,
                        }}
                    >
                        {colors.map((backgroundColor, index) => {
                            return (
                                <PaginationItem
                                    backgroundColor={backgroundColor}
                                    animValue={progressValue}
                                    index={index}
                                    key={index}
                                    isRotate={isVertical}
                                    length={colors.length}
                                />
                            );
                        })}
                    </View> */}
                </View>

                :
                <View style={{marginTop:40}}>
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
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    gender: { borderColor: DETAILS_TEXT_COLOR, borderRadius: 5, borderWidth: 1, padding: 5, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    genderSelected: { borderColor: SLIDER_PAGINATION_SELECTED_COLOR, borderRadius: 5, borderWidth: 1, padding: 5, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    image: {
        width:PAGE_WIDTH,
        height: PAGE_HEIGHT
    },
})