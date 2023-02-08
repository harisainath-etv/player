import * as React from 'react';
import { useState, } from 'react';
import { View, TouchableOpacity, Image,StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { NORMAL_TEXT_COLOR,PAGE_WIDTH,PAGE_HEIGHT } from '../constants';

export default function Header() {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <View style={{}}>
            {/* Drawer Navigation Modal */}
            <Modal
                isVisible={isModalVisible}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackdropPress={toggleModal}
            >
                <View style={styles.drawerContainer}>

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
                    <TouchableOpacity onPress={() => navigation.navigate('Subscribe')} >
                        <Image source={require('../assets/images/subscribe.png')} style={styles.subscribeImage}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{ marginRight: 10, marginLeft: 7 }}>
                        <FontAwesome5 name="search" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    drawerContainer:{ flex: 1, backgroundColor: '#ffffff', height: PAGE_HEIGHT, width: (PAGE_WIDTH / 1.5), left: -20, position: 'absolute' },
    headerContainer:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: 5 },
    leftItems:{ width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', },
    rightItems:{ width: '50%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', },
    logoImage:{ width: 90, height: 50, resizeMode: 'contain', marginLeft: 5 },
    subscribeImage:{ width: 100, height: 50, resizeMode: 'contain', }
});