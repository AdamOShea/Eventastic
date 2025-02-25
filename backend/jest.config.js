module.exports = {
  
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|react-navigation)"
  ],
  
};
