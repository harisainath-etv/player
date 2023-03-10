import { StatusBar, } from 'expo-status-bar';
import { Dimensions,StyleSheet, View, Text} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL,} from '../constants';
import axios from 'axios';


const width=Dimensions.get('window').width;
const height=Dimensions.get('window').height;
export default function Episode({navigation,route}) { 
  const {seoUrl} = route.params; 
  const [seourl,setSeourl] = useState(seoUrl);
  const filterItems = (stringNeeded, arrayvalues) => {
    let query = stringNeeded.toLowerCase();
    return arrayvalues.filter(item => item.toLowerCase().indexOf(query) >= 0);
  }

  
  const loadData = async () =>{
    const baseUrl=FIRETV_BASE_URL;
    const splittedData = seourl.split("/");
    const checkSeason=filterItems('season',splittedData);
    const checkTvShow=filterItems('tv-shows',splittedData);
    const checkNews=filterItems('news',splittedData);
    const checkShow=filterItems('show',splittedData);
    const region = await AsyncStorage.getItem('country_code');
    var urlPath = "";
    console.log("hi");
    if(splittedData.length==4 && checkSeason.length>0)
    {
      urlPath = baseUrl + "/catalogs/" + splittedData[0] + "/items/" + splittedData[1]+ "/subcategories/" + splittedData[2] + "/episodes/" + splittedData[3];
    }
    else if(checkTvShow.length>0){
      urlPath = baseUrl + "/catalogs/" + splittedData[0] + "/episodes/" + splittedData[1];
    }
    else if(checkNews.length>0){
      urlPath = baseUrl + "/catalogs/" + splittedData[0] + "/items/" + splittedData[1]+ "/episodes/" +splittedData[2];
    }
    else if(checkShow.length>0){
      urlPath = baseUrl + "/catalogs/" + splittedData[0] + "/items/" + splittedData[1]+ "/episodes/" +splittedData[2];
    }
    else
    {
      urlPath = baseUrl + "/catalogs/" + splittedData[0] + "/items/" + splittedData[1];
    }
    const url = urlPath + ".gzip?&auth_token="+AUTH_TOKEN+"&region="+region;
    console.log(url);
     // axios.get().then(response => {}).catch(error => {})
  }
  useEffect(()=>{
    loadData
  })
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View     
          style={{
            backgroundColor: '#000000',
            height: 250,
            width: width,
          }}
        >
        </View>
          
           <View style={styles.bodyContent}>
            <View style={styles.marginContainer}>
              <Text style={styles.headingLabel}>Test Name Label</Text>
              <Text style={styles.detailsText}>16 hours ago</Text>
              <Text style={styles.detailsText}>ETV Plus</Text>
              <Text style={styles.detailsText}>U/A 13+</Text>
              <Text style={styles.detailsText}>Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum </Text>
            </View>
            <View style={styles.options}>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="thumb-up" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="share-variant" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialCommunityIcons name="download" size={30} color="#566666"/></View>
                  <View style={styles.singleoption}><MaterialIcons name="watch-later" size={30} color="#566666"/></View>
            </View>
          </View>
          
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer:{flex: 1,backgroundColor:BACKGROUND_COLOR},
  bodyContent:{backgroundColor:BACKGROUND_COLOR},
  headingLabel:{fontSize:25,marginBottom:5,color:'#ffffff',padding:6},
  detailsText:{fontSize:13,marginBottom:5,color:'#566666',padding:6},
  options:{alignItems:'center',justifyContent:'center',flexDirection:'row'},
  singleoption:{width:"25%",alignItems:'center',justifyContent:'center',borderColor:'#566666',borderWidth:1,height:55},
  marginContainer:{marginLeft:5,marginRight:5},
});
