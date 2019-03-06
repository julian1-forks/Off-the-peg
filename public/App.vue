<template>
	<div id="app">
		<div id="left">
		</div>
		<div id="center">
			<h1>Off the peg</h1>
			<router-view/>
		</div>
		<div id="right">
		</div>
	</div>
</template>

<style>
	@import url('https://fonts.googleapis.com/css?family=Roboto');

	/*==================================================
	  Basics
	  ==================================================*/

	body
	{
		font-family: 'Roboto', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
		font-size: 16px;
	}

	#app
	{
		display: flex;
		justify-content: center;
	}

	#left,
	#right
	{
		flex: 1;
	}

	#center
	{
		max-width: 800px;
		flex: 3;
		justify-content: center;
		flex-direction: column;
	}

	/* Mobile */

	@media all and (max-width: 1399px)
	{
		#left,
		#right
		{
			flex: 0.5;
		}
	}

	@media all and (max-width: 1023px)
	{
		#left,
		#right
		{
			flex: 0.5;
		}

		#center
		{
			display: flex;
			flex: 4;
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	@media all and (max-width: 767px)
	{
		#left,
		#right
		{
			flex: 0;
		}
	}

	/* Helper mode */
	@media all and (max-width: 255px)
	{
		div.nav-bar-mobile
		{
			width: 180px;
		}

		div.nav-option-mobile
		{
			margin: 0 2px;
		}
	}

</style>
