import { StyleSheet, StatusBar, View, Text, Dimensions, DevSettings } from 'react-native'
import React, { useRef, useState } from 'react'
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT, PAGE_WIDTH, } from '../constants'
import NormalHeader from './normalHeader';
import WebView from 'react-native-webview';
import { StackActions } from '@react-navigation/native';

export default function HtmlWebview({ navigation, route }) {
    var sessionid = route.params.sessionid;
    var description = route.params.description;
    var transactionid = route.params.transactionid;
    var referenceid = route.params.referenceid;
    var name = route.params.name;
    var line1 = route.params.line1;
    var line2 = route.params.line2;
    const ref = useRef(null);
    return (
        <View style={styles.mainContainer}>
            <NormalHeader></NormalHeader>
                <WebView ref={ref} source={{html:`<html> <head> <script src='https://hdfcbank.gateway.mastercard.com/static/checkout/checkout.min.js' data-error='errorCallback' data-cancel='cancelCallback'> </script> <script type='text/javascript'> function errorCallback(error) { console.log(JSON.stringify(error));} function cancelCallback() { console.log('Payment cancelled:4809'); } Checkout.configure({ session: { id:  '${sessionid}' }, order: { description: '${description}', id: '${transactionid}', reference:'${referenceid}' }, interaction: { merchant: { name: '${name}', address: { line1: '${line1}', line2: '${line2}' } } } }); Checkout.showPaymentPage(); setTimeout(function(){location='https://hdfcbank.gateway.mastercard.com/checkout/pay/${sessionid}?checkoutVersion=1.0.0'},6000)</script> </head> </html>`}} scalesPageToFit
                    originWhitelist={["*"]} style={{ flex: 1, width: PAGE_WIDTH, height: PAGE_HEIGHT + 50, backgroundColor: NORMAL_TEXT_COLOR, marginBottom: 50,marginTop:45 }} onNavigationStateChange={(resp) => {
                        if (resp.url.startsWith('tel:')) {
                            const phoneNumber = resp.url.substring(4);
                            Linking.openURL(`tel:${phoneNumber}`);
                            navigation.goBack();
                          }
                          if (resp.url.startsWith('mailto:')) {
                              const email = resp.url.substring(7);
                              Linking.openURL(`mailto:${email}`);
                              navigation.goBack();
                            }

                            
                        if (resp.url.includes("/paymentstatus")) {
                            var splitted = resp.url.split("|");
                            if (splitted[14] == '0300') {
                                alert("Transaction Successfull.")
                            }
                            else {
                                alert("Something went wrong. Please try again later.")
                            }
                            //DevSettings.reload();
                            navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' }))
                        }

                    }} />
               
               <StatusBar
                animated
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
    item: { padding: 15, borderBottomColor: DARKED_BORDER_COLOR, borderWidth: 1, flexDirection: 'row', },
    textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})