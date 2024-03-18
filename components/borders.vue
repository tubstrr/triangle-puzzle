<template>
	<div class="borders">
		<div class="left-border border">
			<p>red</p>
			<p>white</p>
		</div>
		<div class="right-border border">
			<p>blue</p>
			<p>red</p>
		</div>
		<div class="bottom-border border">
			<p>green</p>
			<p>black</p>
		</div>
	</div>
</template>

<style lang="scss">
	.borders {
		width: var(--size);
		height: var(--size);

		.border {
			--angle: 0deg;
			--top: 100%;
			--left: 50%;
			--top-offset: -50%;
			--left-offset: -50%;
			--polygon: polygon(0% 100%, 100% 100%, 100% 0%, 0% 100%);

			width: calc(var(--size) * 1.5);
			display: flex;
			justify-content: space-evenly;
			background: transparent;
			font-weight: 900;
			text-transform: uppercase;

			position: absolute;
			top: var(--top);
			left: var(--left);

			transform-origin: center center;
			transform: translate(var(--left-offset), var(--top-offset)) rotate(var(--angle));

			&.left-border {
				--angle: -63deg;
				--top: 50%;
				--left: 20%;
			}
			&.right-border {
				--angle: 63deg;
				--top: 50%;
				--left: 80%;
			}
			&.bottom-border {
				--top-offset: 0;
			}
		}
	}
</style>
