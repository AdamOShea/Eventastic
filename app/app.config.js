import 'dotenv/config';

export default {
  expo: {
    name: "Eventastic",
    slug: "app",
    orientation: "portrait",
    icon: "./assets/eventastic.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/eventastic.png",
      resizeMode: "cover",
      backgroundColor: "#899dca"
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_GOOGLE_MAPS_API_KEY, // ✅ Ensure it's loaded
      eas: {
        projectId: "9a1e6fa6-5834-4510-9b1a-1ea3fe70ee6c"
      }
    },
    android: {
      package: "com.giraffehat.app",
      adaptiveIcon: {
        foregroundImage: "./assets/eventastic.png",
        backgroundColor: "#899dca"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY // ✅ Inject API key here
        }
      },
      // ✅ Add manifestPlaceholders to pass API key to AndroidManifest.xml
      manifestPlaceholders: {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  }
};
