module.exports = function (context, options) {
  return {
    name: 'plugin-ohif-webpack-config',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            fs: false,
            path: false,
          },
          fullySpecified: false
        },
        module: {
          rules: [
            {
              test: /\.m?jsx?$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      };
    },
  };
};
