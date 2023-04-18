import * as React from 'react';
import { useState, } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ImageBackground, Text, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { NORMAL_TEXT_COLOR, PAGE_WIDTH, PAGE_HEIGHT, SIDEBAR_BACKGROUND_COLOR, TAB_COLOR, MORE_LINK_COLOR, } from '../constants';

export default function Header(props) {
    const pageName = props.pageName;
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    var menuArray = [{ 'iconName': 'home', 'pageName': 'Home', 'text': 'Home', 'type': 1,'pageFriendlyId':'featured-1','navigateTo':'Home' },
    { 'iconName': 'television-classic', 'pageName': 'LIVE-TV', 'text': 'Live TV', 'type': 1,'pageFriendlyId':'live','navigateTo':'OtherResponse' },
    { 'iconName': 'bell-check', 'pageName': 'SUBSCRIPTION', 'text': 'Subscription', 'type': 1,'pageFriendlyId':'','navigateTo':'' },
    { 'iconName': 'more', 'pageName': 'MORE', 'text': 'More', 'type': 1,'pageFriendlyId':'','navigateTo':'' },
    { 'iconName': 'gear', 'pageName': 'Settings', 'text': 'Settings', 'type': 2,'pageFriendlyId':'','navigateTo':'' }]

    return (
        <View style={{}}>
            {/* Drawer Navigation Modal */}
            <Modal
                isVisible={isModalVisible}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackdropPress={toggleModal}
                backdropColor={"black"}
                backdropOpacity={0.40}
            >
                <View style={styles.drawerContainer}>
                    <View>
                        <ImageBackground
                            source={require('../assets/images/drawer_header.png')}
                            resizeMode="cover"
                            style={styles.drawerHeaderImage}>
                            <View style={{ padding: 25 }}>
                                <Text style={styles.drawerHeaderText}>Hi Guest User!</Text>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <TouchableOpacity onPress={()=>{toggleModal();navigation.navigate('Login', { });}} style={{ backgroundColor: TAB_COLOR, padding: 13, borderRadius: 10, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.drawerHeaderText}>SIGN IN</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{toggleModal();navigation.navigate('Signup', { });}} style={{ borderColor: TAB_COLOR, padding: 13, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.drawerHeaderText}>SIGN UP</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>

                        <View style={{ paddingLeft: 30, marginTop: 20 }}>
                            {menuArray.map((singleMenu) => {

                                return (
                                    <Pressable onPress={()=>navigation.dispatch(StackActions.replace(singleMenu.navigateTo,{pageFriendlyId:singleMenu.pageFriendlyId}))} style={styles.menuItem} key={singleMenu.pageName}>
                                        {singleMenu.type == 1 ? <MaterialCommunityIcons name={singleMenu.iconName}
                                            size={27}
                                            color={pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR}></MaterialCommunityIcons>
                                            :
                                            <FontAwesome name={singleMenu.iconName}
                                                size={27}
                                                color={pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR}></FontAwesome>}

                                        <Text style={{ color: pageName == singleMenu.pageName ? MORE_LINK_COLOR : NORMAL_TEXT_COLOR,marginLeft:15,width:"85%",fontSize:17 }}>{singleMenu.text}</Text>
                                    </Pressable>

                                )


                            })}


                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header bar*/}

            <View style={styles.headerContainer}>
                <View style={styles.leftItems}>

                    <TouchableOpacity onPress={toggleModal}>
                        <MaterialCommunityIcons
                            name='menu'
                            size={25}
                            color={NORMAL_TEXT_COLOR}
                        ></MaterialCommunityIcons>
                    </TouchableOpacity>
                    <Image source={require('../assets/images/logo.png')} style={styles.logoImage}></Image>
                </View>

                <View style={styles.rightItems}>
                    <TouchableOpacity onPress={() => navigation.navigate('Subscribe', {})} >
                        <Image source={require('../assets/images/subscribe.png')} style={styles.subscribeImage}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Search', {})} style={{ marginRight: 10, marginLeft: 7 }}>
                        <FontAwesome5 name="search" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, },
    drawerHeaderText: { color: NORMAL_TEXT_COLOR, fontSize: 16, fontWeight: 'bold' },
    drawerHeaderImage: { width: "100%", height: 170 },
    drawerContainer: { flex: 1, backgroundColor: SIDEBAR_BACKGROUND_COLOR, height: PAGE_HEIGHT, width: (PAGE_WIDTH / 1.3), left: -20, position: 'absolute' },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: 5 },
    leftItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
    rightItems: { width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },
    logoImage: { width: 90, height: 50, resizeMode: 'contain', marginLeft: 5 },
    subscribeImage: { width: 100, height: 50, resizeMode: 'contain', }
});