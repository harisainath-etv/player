import { Dimensions,Platform,PixelRatio } from 'react-native';

export var APP_VERSION="";
export var AUTH_TOKEN="";
export const DEVELOPMENT_MODE="staging"; //production
{Platform.OS=="android" ? APP_VERSION = "2.0.1" : ""}
{Platform.OS=="android" ? AUTH_TOKEN = "xttqeMn2dYtthp8aaUr2" : ""}
{Platform.OS=="ios" ? APP_VERSION = "1.0.3" : ""}
{Platform.OS=="ios" ? AUTH_TOKEN = "VJ8WEaqygbpYSMzBtsGz" : ""}
export const VIDEO_AUTH_TOKEN = "q5u8JMWTd2698ncg7q4Q";
export const SECRET_KEY = "2fd66b173c16e012e90e";
export const BASE_URL="https://prod.api.etvwin.com";
export const ACCESS_TOKEN= "Ay6KCkajdBzztJ4bptpW";
export const WEB_CLIENT_ID = "416227379708-naqjmgpfidspo7nqb77de795sqjcovg4.apps.googleusercontent.com";
export const FIRETV_BASE_URL_STAGING = DEVELOPMENT_MODE=="staging" ? "https://stagingott.etvwin.com/" : "https://firetvapi.etvwin.com/";
export const FIRETV_BASE_URL = DEVELOPMENT_MODE=="staging" ? "https://stagingott.etvwin.com/" : "https://firetvapi.etvwin.com/";
export const COMMON_BASE_URL = DEVELOPMENT_MODE=="staging" ? "https://staging.etvwin.com/" : "https://www.etvwin.com/";
export const BACKGROUND_COLOR ="#292828";
export const BACKGROUND_TRANSPARENT_COLOR ="rgba(41, 40, 40, 0.4)";
export const BACKGROUND_TRANSPARENT_GRADIENT_MENU ="rgba(0, 0, 0, 0.8)";
export const BACKGROUND_TRANSPARENT_COLOR_MENU ="rgba(0, 0, 0, 0.3)";
export const BACKGROUND_TOTAL_TRANSPARENT_COLOR_MENU ="rgba(41, 40, 40, 0)";
export const SIDEBAR_BACKGROUND_COLOR = "#01031A";
export const SLIDER_PAGINATION_SELECTED_COLOR = "#e30f17";
export const SLIDER_PAGINATION_UNSELECTED_COLOR = "#3a3d68";
export const MORE_LINK_COLOR = "#e30f17";
export const TAB_COLOR = "#e30f17";
export const BUTTON_COLOR = "#292828";
export const HEADING_TEXT_COLOR = "#ffffff";
export const NORMAL_TEXT_COLOR = "#ffffff";
export const IMAGE_BORDER_COLOR = "#6b9fd7";
export const DETAILS_TEXT_COLOR = "#b1cccc";
export const DARKED_BORDER_COLOR = "#343636";
export const FOOTER_DEFAULT_TEXT_COLOR = "#a0a3a3";
export const BACKGROUND_DARK_COLOR = "#000000";
export const PAGE_WIDTH = Dimensions.get('screen').width;
export const PAGE_HEIGHT = Dimensions.get('screen').height;
export const NO_CAST_DEVICES = "noDevicesAvailable";
export const VIDEO_TYPES = ["show_episode","video","episode","videolist","movie","livetv","videos","list-2d","mini_clips"];
export const LAYOUT_TYPES = ["Vertical","Horizontal"];
export const ANDROID_SHARE_MESSAGE = "Hi, \r\n\r\n I am using the ETV Win App. Check it out on your phone and stay in touch with us anytime and anywhere \r\n\r\n";
export const IOS_SHARE_MESSAGE = "Hi, \r\n\r\n I am using the ETV Win App. Check it out on your phone and stay in touch with us anytime and anywhere \r\n\r\n";
export const ANDROID_SHARE_URL = "https://play.google.com/store/apps/details?id=com.etvwin.mobile";
export const IOS_SHARE_URL = "https://play.google.com/store/apps/details?id=com.etvwin.mobile";
export const ANDROID_PACKAGE_NAME = "com.etvwin.mobile";
export const IOS_PACKAGE_NAME = "com.etvott.dev";
export const MPGS_PAYMENT_BASE_URL = "https://hdfcbank.gateway.mastercard.com/checkout/api/retrieveWsapiVersion/";
export const SHORTS_BASE_URL = "http://65.2.184.87/files/index.php/";
export const scale = PAGE_WIDTH /375;
export const scaleVertical = PAGE_HEIGHT/812;
export function actuatedNormalize(size){
    const newSize = size*scale
    if(Platform.OS ==="ios" ){
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }else{
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
}

export function actuatedNormalizeVertical(size){
    const newSize = size*scaleVertical
    if(Platform.OS === "ios"){
        return Math.round(PixelRatio.roundToNearestPixel(newSize))

    }else{
        return Math.round(PixelRatio.roundToNearestPixel(newSize))

    }
}