<template>
	<div>
		<div id="peg">
			<div id="peg-price" class="centered">{{ showPrice(price) }}</div>
			<div class="pair centered">{{ showPair(base, quote) }} </div>
		</div>
		<div id="prices">
			<div class="pair-price">
				<div class="pair">{{ showPair(quote, 'eth') }}</div>
				<div v-for="data in quoteData">
					{{ data.source }}: {{ showPrice(data.price) }}
				</div>
				<div></div>
			</div>
			<div class="pair-price">
				<div class="pair">{{ showPair(base, 'eth') }}</div>
				<div v-for="data in baseData">
					{{ data.source }}: {{ showPrice(data.price) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ethers } from 'ethers';
	import BigNumber from 'bignumber.js';

	import erc20Abi from '../abi/erc20.json';
	import kyberProxyAbi from '../abi/kyberProxy.json';
	import oasisAbi from '../abi/oasis.json';

	const projectId = '93e3393c76ed4e1f940d0266e2fdbda2';
	const provider =  new ethers.providers.InfuraProvider('mainnet', projectId);

	const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
	const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
	const daiAddress = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
	const daiTokenContract = new ethers.Contract(daiAddress, erc20Abi, provider);

	const kyberProxyAddress = '0x818e6fecd516ecc3849daf6845e3ec868087b755';
	const kyberProxyContract = new ethers.Contract(kyberProxyAddress, kyberProxyAbi, provider);

	const daiExchangeAddress = '0x09cabec1ead1c0ba254b09efb3ee13841712be14';

	const oasisExchangeAddress = '0x39755357759ce0d7f32dc8dc45414cca409ae24e';
	const oasisExchangeContract = new ethers.Contract(oasisExchangeAddress, oasisAbi, provider);

	export default {
		data() {
			return {
				baseData: [],
				quoteData: []
			}
		},
		mounted: function() {
			this.loadPrices();
		},
		watch: {
			$route: function(to, from) {
				this.baseData = [];
				this.quoteData = [];
				this.loadPrices();
			}
		},
		computed: {
			price: function() {
				return this.basePrice.div(this.quotePrice);
			},
			basePrice: function() {
				const dataSources = this.baseData.length;
				if (dataSources == 0) {
					return new BigNumber(0);
				}
				var sum = new BigNumber(0);
				for (var source of this.baseData) {
					sum = sum.plus(source.price);
				}
				const price = sum.div(dataSources);
				return price;
			},
			quotePrice: function() {
				const dataSources = this.quoteData.length;
				if (dataSources == 0) {
					return new BigNumber(0);
				}
				var sum = new BigNumber(0);
				for (var source of this.quoteData) {
					sum = sum.plus(source.price);
				}
				const price = sum.div(dataSources);
				return price;
			},
			base: function() {
				return this.$route.params.base;
			},
			quote: function() {
				return this.$route.params.quote;
			}
		},
		methods: {
			showPrice: function(price) {
				if (price.isZero() || price.isNaN() || !price.isFinite()) {
					return '...';
				}
				return price.toFixed(3);
			},
			showPair: function(base, quote) {
				return `${quote.toUpperCase()}/${base.toUpperCase()}`
			},
			loadPrices: async function() {
				if (this.quote == 'dai') {
					this.addUniswap(this.quoteData, this.quote);
					this.addKyber(this.quoteData, this.quote);
					this.addOasis(this.quoteData, this.quote);
				}
				if (this.quote == 'usdc') {
					this.addCoinbase(this.quoteData, this.quote);
				}
				this.addCoinbase(this.baseData, this.base);
			},
			addUniswap: async function(source, token) {
				source.push({
					price: await this.loadUniswapPrice(token),
					source: 'Uniswap'
				});
			},
			addKyber: async function(source, token) {
				source.push({
					price: await this.loadKyberPrice(token),
					source: 'Kyber'
				});
			},
			addOasis: async function(source, token) {
				source.push({
					price: await this.loadOasisPrice(token),
					source: 'Oasis'
				});
			},
			addCoinbase: async function(source, token) {
				source.push({
					price: await this.loadCoinbasePrice(token),
					source: 'Coinbase Pro'
				});
			},
			loadUniswapPrice: async function(token) {
				const etherVolumeString = (await provider.getBalance(daiExchangeAddress)).toString();
				const tokenVolumeString = (await daiTokenContract.balanceOf(daiExchangeAddress)).toString();
				const etherVolume = new BigNumber(etherVolumeString);
				const tokenVolume = new BigNumber(tokenVolumeString);
				const price = tokenVolume.div(etherVolume);
				return price;
			},
			loadKyberPrice: async function(token) {
				var amount;
				const one = new BigNumber(1);
				const ten = new BigNumber(10);
				const weiMultiplier = ten.pow(18);

				amount = ethers.utils.parseUnits('1', 18);
				const ethDaiRate = await kyberProxyContract.getExpectedRate(ethAddress, daiAddress, amount);
				const ethDaiPriceString = ethDaiRate.expectedRate.toString();
				const ethDaiPriceWei = new BigNumber(ethDaiPriceString);
				const ethDaiPrice = ethDaiPriceWei.div(weiMultiplier);

				amount = ethers.utils.parseUnits(ethDaiPrice.toString(), 18);
				const daiEthRate = await kyberProxyContract.getExpectedRate(daiAddress, ethAddress, amount);
				const daiEthPriceString = daiEthRate.expectedRate.toString();
				const daiEthPriceWei = new BigNumber(daiEthPriceString);
				const daiEthPrice = daiEthPriceWei.div(weiMultiplier);
				const daiEthRevertedPrice = one.div(daiEthPrice);

				const price = ethDaiPrice.plus(daiEthRevertedPrice).div(2);
				return price;
			},
			loadOasisPrice: async function(token) {
				const amount = ethers.utils.parseUnits('1', 18);
				const ten = new BigNumber(10);
				const weiMultiplier = ten.pow(18);

				const ethDaiRate = await oasisExchangeContract.getBuyAmount(daiAddress, wethAddress, amount);
				const ethDaiPriceString = ethDaiRate.toString();
				const ethDaiPriceWei = new BigNumber(ethDaiPriceString);
				const ethDaiPrice = ethDaiPriceWei.div(weiMultiplier);

				const daiEthRevertedRate = await oasisExchangeContract.getPayAmount(daiAddress, wethAddress, amount);
				const daiEthRevertedPriceString = daiEthRevertedRate.toString();
				const daiEthRevertedPriceWei = new BigNumber(daiEthRevertedPriceString);
				const daiEthRevertedPrice = daiEthRevertedPriceWei.div(weiMultiplier);

				const price = ethDaiPrice.plus(daiEthRevertedPrice).div(2);
				return price;
			},
			loadCoinbasePrice: async function(token) {
				const endpoint = 'https://api.pro.coinbase.com';
				const url = `${endpoint}/products/ETH-${token}/book?level=1`;
				const response = await fetch(url);
				const json = await response.json();
				const askPriceString = json.asks[0][0];
				const bidPriceString = json.bids[0][0];
				const askPrice = new BigNumber(askPriceString);
				const bidPrice = new BigNumber(bidPriceString);
				const price = askPrice.plus(bidPrice).div(2);
				return price;
			}
		}
	}
</script>

<style>
	.centered
	{
		display: flex;
		justify-content: center;
	}

	.pair
	{
		font-weight: bold;
	}

	.pair-price
	{
		flex: 1;
	}

	#peg
	{
		margin-top: 2em;
	}

	#peg-price
	{
		font-size: 96px;
	}

	#prices
	{
		margin-top: 5em;
		display: flex;
	}
</style>
