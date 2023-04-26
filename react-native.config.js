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
    },
  };