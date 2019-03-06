<template>
	<div>
		<div id="peg">
			<div id="peg-price" class="centered">{{ showPrice(daiUsd) }}</div>
			<div class="pair centered">DAI/USD</div>
		</div>
		<div id="prices">
			<div class="pair-price">
				<div class="pair">ETH/DAI</div>
				<div>Uniswap: {{ showPrice(uniswapPrice) }}</div>
			</div>
			<div class="pair-price">
				<div class="pair">ETH/USD</div>
				<div>Coinbase Pro: {{ showPrice(coinbasePrice) }}</div>
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
				uniswapPrice: new BigNumber(0),
				kyberPrice: new BigNumber(0),
				coinbasePrice: new BigNumber(0)
			}
		},
		mounted: function() {
			this.loadPrices();
		},
		computed: {
			ethDai: function() {
				return this.uniswapPrice;
			},
			ethUsd: function() {
				return this.coinbasePrice;
			},
			daiUsd: function() {
				return this.ethUsd.div(this.ethDai);
			}
		},
		methods: {
			showPrice: function(price) {
				if (price.isZero() || price.isNaN() || !price.isFinite()) {
					return '...';
				}
				return price.toFixed(3);
			},
			loadPrices: function() {
				this.loadUniswapPrice();
				// this.loadKyberPrice();
				this.loadCoinbasePrice();
			},
			loadUniswapPrice: async function() {
				const daiAddres = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
				const daiExchangeAddress = '0x09cabec1ead1c0ba254b09efb3ee13841712be14';
				const tokenContract = new ethers.Contract(daiAddres, erc20Abi, provider);
				const etherVolumeString = (await provider.getBalance(daiExchangeAddress)).toString();
				const tokenVolumeString = (await tokenContract.balanceOf(daiExchangeAddress)).toString();
				const etherVolume = new BigNumber(etherVolumeString);
				const tokenVolume = new BigNumber(tokenVolumeString);
				const price = tokenVolume.div(etherVolume);
				this.uniswapPrice = price;
			},
			loadKyberPrice: async function() {
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
				this.kyberPrice = price;
			},
			loadCoinbasePrice: async function() {
				const endpoint = 'https://api.pro.coinbase.com';
				const url = `${endpoint}/products/ETH-USD/book?level=1`;
				const response = await fetch(url);
				const json = await response.json();
				const askPriceString = json.asks[0][0];
				const bidPriceString = json.bids[0][0];
				const askPrice = new BigNumber(askPriceString);
				const bidPrice = new BigNumber(bidPriceString);
				const price = askPrice.plus(bidPrice).div(2);
				this.coinbasePrice = price;
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
