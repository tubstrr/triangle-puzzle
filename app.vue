<!--  There are 16 pieces that fit in the board. -->
<!-- There are 12 colors on the boarders -->
<!-- I'm going to need to make a very complex hashmap... -->

<!-- Let's break this down! -->
<!-- Assuming there are only 4 pieces -->
<!-- In this case there'd be 6 colors on the boards -->
<!-- The colors would be: -->
<!-- 1) White -->
<!-- 2) Blue -->
<!-- 3) Red -->
<!-- 4) Red -->
<!-- 5) Green -->
<!-- 6) Black -->
<!-- The Pieces would be: -->
<!-- 1) White, Blue, Black -->
<!-- 2) Red, Black, Green -->
<!-- 3) Black, Black, Green -->
<!-- 4) Green, Red, Black -->

<template>
	<main id="app">
		<NuxtPage />
	</main>
</template>

<style lang="scss">
	#app {
		--vh: calc((100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) * 0.01);
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100 * var(--vh));
	}
</style>
