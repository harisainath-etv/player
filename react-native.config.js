module.exports = {
    project: {
      ios: {},
      android: {},
    },
    dependencies: {
      'react-native-video': {
        platforms: {
          android: {
            sourceDir: '../node_modules/react-native-video/android-exoplayer',
          },
        },
      },
      'react-native-vector-icons': {
        platforms: {
          ios: null,
        },
      },
      'react-native-google-cast': {
        platforms: {
          ios: null, // this will disable autolinking for this package on iOS
        },
      },
    },
  };