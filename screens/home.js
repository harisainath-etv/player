import * as React from 'react';
import {useState, useEffect,useRef} from 'react';
import { View,Dimensions,FlatList,StyleSheet,Text,Image, } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BACKGROUND_COLOR,ANDROID_AUTH_TOKEN,FIRETV_BASE_URL,SLIDER_PAGINATION_SELECTED_COLOR,SLIDER_PAGINATION_UNSELECTED_COLOR,MORE_LINK_COLOR,TAB_COLOR,HEADING_TEXT_COLOR,IMAGE_BORDER_COLOR,NORMAL_TEXT_COLOR,ACCESS_TOKEN } from '../constants';

export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};
export const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.height;
const state = {
  data: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
  index: 1,
}


var All=[];
var Final=[];

function Home({navigation}) {
    
      const [colors,setColors] = useState([
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
    const [totalHomeData,settotalHomeData]=useState();
    const [isVertical, setIsVertical] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const progressValue = useSharedValue(0);
    const dataFetchedRef = useRef(false);
    const paginationLoadCount = 50;
    
    const baseOptions = ({
              vertical: false,
              width: PAGE_WIDTH * 0.9,
              height: PAGE_WIDTH ,
          });
    
   async function loadData(p){
        const url=  FIRETV_BASE_URL+"/catalog_lists/home.gzip?item_language=eng&region=IN&auth_token="+ANDROID_AUTH_TOKEN+"&access_token="+ACCESS_TOKEN+"&page="+p+"&page_size="+paginationLoadCount+"&npage_size=10";
        const resp = await fetch(url);
        const data = await resp.json();
        
        if(data.data.catalog_list_items.length>0)
        {
            for(var i=0;i<data.data.catalog_list_items.length;i++)
            {
                for(var j=0;j<data.data.catalog_list_items[i].catalog_list_items.length;j++)
                {
                    if(data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_4_3') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_3_4') || data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.hasOwnProperty('high_16_9'))
                    {
                        if(data.data.catalog_list_items[i].layout_type=="top_banner")
                        All.push(data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url);
                        else
                        if(data.data.catalog_list_items[i].layout_type=="tv_shows")
                        All.push(data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url);
                        else
                        if(data.data.catalog_list_items[i].layout_type=="tv_shows_banner")
                        All.push(data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_16_9.url);
                        else
                        All.push(data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url);
                    }
                }
                
                Final.push({"friendlyId":data.data.catalog_list_items[i].friendly_id,"data":All,"layoutType":data.data.catalog_list_items[i].layout_type,"displayName":data.data.catalog_list_items[i].display_title});
                All=[];
            }
        }

        settotalHomeData(Final);
    }
    const renderItem = ({item,index}) => {
        return (
            <View style={{backgroundColor:BACKGROUND_COLOR,flex:1,}}>
                <View style={{width:PAGE_WIDTH,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                    {item.layoutType=='top_banner' ? 
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
                        modeConfig={{
                            parallaxScrollingScale: 0.82,
                            parallaxScrollingOffset: 50,
                            parallaxAdjacentItemScale:0.82,
                        }}
                        data={item.data}
                        style={{top:-15,}}
                        renderItem={({ item,index }) => <FastImage key={index} style={styles.image} source={{uri:item,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} />}
                    />
                    : ""}

                    {item.layoutType=='top_banner' && !!progressValue ? 
                        <View
                            style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: 200,
                                        alignSelf: 'center',
                                        top:-30,
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
                        </View>
                    : ""}
                </View>

                {item.layoutType=='tv_shows' ? 
                <View>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeader}>{item.displayName}</Text>
                        <Text style={styles.sectionHeaderMore}>+MORE</Text>
                    </View>
                    <FlatList
                        data={item.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <FastImage
                                        style={[styles.imageSectionVertical,{resizeMode: 'stretch',}]}
                                        source={{uri:item,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} />
                                </View>
                        }
                    />
                </View>
                : "" }

                {item.layoutType!='tv_shows' && item.layoutType!='top_banner' && item.layoutType!='tv_shows_banner' ? 
                <View>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeader}>{item.displayName}</Text>
                        <Text style={styles.sectionHeaderMore}>+MORE</Text>
                    </View>
                    <FlatList
                        data={item.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <FastImage
                                        style={[styles.imageSectionHorizontal,{resizeMode: 'stretch',}]}
                                        source={{uri:item,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} />
                                </View>
                        }
                    />
                </View> : ""}

            </View>
          );
    }
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadData(0);
      });
    
    return (
    <View style={{flex:1}}>
      
      
                    <FlatList
                        data={totalHomeData}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={false}
                        contentContainerStyle={{ flexGrow: 1 , flexWrap: 'nowrap'}}
                        style={{height:PAGE_HEIGHT}}
                        renderItem={renderItem}
                    />

        <View style={styles.chromeCast}>
        <FontAwesome5 name="chromecast" size={25} color="white" />
        </View>
        </View>
    );
}

const PaginationItem = (props) => {
    const { animValue, index, length, backgroundColor, isRotate } = props;
    const width = 10;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View
            style={{
                backgroundColor: SLIDER_PAGINATION_UNSELECTED_COLOR,
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
                transform: [
                    {
                        rotateZ: isRotate ? '90deg' : '0deg',
                    },
                ],
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor,
                        flex: 1,
                    },
                    animStyle,
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    Container:{
        backgroundColor:BACKGROUND_COLOR,
        textAlign: "center",
        justifyContent: "center",
        height: 60,
        width:"100%",
    },
    textTabActive:{
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: TAB_COLOR,
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textTab:{
        textAlign: "center",
        justifyContent: "center",
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textStyle:{
        color: NORMAL_TEXT_COLOR,
        textAlign: "center",
        justifyContent: "center", 
        fontFamily:'Montserrat_500Medium',
        fontWeight:'600'
    },
  sectionHeaderView: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    fontFamily:'Montserrat_500Medium',
},
sectionHeader: {
    color: HEADING_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '400',
    left:3,
    fontFamily:'Montserrat_500Medium',
    width:"50%"
},
sectionHeaderMore: {
    color: MORE_LINK_COLOR,
    right: 15,
    fontFamily:'Montserrat_500Medium',
    fontSize:13,
    width:"50%",
    textAlign: 'right'
},
imageSectionHorizontal: {
  width: PAGE_WIDTH/2.06,
  height: 117,
  marginHorizontal: 3,
  borderRadius: 10,
  marginBottom:10,
  borderColor: IMAGE_BORDER_COLOR,
  borderWidth:1
},
imageSectionVertical: {
  width: PAGE_WIDTH/3.15,
  height: 170,
  marginHorizontal: 3,
  borderRadius: 10,
  marginBottom:10,
  
},
imageSectionCircle:{
  marginHorizontal: 0,
  marginBottom:10,
  width: PAGE_WIDTH/4, 
  height: PAGE_WIDTH/4,
  borderRadius: (PAGE_WIDTH/4)/ 2,
  borderColor: IMAGE_BORDER_COLOR,
  borderWidth:1
},
imageSectionBig: {
  width: PAGE_WIDTH/1.1,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 1,
  padding:20,
  borderColor: IMAGE_BORDER_COLOR,
  borderWidth:1
},
imageSectionBigSingle:{
  width: PAGE_WIDTH/1.04,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 7,
  padding:20,
  
},
imageSectionBigWithBorder:{
  width: PAGE_WIDTH/1.1,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 1,
  padding:20,
  borderRadius:10,
  borderColor: IMAGE_BORDER_COLOR,
  borderWidth:1
},
chromeCast:{
    width: 56,  
    height: 56,   
    borderRadius: 28,            
    backgroundColor:BACKGROUND_COLOR,
    position: 'absolute',                                          
    bottom: 10,                                                    
    right: 10, 
    borderColor: IMAGE_BORDER_COLOR,
    borderWidth:1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'flex-end'
},
image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'stretch',
    borderRadius:10,
    height:420
},
});

export default Home;