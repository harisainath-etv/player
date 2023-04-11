import { View, Text, StyleSheet, Alert, StatusBar, Pressable, ScrollView, FlatList, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import RNBackgroundDownloader from 'react-native-background-downloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKGROUND_COLOR, DARKED_BORDER_COLOR, NORMAL_TEXT_COLOR, PAGE_HEIGHT } from '../constants';
import FastImage from 'react-native-fast-image';
import Footer from './footer';
import RNFetchBlob from 'react-native-fetch-blob';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
var pendingTasks = [];
var AllTasks = [];
export default function Offline() {
  const [offlineVideo, setOfflineVideos] = useState();
  const [downloadTitle, setDownloadTitle] = useState();
  const [downloadThumbnail, setDownloadThumbnail] = useState();
  const [downloadPercent, setDownloadPercent] = useState();
  const [downloadUrl, setDownloadUrl] = useState();
  const [downloadedStatus, setDownloadedStatus] = useState(0);
  const [onlineplayUrl, setOnlinePlayUrl] = useState(false);
  const [pauseDownload, setPauseDownload] = useState(false);
  const [downloadDestination, setDownloadDestination] = useState(false);
  const [state, setState] = useState({});
  const dataFetchedRef = useRef(false);

  const downloadedVideos = async () => {
    var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/';
    let files = await RNFetchBlob.fs.ls(downloaddirectory);
    for (var i = 0; i < files.length; i++) {
      var taskdetail = files[i].split(".");
      var taskid = taskdetail[0];
      var downloadurl = await AsyncStorage.getItem('download_url' + taskid);
      var downloadpath = await AsyncStorage.getItem('download_path' + taskid);
      var downloadtitle = await AsyncStorage.getItem('download_title' + taskid);
      var downloadthumbnail = await AsyncStorage.getItem('download_thumbnail' + taskid);
      var downloadpercent = await AsyncStorage.getItem('download_' + taskid);
      pendingTasks.push({ 'task': taskid, 'downloadurl': downloadurl, 'downloadpath': downloadpath, 'downloadtitle': downloadtitle, 'downloadthumbnail': downloadthumbnail, 'downloadpercent': downloadpercent })
    }
    AllTasks.push({ "data": pendingTasks })
    pendingTasks = [];
    setOfflineVideos(AllTasks);
    AllTasks = [];
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
          var downloaddirectory = RNBackgroundDownloader.directories.documents + '/offlinedownload/' + taskid + ".ts";
          for (let task of lostTasks) {
            if (task.id == taskid) {
              task.stop();
            }
          }
          if (await RNFS.exists(downloaddirectory)) {
            await RNFS.unlink(downloaddirectory)
            downloadedVideos();
          }
        }
      },
    ]);
  }


  const videosRender = (item) => {
    var downloadstatus = 0;
    var pausedownload = false;
    if (item.item.downloadpercent == '100') {
      downloadstatus = 1;
    }
    else if (item.item.downloadpercent != "" || item.item.downloadpercent != null) {
      downloadstatus = 2;
      pausedownload = true;
    }
    else {
      downloadstatus = 0;
      pausedownload = false;
    }

    return (

      <View style={{ borderColor: DARKED_BORDER_COLOR, borderRadius: 15, borderWidth: 1, width: "99%",marginBottom:10 }}>
        <View style={{ flexDirection: 'row', width: "100%" }}>
          {item.item.downloadthumbnail ?
            <Pressable style={{ width: "35%", marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
              <FastImage
                style={{ width: "100%", height: 80, left: 0, borderRadius: 15, }}
                source={{ uri: item.item.downloadthumbnail, priority: FastImage.priority.high }}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <View style={{ position: 'absolute' }}>
                {downloadstatus == 0 ? <Pressable><MaterialCommunityIcons name="download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : ""}
                {downloadstatus == 1 ? <Pressable><MaterialCommunityIcons name="play-circle" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : ""}
                {downloadstatus == 2 ?

                  pausedownload ? <Pressable><MaterialCommunityIcons name="motion-pause" size={30} color={NORMAL_TEXT_COLOR} /></Pressable> : <Pressable><MaterialCommunityIcons name="progress-download" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>

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
  })
  return (
    <View style={styles.mainContainer}>
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