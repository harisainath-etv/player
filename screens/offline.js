import { View, Text, StyleSheet, Alert, StatusBar, Pressable, ScrollView, FlatList, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import RNBackgroundDownloader from 'react-native-background-downloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, DATABASE_DISPLAY_NAME, DATABASE_NAME, DATABASE_SIZE, DATABASE_VERSION, NORMAL_TEXT_COLOR, PAGE_HEIGHT } from '../constants';
import FastImage from 'react-native-fast-image';
import Footer from './footer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { StackActions } from '@react-navigation/native';
import { BACKGROUND_TRANSPARENT_COLOR } from '../constants';
import Header from './header';
var pendingTasks = [];
var AllTasks = [];
var SQLite = require('react-native-sqlite-storage')
export default function Offline({ navigation }) {
  const [offlineVideo, setOfflineVideos] = useState();
  const [pauseDownload, setPauseDownload] = useState(false);
  const dataFetchedRef = useRef(false);
  const errorCB = (err) => {
    //console.log("SQL Error: " + err);
  }

  const successCB = () => {
    console.log("SQL executed fine");
  }

  const openCB = () => {
    //console.log("Database OPENED");
  }
  const getdownloadedvides = async () => {
    var db = await SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE, openCB, errorCB);
    await db.transaction((tx) => {
      tx.executeSql('SELECT * FROM DownloadedId group by downloadedid', [], async (tx, results) => {
        var len = results.rows.length;
        console.log(len);
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(row.downloadedid);
          var taskid = row.downloadedid;
          var downloadurl = await AsyncStorage.getItem('download_url' + taskid);
          var downloadpath = await AsyncStorage.getItem('download_path' + taskid);
          var downloadtitle = await AsyncStorage.getItem('download_title' + taskid);
          var downloadthumbnail = await AsyncStorage.getItem('download_thumbnail' + taskid);
          var downloadpercent = await AsyncStorage.getItem('download_' + taskid);
          var downloadseourl = await AsyncStorage.getItem('download_seourl' + taskid);
          var downloadtheme = await AsyncStorage.getItem('download_theme' + taskid);
          pendingTasks.push({ 'task': taskid, 'downloadurl': downloadurl, 'downloadpath': downloadpath, 'downloadtitle': downloadtitle, 'downloadthumbnail': downloadthumbnail, 'downloadpercent': downloadpercent, 'downloadseourl': downloadseourl, 'downloadtheme': downloadtheme })
        }
        AllTasks = [];
        AllTasks.push({ "data": pendingTasks })
        pendingTasks = [];
        setOfflineVideos(AllTasks);
        AllTasks = [];
      });
    });
  }
  const downloadedVideos = async () => {
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    //console.log(JSON.stringify(lostTasks));
    for (let task of lostTasks) {
      task.begin(expectedBytes => {
        //console.log('Expected: ' + expectedBytes);
      }).progress((percent) => {
        AsyncStorage.setItem('download_' + task.id, JSON.stringify(percent * 100));
        console.log(`Downloaded: ${percent * 100}%`);
      }).done(() => {
        console.log(task.id);
        completedtask(task.id);
        //console.log('Downlaod is done!');
      }).error((error) => {
        //console.log('Download canceled due to error: ', error);
      });
    }

    await getdownloadedvides();
  }
  const completedtask = async (id) => {
    await AsyncStorage.setItem('download_' + id, JSON.stringify(1 * 100));
    //navigation.dispatch(StackActions.replace('Reload',{routename:'Offline'}));
    await getdownloadedvides();
  }
  const deleteDownload = async (taskid) => {

    Alert.alert('Delete File', 'Please confirm to delete the file from offline.', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'OK', onPress: async () => {
          console.log('OK Pressed')
          let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
          var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/' + taskid + ".mov";
          for (let task of lostTasks) {
            if (task.id == taskid) {
              task.stop();
            }
          }
          if (await RNFS.exists(downloaddirectory)) {
            await RNFS.unlink(downloaddirectory)
          }
          var db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DISPLAY_NAME, DATABASE_SIZE, openCB, errorCB);
          db.transaction((tx) => {
            tx.executeSql("delete FROM DownloadedId where downloadedid='" + taskid + "'", [], async (tx, results) => {
            });
          });

          await downloadedVideos();
          //navigation.dispatch(StackActions.replace('Reload',{routename:'Offline'}));

        }
      },
    ]);
  }
  const pauseDownloadAction = async (taskid) => {
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    for (let task of lostTasks) {
      if (taskid == task.id) {
        task.pause();
        setPauseDownload(true);
      }
    }
    await downloadedVideos()
  }
  const resumeDownloadAction = async (taskid) => {
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    for (let task of lostTasks) {
      if (taskid == task.id) {
        task.resume();
        setPauseDownload(false);
      }
    }
    await downloadedVideos()
  }
  const videosRender = (item) => {
    var downloadstatus = 0;
    if (item.item.downloadpercent == '100') {
      downloadstatus = 1;
    }
    else if (item.item.downloadpercent != "" || item.item.downloadpercent != null) {
      downloadstatus = 2;
    }
    else {
      downloadstatus = 0;
    }
    return (

      <View style={{ borderColor: DARKED_BORDER_COLOR, borderRadius: 15, borderWidth: 1, width: "99%", marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', width: "100%" }}>
          {item.item.downloadthumbnail ?
            <Pressable style={{ width: "35%", marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>


              <FastImage
                style={{ width: "100%", height: 80, left: 0, borderRadius: 15, }}
                source={{ uri: item.item.downloadthumbnail, priority: FastImage.priority.high }}
                resizeMode={FastImage.resizeMode.stretch}
              />
              {downloadstatus != 1 ? <Pressable style={{ width: "100%", height: 80, left: 0, borderRadius: 15, position: 'absolute', backgroundColor: BACKGROUND_TRANSPARENT_COLOR, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.item.downloadseourl, theme: item.item.downloadtheme }))}><View><MaterialCommunityIcons name='progress-download' size={30} color={NORMAL_TEXT_COLOR}></MaterialCommunityIcons></View></Pressable> : ""}
              <View style={{ position: 'absolute' }}>
                {downloadstatus == 1 ? <Pressable onPress={() => navigation.dispatch(StackActions.replace('Episode', { seoUrl: item.item.downloadseourl, theme: item.item.downloadtheme }))}><MaterialCommunityIcons name="play-circle" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : ""}
                {downloadstatus == 2 ?

                  pauseDownload ? <Pressable><MaterialCommunityIcons onPress={() => resumeDownloadAction(item.item.task)} name="motion-pause" size={60} color={NORMAL_TEXT_COLOR} /></Pressable> : <Pressable><MaterialCommunityIcons onPress={() => pauseDownloadAction(item.item.task)} name="progress-download" size={60} color={NORMAL_TEXT_COLOR} /></Pressable>

                  : ""}
              </View>
            </Pressable>
            : ""}
          {item.item.downloadtitle ?
            <View style={{ justifyContent: 'center', alignSelf: 'center', width: "53%", marginRight: 2 }}>
              <Text style={{ color: NORMAL_TEXT_COLOR }}>{item.item.downloadtitle}</Text>
            </View>
            : ""}

          <View style={{ alignSelf: 'center', width: "10%" }}>
            <Pressable onPress={() => deleteDownload(item.item.task)}><MaterialCommunityIcons name="delete-circle" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
          </View>
        </View>
      </View>

    )
  }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    downloadedVideos();
  }, [offlineVideo])
  return (
    <View style={styles.mainContainer}>
      <Header pageName="OFFLINE"></Header>
      <View style={{ padding: 10 }}>
        <Text style={{ color: NORMAL_TEXT_COLOR }}>Offline Downloads</Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {offlineVideo ?
            <FlatList
              data={offlineVideo[0].data}
              keyExtractor={(x, i) => i.toString()}
              renderItem={videosRender}
            />
            :
            ""
          }
        </View>
      </View>
      <View style={{ position: 'absolute', bottom: 0 }}>
        <Footer pageName="OFFLINE"></Footer>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
})