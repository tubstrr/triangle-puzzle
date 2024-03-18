<template>
	<div class="pieces">
		<div class="piece" data-index="1" data-direction="up" data-rotation="1">
			<p>white</p>
			<p>blue</p>
			<p>black</p>
		</div>
		<div class="piece" data-index="2" data-direction="up" data-rotation="1">
			<p>red</p>
			<p>black</p>
			<p>green</p>
		</div>
		<div class="piece" data-index="3" data-direction="down" data-rotation="1">
			<p>black</p>
			<p>black</p>
			<p>green</p>
		</div>
		<div class="piece" data-index="4" data-direction="up" data-rotation="1">
			<p>green</p>
			<p>red</p>
			<p>black</p>
		</div>
	</div>
</template>

<style lang="scss">
	.pieces {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;

		.piece {
			--top: 50%;
			--left: 50%;
			--top-offset: -50%;
			--left-offset: -50%;

			position: absolute;
			top: var(--top);
			left: var(--left);
			transform: translate(var(--left-offset), var(--top-offset));

			height: 0;
			width: 0;

			border-left: calc(var(--size) / 4 - 2px) solid transparent;
			border-right: calc(var(--size) / 4 - 2px) solid transparent;

			&[data-direction='up'] {
				border-bottom: calc(var(--size) / 2 - 4px) solid white;
			}
			&[data-direction='down'] {
				border-left: calc(var(--size) / 4 - 3px) solid transparent;
				border-right: calc(var(--size) / 4 - 3px) solid transparent;
				border-top: calc(var(--size) / 2 - 6px) solid white;
			}

			&[data-index='1'] {
				--top-offset: -100%;
			}
			&[data-index='2'] {
				--top-offset: 2px;
				--left-offset: calc(-100% - 1px);
			}
			&[data-index='3'] {
				--top-offset: 2px;
				--left-offset: -50%;
			}
			&[data-index='4'] {
				--top-offset: 2px;
				--left-offset: 1px;
			}
		}
	}
</style>
