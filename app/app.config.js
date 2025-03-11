import 'dotenv/config';

export default {
  expo: {
    name: "Eventastic",
    slug: "app",
    orientation: "portrait",
    icon: "./assets/eventastic.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            manifestApplicationAttributes: {
              "android:usesCleartextTraffic": "true"  
            }
          }
        }
      ]
    ],
    splash: {
      image: "./assets/eventastic.png",
      resizeMode: "cover",
      backgroundColor: "#899dca"
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "9a1e6fa6-5834-4510-9b1a-1ea3fe70ee6c"
      }
    },
    android: {
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
      package: "com.giraffehat.app",
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: "./assets/eventastic.png",
        backgroundColor: "#899dca"
      },
      
      
    }
  }
};
