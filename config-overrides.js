const path = require("path");
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      "@api": path.resolve(__dirname, "src/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@common": path.resolve(__dirname, "src/common"),
      "@features": path.resolve(__dirname, "src/features"),
      "@screens": path.resolve(__dirname, "src/screens"),
      "@store": path.resolve(__dirname, "src/store"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  };
  return config;
};
