<template>
	<div class="box">
		<Borders />
		<Pieces />
	</div>
</template>

<style lang="scss">
	.box {
		--size: 40vw;
		position: relative;
		width: var(--size);
		height: var(--size);

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0;
			height: 0;
			transform: translate(-50%, -50%);
			border-left: calc(var(--size) / 2) solid transparent;
			border-right: calc(var(--size) / 2) solid transparent;
			border-bottom: var(--size) solid black;
		}
	}
</style>
