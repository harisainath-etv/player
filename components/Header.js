import React, {useState} from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
  TextInput,
} from 'react-native';
import propstype from 'prop-types';
import normalize from  '../Utils/Helpers/Dimen';
import {useNavigation} from '@react-navigation/native';

export default function HeaderFull(props) {
  const navigation = useNavigation();

  return (
    <>
      <View
        style={
          Platform.OS === 'ios'
            ? {
                // width:'100%',
                // backgroundColor:'red',
                flexDirection: 'row',
                paddingTop:
                  Dimensions.get('screen').height > 667
                    ? normalize(20)
                    : normalize(30),
                justifyContent: props.justifyContent
                  ? props.justifyContent
                  : 'space-between',
                paddingHorizontal: normalize(20),
                alignItems: 'center',
              }
            : {
                flexDirection: 'row',
                paddingTop:
                  Dimensions.get('screen').height > 667
                    ? normalize(20)
                    : normalize(10),
                padding: normalize(20),
                marginTop: normalize(15),
                alignItems: 'center',
                justifyContent: props.justifyContent
                  ? props.justifyContent
                  : 'space-between',
              }
        }>
        <View
          style={{
            flexDirection: 'row',
            width: props.topWidth ? props.topWidth : '70%',
            alignItems: 'center',
            right:normalize(10)
            // backgroundColor:'red'
          }}>
          <TouchableOpacity
            onPress={() => props.onPress()}
            style={{
              height: props.height ? props.height : normalize(30),
              width: props.width ? props.width : normalize(30),
              backgroundColor: props.backgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor:'red'
            }}>
            <Image
              source={props.topImg}
              style={{
                paddingLeft: props.paddingLeft,
                height: props.iheight,
                width: props.iwidth,
                position: props.position,
                resizeMode: 'contain',
                tintColor: props.tintColor,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

HeaderFull.propstype = {
  height: propstype.number,
  backgroundColor: propstype.string,
  paddingLeft: propstype.number,
  iheight: propstype.number,
  iwidth: propstype.number,
  tintColor: propstype.string,
  position: propstype.number,
  leftText: propstype.bool,
  lText: propstype.string,
  rText: propstype.string,
  topImg: propstype.string,
  onPressRight: propstype.func,
  fontFamily: propstype.string,
  fontSize: propstype.number,
  topWidth: propstype.any,
  search: propstype.bool,
  color: propstype.string,
  fsize: propstype.number,
  fontFamilyLeft: propstype.string,
  justifyContent: propstype.string,
};
