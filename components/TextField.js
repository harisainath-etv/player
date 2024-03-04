import React, { useState } from 'react';
import {
  View,
  TextInput,
} from 'react-native';
import propstype from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
export default function TextField(props) {
  const [eyeVisible, setEyeVisible] = useState(true);

  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }

  function onFocus() {
    if (props.onFocus) {
      props.onFocus();
    }
  }
  function onBlur() {
    if (props.onBlur) {
      props.onBlur();
    }
  }

 

  return (
    // <TouchableOpacity onPress={() => { props.onPress }}
    <View
      style={{
        justifyContent: 'space-between',
        height: props.height,
        flexDirection: 'row',
        width: props.width,
        borderRadius: props.borderRadius,
        borderWidth: props.borderWidth,
        backgroundColor: props.backgroundColor,
        marginTop: props.marginTop,
        marginLeft: props.marginLeft,
        borderColor: props.borderColor,
        // borderColor:click?ColorPath.orange:Colorpath.black,
        alignSelf: props.alignTextField?props.alignTextField:'center',
        alignItems: props.alignItems ? props.alignItems : 'center',
        // justifyContent: 'center',
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        shadowOpacity: props.shadowOpacity,
        shadowRadius: props.shadowRadius,
        shadowOffset: props.shadowOffset,
        shadowColor: props.shadowColor,
        elevation: props.elevation,
        paddingVertical: props.paddingVertical,
        paddingHorizontal: props.paddingHorizontal,
        
      }}>
      <View style={{
        width: '100%', flexDirection: 'row',
        // backgroundColor:'red'
      }}>
        <TextInput
          secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          maxLength={props.maxLength}
          value={props.value}
          //   secureTextEntry={passwordVisible ? props.isVisible : !props.isVisible}
          onChangeText={text => onChangeText(text)}
          onBlur={() => {
            onBlur()
          }}
          onFocus={() => onFocus()}
          multiline={props.multiline}
          textAlignVertical={props.textAlignVertical}
          editable={props.editable}
          style={{
            textTransform:props.textTransform?props.textTransform:'none',
            paddingHorizontal: props.paddingHorizontal
              ? props.paddingHorizontal
              : normalize(12),
            width: props.textWidth ? props.textWidth : '90%',
            numberOfLines: props.numberOfLines,
            fontFamily: props.fontFamily
              ? props.fontFamily
              :'PoppinsMedium',
            fontSize: props.fontSize,
            textAlign: props.textAlign,
            paddingLeft: props.paddingLeft,
            color: "white",
            maxLength: props.maxLength,
            marginTop: props.marginTopInput ? props.marginTopInput : null,
          }} />
      </View>
    </View>
  );
}
TextField.propstype = {
  height: propstype.number,
  width: propstype.number,
  widthText: propstype.number,
  borderRadius: propstype.number,
  borderWidth: propstype.number,
  backgroundColor: propstype.string,
  marginTop: propstype.number,
  color: propstype.string,
  placeholder: propstype.string,
  placeholderTextColor: propstype.string,
  paddingTop: propstype.number,
  borderColor: propstype.string,
  paddingLeft: propstype.number,
  paddingRight: propstype.number,
  marginLeft: propstype.number,
  borderTopRightRadius: propstype.number,
  borderBottomRightRadius: propstype.number,
  borderTopLeftRadius: propstype.number,
  borderBottomLeftRadius: propstype.number,
  maxLength: propstype.number,
  image: propstype.bool,
  textAlign: propstype.number,
  paddingLeft: propstype.number,
  keyboardType: propstype.number,
  onFocus: propstype.func,
  onBlur: propstype.func,
  multiline: propstype.bool,
  textAlignVertical: propstype.string,
  numberOfLines: propstype.number,
  // marginTopShow: propstype.number,
  editable: propstype.bool,
  calender: propstype.bool,
  date: propstype.string,
  datePlaceholder: propstype.string,
  onPress: propstype.func,
  marginTopInput: propstype.number,
  keyboardType: propstype.string,
  source: propstype.string,
  tintColor: propstype.string,
  iheight: propstype.number,
  iwidth: propstype.number,
  borderWidth: propstype.number,
  image2: propstype.bool,
  right2: propstype.number,
  left2: propstype.number,
  source2: propstype.string,
  tintColor2: propstype.string,
  iheight2: propstype.number,
  iwidth2: propstype.number,
  shadowOpacity: propstype.number,
  shadowRadius: propstype.number,
  shadowOffset: propstype.number,
  shadowColor: propstype.string,
  elevation: propstype.number,
  fontFamily: propstype.string,
  autoCapitalize: propstype.string,
  isSecure: propstype.bool,
  isRightIconVisible: propstype.bool,
  rightimage: propstype.string,
  rightimageheight: propstype.number,
  rightimagewidth: propstype.number,
  eye: propstype.bool,
  textWidth: propstype.number,
  disabled: propstype.bool,
  paddingVertical: propstype.number,
  paddingHorizontal: propstype.number,
  alignTextField:propstype.string,
  onPressCamera:propstype.func,
  disabledCamera:propstype.bool,
  textTransform:propstype.string,
  
};
