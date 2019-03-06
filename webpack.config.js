const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports =
{
	// This is the "main" file which should include all other modules
	entry: __dirname + '/public/main.js',
	// Where should the compiled file go?
	output:
	{
		path: __dirname + '/docs',
		filename: '[name].[contenthash].js'
	},
	mode: 'development',
	resolve:
	{
		alias:
		{
			vue: 'vue/dist/vue.js'
		}
	},
	module:
	{
		rules:
		[
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use:
				{
					loader: 'babel-loader',
					options:
					{
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
				{
					loader: 'file-loader',
					options:
					{
						name: '[path][name].[ext]'
					},
				}],
			},
			{
				test: /\.ico$/,
				use: [
				{
					loader: 'file-loader',
					options:
					{
						name: '[name].[ext]'
					},
				}],
			},
		]
	},
	plugins:
	[
		//new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin(
		{
			template: 'public/index.html',
		}),
		new VueLoaderPlugin()
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	devServer: {
		port: 3000
	}
}
