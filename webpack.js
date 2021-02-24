const getWebpackConfig = (isProd = false) => {
    require("@babel/polyfill");
    const path = require('path');
    // const HtmlWebpackPlugin = require('html-webpack-plugin');
    // const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    // const CopyWebpackPlugin = require('copy-webpack-plugin');
    // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    // const TerserWebpackPlugin = require('terser-webpack-plugin');
    // const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    const mode = isProd ? 'production' : 'development'; 
    // if(isProd){
    //   const mode = 'production';
    // } 
    // else {
    //   const mode = 'development';
    // }
    
    const srcFolder = './src/js/index.js';
    const targetFolder = './themes/zest-web/assets/js';
  
    const config = {
        mode,
        entry: ["@babel/polyfill", srcFolder ],
        output: { filename: 'bundle.js' },
        externals: { jquery: 'jQuery'},
        optimization: { splitChunks: { chunks: 'all' } },
        
        resolve: {
            extensions: ['.js', '.json', '.png'],
            alias: {
                '@components': path.resolve(__dirname, 'src/assets/js/components'),
                '@': path.resolve(__dirname, 'src')
            }
        },
  
        plugins: [],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: "babel-loader",
                      options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"]
                      }
                    }
                }
            ]
        }
    }  
  
    return config;
  }
  
  module.exports = { getWebpackConfig };