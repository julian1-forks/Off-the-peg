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

	const projectId = '93e3393c76ed4e1f940d0266e2fdbda2';
	const provider =  new ethers.providers.InfuraProvider('mainnet', projectId);

	export default {
		data() {
			return {
				// quotePrice: new BigNumber(0),
				// basePrice: new BigNumber(0),
				// quoteSource: '...',
				// baseSource: '...'
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
				// this.quotePrice = new BigNumber(0);
				// this.basePrice = new BigNumber(0);
				// this.quoteSource = '...';
				// this.baseSource = '...';
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
				var price;
				var source;
				if (this.quote == 'dai') {
					this.quoteData.push({
						price: await this.loadUniswapPrice(this.quote),
						source: 'Uniswap'
					});
					this.quoteData.push({
						price: await this.loadKyberPrice(this.quote),
						source: 'Kyber'
					});
				}
				if (this.quote == 'usdc') {
					this.quoteData.push({
						price: await this.loadCoinbasePrice(this.quote),
						source: 'Coinbase Pro'
					});
				}
				this.baseData.push({
					price: await this.loadCoinbasePrice(this.base),
					source: 'Coinbase Pro'
				});
			},
			loadUniswapPrice: async function(token) {
				const daiAddres = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
				const daiExchangeAddress = '0x09cabec1ead1c0ba254b09efb3ee13841712be14';
				const tokenContract = new ethers.Contract(daiAddres, erc20Abi, provider);
				const etherVolumeString = (await provider.getBalance(daiExchangeAddress)).toString();
				const tokenVolumeString = (await tokenContract.balanceOf(daiExchangeAddress)).toString();
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

				const kyberProxyAddress = '0x818e6fecd516ecc3849daf6845e3ec868087b755';
				const kyberProxyContract = new ethers.Contract(kyberProxyAddress, kyberProxyAbi, provider);
				const daiAddres = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
				const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

				amount = ethers.utils.parseUnits('1', 18);
				const ethDaiRate = await kyberProxyContract.getExpectedRate(ethAddress, daiAddres, amount);
				const ethDaiPriceString = ethDaiRate.expectedRate.toString();
				const ethDaiPriceWei = new BigNumber(ethDaiPriceString);
				const ethDaiPrice = ethDaiPriceWei.div(weiMultiplier);

				amount = ethers.utils.parseUnits(ethDaiPrice.toString(), 18);
				const daiEthRate = await kyberProxyContract.getExpectedRate(daiAddres, ethAddress, amount);
				const daiEthPriceString = daiEthRate.expectedRate.toString();
				const daiEthPriceWei = new BigNumber(daiEthPriceString);
				const daiEthPrice = daiEthPriceWei.div(weiMultiplier);
				const daiEthRevertedPrice = one.div(daiEthPrice);

				const price = ethDaiPrice.plus(daiEthRevertedPrice).div(2);
				return price;
			},
			loadOasisPrice: async function(token) {

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
