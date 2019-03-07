<template>
	<div>
		<div id="peg">
			<div id="peg-price" class="centered">{{ showPrice(price) }}</div>
			<div class="pair centered">{{ showPair(base, quote) }} </div>
		</div>
		<div id="prices">
			<div class="pair-price">
				<div class="pair">{{ showPair(quote, 'eth') }}</div>
				<div>{{ quoteSource }}: {{ showPrice(quotePrice) }}</div>
			</div>
			<div class="pair-price">
				<div class="pair">{{ showPair(base, 'eth') }}</div>
				<div>{{ baseSource }}: {{ showPrice(basePrice) }}</div>
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
				quotePrice: new BigNumber(0),
				basePrice: new BigNumber(0),
				quoteSource: '...',
				baseSource: '...'
			}
		},
		mounted: function() {
			this.loadPrices();
		},
		watch: {
			$route: function(to, from) {
				this.quotePrice = new BigNumber(0);
				this.basePrice = new BigNumber(0);
				this.quoteSource = '...';
				this.baseSource = '...';
				this.loadPrices();
			}
		},
		computed: {
			price: function() {
				return this.basePrice.div(this.quotePrice);
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
					this.quotePrice = await this.loadUniswapPrice(this.quote);
					this.quoteSource = 'Uniswap';
				}
				if (this.quote == 'usdc') {
					this.quotePrice = await this.loadCoinbasePrice(this.quote);
					this.quoteSource = 'Coinbase Pro';
				}
				this.basePrice = await this.loadCoinbasePrice(this.base);
				this.baseSource = 'Coinbase Pro';
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
				const kyberProxyAddress = '0x818e6fecd516ecc3849daf6845e3ec868087b755';
				const kyberProxyContract = new ethers.Contract(kyberProxyAddress, kyberProxyAbi, provider);
				const daiAddres = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
				const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
				const rate = await kyberProxyContract.getExpectedRate(ethAddress, daiAddres, 1e6);
				const priceString = rate.expectedRate.toString();
				const priceWei = new BigNumber(priceString);
				const ten = new BigNumber(10);
				const weiMultiplier = ten.pow(18);
				const price = priceWei.div(weiMultiplier);
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
