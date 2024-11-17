export default {
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!your-node-module-to-transform)"
    ],

  };
  