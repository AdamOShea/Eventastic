module.exports = {
  preset: 'react-native',  // Use React Native preset
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|react-navigation)"
  ],
  
};
