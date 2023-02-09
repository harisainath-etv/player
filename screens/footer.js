import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PAGE_WIDTH, BACKGROUND_COLOR, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_SELECTED_COLOR } from '../constants'
import ChromeCast from './chromecast';

export default function Footer(props) {
    const pageName = props.pageName;
    return (
        <View>
            <View style={styles.footerContainer}>

                {pageName == 'Home' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="home" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>HOME</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="home" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>HOME</Text>
                    </View>

                }

                {pageName == 'TV-CHANNELS' ?
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="television-classic" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>TV CHANNELS</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="television-classic" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>TV CHANNELS</Text>
                    </View>
                }

                {pageName == 'NEWS' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>NEWS</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>NEWS</Text>
                    </View>
                }
                {pageName == 'OFFLINE' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="download" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>OFFLINE</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="download" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>OFFLINE</Text>
                    </View>
                }
                {pageName == 'WATCH-LATER' ?

                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="sticker-plus" size={28} color={SLIDER_PAGINATION_SELECTED_COLOR} />
                        <Text style={[styles.footerText, { color: SLIDER_PAGINATION_SELECTED_COLOR }]}>WATCH LATER</Text>
                    </View>
                    :
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="sticker-plus" size={28} color={NORMAL_TEXT_COLOR} />
                        <Text style={styles.footerText}>WATCH LATER</Text>
                    </View>
                }

            </View>
            <View style={styles.chromeCast}>
                <ChromeCast></ChromeCast>
                {/* <FontAwesome5 name="chromecast" size={25} color="white" /> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footerText: { color: NORMAL_TEXT_COLOR, fontSize: 12 },
    footerContainer: { width: PAGE_WIDTH, backgroundColor: BACKGROUND_COLOR, height: 50, borderTopLeftRadius: 15, borderTopRightRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", paddingLeft: 10, paddingRight: 10 },
    iconContainer: { justifyContent: 'center', alignItems: 'center' },
    chromeCast: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: BACKGROUND_COLOR,
        position: 'absolute',
        bottom: 50,
        right: 10,
        borderColor: IMAGE_BORDER_COLOR,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
})