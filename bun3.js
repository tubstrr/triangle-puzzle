// Setup:
const board = [
	{ side: 'left', value: 'orange,white,red,white' },
	{ side: 'right', value: 'blue,red,green,black' },
	{ side: 'bottom', value: 'green,green,white,green' },
];

const pieces = [
	{
		id: 1,
		color_1: 'red',
		color_2: 'black',
		color_3: 'green',
	},
	{
		id: 2,
		color_1: 'red',
		color_2: 'green',
		color_3: 'white',
	},
	{
		id: 3,
		color_1: 'black',
		color_2: 'orange',
		color_3: 'green',
	},
	{
		id: 4,
		color_1: 'blue',
		color_2: 'orange',
		color_3: 'green',
	},
	{
		id: 5,
		color_1: 'white',
		color_2: 'blue',
		color_3: 'black',
	},
	{
		id: 6,
		color_1: 'white',
		color_2: 'blue',
		color_3: 'black',
	},
	{
		id: 7,
		color_1: 'orange',
		color_2: 'white',
		color_3: 'green',
	},
	{
		id: 8,
		color_1: 'black',
		color_2: 'red',
		color_3: 'green',
	},
	{
		id: 9,
		color_1: 'orange',
		color_2: 'red',
		color_3: 'green',
	},
	{
		id: 10,
		color_1: 'red',
		color_2: 'white',
		color_3: 'orange',
	},
	{
		id: 11,
		color_1: 'orange',
		color_2: 'black',
		color_3: 'blue',
	},
	{
		id: 12,
		color_1: 'white',
		color_2: 'blue',
		color_3: 'blue',
	},
	{
		id: 13,
		color_1: 'black',
		color_2: 'green',
		color_3: 'black',
	},
	{
		id: 14,
		color_1: 'green',
		color_2: 'red',
		color_3: 'black',
	},
	{
		id: 15,
		color_1: 'white',
		color_2: 'green',
		color_3: 'orange',
	},
	{
		id: 16,
		color_1: 'white',
		color_2: 'white',
		color_3: 'blue',
	},
];

// Variables:
const solutions = [];

// Helper functions:
const memoize = (fn) => {
	const cache = {};
	return (...args) => {
		const stringifiedArgs = JSON.stringify(args);
		if (!cache[stringifiedArgs]) {
			cache[stringifiedArgs] = fn(...args);
		}
		return cache[stringifiedArgs];
	};
};

const defragmentPieceColors = memoize((piece) => {
	if (!piece) return ['*', '*', '*'];
	return [piece.color_1, piece.color_2, piece.color_3];
});

const totalOptions = memoize((numberOfPieces, permutationsPerPiece) => {
	return permutationsPerPiece ** numberOfPieces;
});

const getColorCluesByIndex = memoize((index, board) => {
	const clues = ['*', '*', '*'];
	const leftSide = board.find((side) => side.side === 'left');
	const rightSide = board.find((side) => side.side === 'right');
	const bottomSide = board.find((side) => side.side === 'bottom');

	// Actually have borders
	if (index === 0) {
		const leftColor = leftSide.value.split(',')[3];
		const rightColor = rightSide.value.split(',')[0];

		clues[0] = leftColor;
		clues[1] = rightColor;
	}

	if (index === 1) {
		const leftColor = leftSide.value.split(',')[2];

		clues[0] = leftColor;
	}

	if (index === 3) {
		const rightColor = rightSide.value.split(',')[1];

		clues[1] = rightColor;
	}

	if (index === 4) {
		const leftColor = leftSide.value.split(',')[1];

		clues[0] = leftColor;
	}

	if (index === 8) {
		const rightColor = rightSide.value.split(',')[2];
		clues[1] = rightColor;
	}

	if (index === 9) {
		const leftColor = leftSide.value.split(',')[0];
		const bottomColor = bottomSide.value.split(',')[0];

		clues[0] = leftColor;
		clues[2] = bottomColor;
	}

	if (index === 15) {
		const rightColor = rightSide.value.split(',')[3];
		const bottomColor = bottomSide.value.split(',')[3];

		clues[1] = rightColor;
		clues[2] = bottomColor;
	}

	return clues;
});

const doesPieceHaveDuplicateColors = memoize((piece) => {
	const colors = defragmentPieceColors(piece);
	return new Set(colors).size !== 3;
});

const getLeftPieceColor = memoize((index, state, direction = 'up') => {
	let leftColor = '*';
	const leftPiece = state[index];
	const leftColors = defragmentPieceColors(leftPiece);
	const pieceHasDuplicateColors = doesPieceHaveDuplicateColors(leftPiece);

	// Setup the clues for the left piece
	const leftBoardClues = getColorCluesByIndex(index, board);
	const leftPositionalClues = getPositionalCluesByIndex(index, board, state);
	const leftClues = mergeClues(leftBoardClues, leftPositionalClues);

	if (direction === 'up') {
		if (pieceHasDuplicateColors) {
		} else {
			// Find the index of the color that is already in the clues
			const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
			// Get the next color in the array
			leftColor = leftColors[(leftColorIndex + 1) % 3];
		}
	} else {
		if (pieceHasDuplicateColors) {
		} else {
			// Find the index of the color that is already in the clues
			const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
			// Get the previous color in the array
			leftColor = leftColors[(leftColorIndex + 2) % 3];
		}
	}
	return leftColor;
});

const removeTwoColorsFromPiece = memoize((piece, color1, color2) => {
	const colors = defragmentPieceColors(piece);
	const findIndex = (color) => colors.findIndex((pieceColor) => pieceColor === color);
	const index1 = findIndex(color1);
	const index2 = findIndex(color2);
	const removeIndexInArray = (array, index) => array.filter((_, i) => i !== index);
	const newColors = removeIndexInArray(colors, index1);
	const finalColors = removeIndexInArray(newColors, index2);
	return finalColors[0];
});

const getTopPieceColor = memoize((index, state) => {
	let topColor = '*';
	const topPiece = state[index];
	const topColors = defragmentPieceColors(topPiece);
	const pieceHasDuplicateColors = doesPieceHaveDuplicateColors(topPiece);

	// Setup the clues for the top piece
	const topBoardClues = getColorCluesByIndex(index, board);
	const topPositionalClues = getPositionalCluesByIndex(index, board, state);
	const topClues = mergeClues(topBoardClues, topPositionalClues);

	// Have Right Board Edges
	if (index == 0) {
		// Left Color
		const leftColor = board.find((side) => side.side === 'left').value.split(',')[3];
		// Right Color
		const rightColor = board.find((side) => side.side === 'right').value.split(',')[0];
		// remove left and right color from topColors

		topColor = removeTwoColorsFromPiece(topPiece, leftColor, rightColor);
	}

	if (index == 3) {
		// Left color
		// Remove the positionalClues from the topColors
		const leftColor = topColors.filter((color) => !topClues.includes(color))[0];
		// Right color
		const rightColor = board.find((side) => side.side === 'right').value.split(',')[1];
		// remove left and right color from topColors
		topColor = removeTwoColorsFromPiece(topPiece, leftColor, rightColor);
	}

	if (index == 8) {
		// Left color
		const leftColor = topColors.filter((color) => !topClues.includes(color))[0];
		// Right color
		const rightColor = board.find((side) => side.side === 'right').value.split(',')[2];
		// remove left and right color from topColors
		topColor = removeTwoColorsFromPiece(topPiece, leftColor, rightColor);
	}

	return topColor;
});

const getPositionalCluesByIndex = memoize((index, board, state) => {
	if (state.length === 0) return [];
	const clues = ['*', '*', '*'];

	if (index == 2) {
		const leftColor = getLeftPieceColor(1, state);
		const topColor = getTopPieceColor(0, state);

		// console.log(`🍤 ~ getPositionalCluesByIndex ~ leftColor:`, leftColor);
		// console.log(`🍤 ~ getPositionalCluesByIndex ~ topColor:`, topColor);
		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 3) {
		const leftColor = getLeftPieceColor(2, state, 'down');

		clues[0] = leftColor;
	}

	if (index == 5) {
		const topColor = getTopPieceColor(1, state);
		const leftColor = getLeftPieceColor(4, state);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 6) {
		const leftColor = getLeftPieceColor(5, state, 'down');

		clues[0] = leftColor;
	}

	if (index == 7) {
		const leftColor = getLeftPieceColor(6, state, 'down');

		clues[0] = leftColor;
	}

	if (index == 8) {
		const leftColor = getLeftPieceColor(7, state, 'down');
		clues[0] = leftColor;
	}

	if (index == 10) {
		const leftColor = getLeftPieceColor(9, state);
		const topColor = getTopPieceColor(4, state);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 11) {
		const leftColor = getLeftPieceColor(10, state, 'down');

		clues[0] = leftColor;
	}

	if (index == 12) {
		const leftColor = getLeftPieceColor(11, state);
		const topColor = getTopPieceColor(6, state);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 13) {
		const leftColor = getLeftPieceColor(12, state, 'down');

		clues[0] = leftColor;
	}

	if (index == 14) {
		const leftColor = getLeftPieceColor(13, state, 'down');
		const topColor = getTopPieceColor(8, state);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 15) {
		const leftColor = getLeftPieceColor(14, state, 'down');

		clues[0] = leftColor;
	}

	return clues;
});

// Helper functions:
const colorMap = {
	orange: 1,
	white: 2,
	red: 4,
	blue: 8,
	green: 16,
	black: 32,
};

const pieceToBitMask = (piece) => {
	return colorMap[piece.color_1] | colorMap[piece.color_2] | colorMap[piece.color_3];
};

const getBoardClues = (index) => {
	const leftSide = board.find((side) => side.side === 'left');
	const rightSide = board.find((side) => side.side === 'right');
	const bottomSide = board.find((side) => side.side === 'bottom');

	const clues = [0, 0, 0];

	// Actually have borders
	if (index === 0) {
		const leftColor = colorMap[leftSide.value.split(',')[3]];
		const rightColor = colorMap[rightSide.value.split(',')[0]];

		clues[0] = leftColor;
		clues[1] = rightColor;
	}

	if (index === 1) {
		const leftColor = colorMap[leftSide.value.split(',')[2]];

		clues[0] = leftColor;
	}

	if (index === 3) {
		const rightColor = colorMap[rightSide.value.split(',')[1]];

		clues[1] = rightColor;
	}

	if (index === 4) {
		const leftColor = colorMap[leftSide.value.split(',')[1]];

		clues[0] = leftColor;
	}

	if (index === 8) {
		const rightColor = colorMap[rightSide.value.split(',')[2]];
		clues[1] = rightColor;
	}

	if (index === 9) {
		const leftColor = colorMap[leftSide.value.split(',')[0]];
		const bottomColor = colorMap[bottomSide.value.split(',')[0]];

		clues[0] = leftColor;
		clues[2] = bottomColor;
	}

	if (index === 15) {
		const rightColor = colorMap[rightSide.value.split(',')[3]];
		const bottomColor = colorMap[bottomSide.value.split(',')[3]];

		clues[1] = rightColor;
		clues[2] = bottomColor;
	}

	return clues;
};

const getPositionalClues = (index, state) => {
	if (state.length === 0) return [0, 0, 0];
	const clues = [0, 0, 0];

	const getAvailableColors = (pieceIndex) => {
		const piece = state[pieceIndex];
		const pieceMask = pieceToBitMask(piece);
		const boardClues = getBoardClues(pieceIndex);
		const mergedClues = mergeClues(boardClues, getPositionalClues(pieceIndex, state));

		const availableColors = pieceMask & ~(mergedClues[0] | mergedClues[1] | mergedClues[2]);
		return availableColors;
	};

	const getLeftPieceColor = (leftIndex) => {
		const leftPiece = state[leftIndex];
		const leftMask = pieceToBitMask(leftPiece);
		const leftClues = getBoardClues(leftIndex);
		const mergedClues = mergeClues(leftClues, getPositionalClues(leftIndex, state));

		const availableColors = leftMask & ~(mergedClues[0] | mergedClues[1] | mergedClues[2]);
		return availableColors;
	};

	const getTopPieceColor = (topIndex) => {
		const topPiece = state[topIndex];
		const topMask = pieceToBitMask(topPiece);
		const topClues = getBoardClues(topIndex);
		const mergedClues = mergeClues(topClues, getPositionalClues(topIndex, state));

		const availableColors = topMask & ~(mergedClues[0] | mergedClues[1] | mergedClues[2]);
		return availableColors;
	};

	if (index === 2) {
		const leftColor = getLeftPieceColor(1);
		const topColor = getTopPieceColor(0);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index === 3) {
		const leftColor = getLeftPieceColor(2);

		clues[0] = leftColor;
	}

	if (index === 5) {
		const topColor = getTopPieceColor(1);
		const leftColor = getLeftPieceColor(4);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index === 6) {
		const leftColor = getLeftPieceColor(5);

		clues[0] = leftColor;
	}

	if (index === 7) {
		const leftColor = getLeftPieceColor(6);

		clues[0] = leftColor;
	}

	if (index === 8) {
		const leftColor = getLeftPieceColor(7);
		clues[0] = leftColor;
	}

	if (index === 10) {
		const leftColor = getLeftPieceColor(9);
		const topColor = getTopPieceColor(4);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index === 11) {
		const leftColor = getLeftPieceColor(10);

		clues[0] = leftColor;
	}

	if (index === 12) {
		const leftColor = getLeftPieceColor(11);
		const topColor = getTopPieceColor(6);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index === 13) {
		const leftColor = getLeftPieceColor(12);

		clues[0] = leftColor;
	}

	if (index === 14) {
		const leftColor = getLeftPieceColor(13);
		const topColor = getTopPieceColor(8);

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index === 15) {
		const leftColor = getLeftPieceColor(14);

		clues[0] = leftColor;
	}

	return clues;
};

const mergeClues = (boardClues, positionalClues) => {
	const clues = boardClues;

	for (let i = 0; i < 3; i++) {
		if (positionalClues[i] !== 0) {
			clues[i] |= positionalClues[i];
		}
	}

	return clues;
};

// Find the answer:
const findPossiblePieces = (colors, pieces) => {
	return pieces.filter((piece) => {
		const pieceColors = defragmentPieceColors(piece);
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

const validatePiece = (piece, clues) => {
	const pieceMask = pieceToBitMask(piece);
	const hasAllColors = (pieceMask & (clues[0] | clues[1] | clues[2])) === pieceMask;
	if (!hasAllColors) return false;

	const rotatedMasks = [pieceMask, pieceMask << 8, pieceMask << 16];
	const hasValidOrder = rotatedMasks.some(
		(mask) =>
			(mask & clues[0]) === clues[0] && ((mask >> 8) & clues[1]) === clues[1] && ((mask >> 16) & clues[2]) === clues[2]
	);

	return hasValidOrder;
};

// Main Loop:
const mainLoop = (index, state = []) => {
	const boardClues = getBoardClues(index);
	const positionalClues = getPositionalClues(index, state);
	const clues = mergeClues(boardClues, positionalClues);

	const piecesRemaining = pieces.filter((piece) => !state.includes(piece) && validatePiece(piece, clues));

	if (piecesRemaining.length === 0) {
		// No valid pieces left, backtrack
		return;
	}

	if (state.length === 16) {
		// Found a solution
		solutions.push([...state]);
		return;
	}

	for (const piece of piecesRemaining) {
		state.push(piece);
		mainLoop(index + 1, state);
		state.pop();
	}
};

mainLoop(0);

console.log(`Found ${solutions.length} solutions`);
