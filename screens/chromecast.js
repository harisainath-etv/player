import React from 'react'
import { StyleSheet,View,AppState } from 'react-native';
import GoogleCast,{ CastButton, useRemoteMediaClient, } from 'react-native-google-cast';
import { BACKGROUND_TRANSPARENT_COLOR } from '../constants';

export default function ChromeCast()
{
  // This will automatically rerender when client is connected to a device
  // (after pressing the button that's rendered below)
  
  const client = useRemoteMediaClient()
  if (client) {
    // Send the media to your Cast device as soon as we connect to a device
    // (though you'll probably want to call this later once user clicks on a video or something)
    client.loadMedia({
      mediaInfo: {
        contentUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
        contentType: 'video/mp4',
      },
    })
  }

  // This will render native Cast button.
  // When a user presses it, a Cast dialog will prompt them to select a Cast device to connect to.
  //if(loaded)
  return <View style={styles.chromeCast}><CastButton style={{ width: 24, height: 24}} /></View>
}

const styles = StyleSheet.create({
  chromeCast: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BACKGROUND_TRANSPARENT_COLOR,
    position: 'absolute',
    bottom: 50,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
},
})