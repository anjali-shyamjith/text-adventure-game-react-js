const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Change the entry point to use index.html from root instead of public
      webpackConfig.entry = path.resolve(__dirname, 'src/index.js');
      
      // Update the HTML plugin to use index.html from root
      const htmlPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin'
      );
      if (htmlPlugin) {
        htmlPlugin.options.template = path.resolve(__dirname, 'index.html');
      }

      return webpackConfig;
    },
  },
};
