export default defineEventHandler((event) => {
	// Setup the board:
	const board = [
		{ side: 'left', value: 'orange,white,red,white' },
		{ side: 'right', value: 'blue,red,green,black' },
		{ side: 'bottom', value: 'green,green,white,green' },
	];

	// Setup the pieces:
	const pieces = [
		{
			color_1: 'red',
			color_2: 'black',
			color_3: 'green',
		},
		{
			color_1: 'red',
			color_2: 'green',
			color_3: 'white',
		},
		{
			color_1: 'black',
			color_2: 'orange',
			color_3: 'green',
		},
		{
			color_1: 'blue',
			color_2: 'orange',
			color_3: 'green',
		},
		{
			color_1: 'white',
			color_2: 'blue',
			color_3: 'black',
		},
		{
			color_1: 'white',
			color_2: 'blue',
			color_3: 'black',
		},
		{
			color_1: 'orange',
			color_2: 'white',
			color_3: 'green',
		},
		{
			color_1: 'black',
			color_2: 'red',
			color_3: 'green',
		},
		{
			color_1: 'orange',
			color_2: 'red',
			color_3: 'green',
		},
		{
			color_1: 'red',
			color_2: 'white',
			color_3: 'orange',
		},
		{
			color_1: 'orange',
			color_2: 'black',
			color_3: 'blue',
		},
		{
			color_1: 'white',
			color_2: 'blue',
			color_3: 'blue',
		},
		{
			color_1: 'black',
			color_2: 'green',
			color_3: 'black',
		},
		{
			color_1: 'green',
			color_2: 'red',
			color_3: 'black',
		},
		{
			color_1: 'white',
			color_2: 'green',
			color_3: 'orange',
		},
		{
			color_1: 'white',
			color_2: 'white',
			color_3: 'blue',
		},
	];

	// Find the answer:
	const findPossiblePieces = (colors, pieces) => {
		return pieces.filter((piece) => {
			const pieceColors = [piece.color_1, piece.color_2, piece.color_3];
			const hasAllColors = colors.every((color) => color === '*' || pieceColors.includes(color));
			if (!hasAllColors) return false;

			const colorsMatchSequentially = [0, 1, 2].some((startIndex) => {
				const sequentialColors = [
					pieceColors[startIndex],
					pieceColors[(startIndex + 1) % 3],
					pieceColors[(startIndex + 2) % 3],
				];
				return colors.every((color, index) => color === '*' || sequentialColors[index] === color);
			});
			if (colorsMatchSequentially) return true;
		});
	};

	// Get clues:
	const getColorCluesByIndex = (index, board) => {
		const clues = [];
		const leftSide = board.find((side) => side.side === 'left');
		const rightSide = board.find((side) => side.side === 'right');
		const bottomSide = board.find((side) => side.side === 'bottom');

		// Catch all
		if (
			index === 2 ||
			index === 5 ||
			index === 6 ||
			index === 7 ||
			index === 10 ||
			index === 11 ||
			index === 12 ||
			index === 13 ||
			index === 14
		) {
			clues.push('*');
			clues.push('*');
			clues.push('*');
		}

		// Actually have borders
		if (index === 0) {
			const leftColor = leftSide.value.split(',')[3];
			const rightColor = rightSide.value.split(',')[0];

			clues.push(leftColor);
			clues.push(rightColor);
			clues.push('*');
		}

		if (index === 1) {
			const leftColor = leftSide.value.split(',')[2];

			clues.push(leftColor);
			clues.push('*');
			clues.push('*');
		}

		if (index === 3) {
			const rightColor = rightSide.value.split(',')[1];

			clues.push('*');
			clues.push(rightColor);
			clues.push('*');
		}

		if (index === 4) {
			const leftColor = leftSide.value.split(',')[1];

			clues.push(leftColor);
			clues.push('*');
			clues.push('*');
		}

		if (index === 8) {
			const rightColor = rightSide.value.split(',')[2];

			clues.push('*');
			clues.push(rightColor);
			clues.push('*');
		}

		if (index === 9) {
			const leftColor = leftSide.value.split(',')[0];
			const bottomColor = bottomSide.value.split(',')[0];

			clues.push(leftColor);
			clues.push('*');
			clues.push(bottomColor);
		}

		if (index === 15) {
			const rightColor = rightSide.value.split(',')[3];
			const bottomColor = bottomSide.value.split(',')[3];

			clues.push('*');
			clues.push(rightColor);
			clues.push(bottomColor);
		}

		return clues;
	};

	const getPositionalCluesByIndex = (index, board, state) => {
		if (state.length === 0) return [];
		const clues = ['*', '*', '*'];

		if (index == 2) {
			const topPiece = state[0];
			const leftPiece = state[1];

			// Get the top pieces colors
			const topColors = [topPiece.color_1, topPiece.color_2, topPiece.color_3];
			// Recreate the clues for the top piece
			// TODO: We should be able to find a way to not have to recreate the clues
			const topClues = getColorCluesByIndex(0, board);
			// Filter out the color that is already in the clues
			const topColor = topColors.filter((color) => !topClues.includes(color))[0];

			// Get the left pieces colors
			const leftColors = [leftPiece.color_1, leftPiece.color_2, leftPiece.color_3];
			// Recreate the clues for the left piece
			const leftClues = getColorCluesByIndex(1, board);
			// Find the index of the color that is already in the clues
			const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
			// Get the next color in the array
			const leftColor = leftColors[(leftColorIndex + 1) % 3];

			clues[0] = leftColor;
			clues[1] = topColor;
		}
		return clues;
	};

	const mergeClues = (boardClues, positionalClues) => {
		const clues = boardClues;

		for (let i = 0; i < positionalClues.length; i++) {
			if (positionalClues[i] !== '*') {
				clues[i] = positionalClues[i];
			}
		}

		return clues;
	};

	// Main Loop:
	const mainLoop = (index, board, piecesRemaining, state = []) => {
		const boardClues = getColorCluesByIndex(index, board);
		const positionalClues = getPositionalCluesByIndex(index, board, state);

		const clues = mergeClues(boardClues, positionalClues);
		const possiblePieces = findPossiblePieces(clues, piecesRemaining);

		if (possiblePieces.length === 0) {
			state.pop();
			return state;
		}

		if (possiblePieces.length === 1) {
			state.push(possiblePieces[0]);
			piecesRemaining = piecesRemaining.filter((piece) => piece !== possiblePieces[0]);
			state = mainLoop(index + 1, board, piecesRemaining, state);
		} else {
			// If there are multiple possible pieces, we need to recurse and try each one:
			for (let i = 0; i < possiblePieces.length; i++) {
				state.push(possiblePieces[i]);
				piecesRemaining = piecesRemaining.filter((piece) => piece !== possiblePieces[i]);
				state = mainLoop(index + 1, board, piecesRemaining, state);
			}
		}

		return state;
	};

	const solution = mainLoop(0, board, pieces);

	return {
		message: 'The answer is 42',
		true: false,
		pieces: solution.length,
		solution,
	};
});
