const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    // config.devServer.https(true).proxy({
    //   "/socket": {
    //     target: process.env.VUE_APP_WEBSOCKET_URL,
    //     ws: true,
    //     changeOrigin: true,
    //     // secure: true,
    //     // changeOrigin: true,
    //     // autoRewrite: false,
    //     logLevel: "debug",
    //   },
    // });

    config.module
      .rule("i18n-resource")
      .test(/\.(json5?|ya?ml)$/)
      .include.add(path.resolve(__dirname, "./src/locales"))
      .end()
      .type("javascript/auto")
      .use("i18n-resource")
      .loader("@intlify/vue-i18n-loader");

    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@intlify/vue-i18n-loader");
  },
};
