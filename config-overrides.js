const path = require('path');

module.exports = function override(config, env) {
  // Change the entry point to use index.html from root
  config.entry = path.resolve(__dirname, 'src/index.js');

  // Update the HTML plugin to use index.html from root
  config.plugins.forEach(plugin => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.userOptions.template = path.resolve(__dirname, 'index.html');
    }
  });

  // Add root directory to the resolver
  config.resolve.modules = [
    path.resolve(__dirname),
    'node_modules'
  ];

  // Set the public path
  config.output.publicPath = '/';

  return config;
};
