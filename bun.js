// Setup the board:
const board = [
	{ side: 'left', value: 'orange,white,red,white' },
	{ side: 'right', value: 'blue,red,green,black' },
	{ side: 'bottom', value: 'green,green,white,green' },
];

// Setup the pieces:
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
// Helper functions:
const defragmentPieceColors = memoize((piece) => {
	return [piece.color_1, piece.color_2, piece.color_3];
});

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

// Get clues:
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

// TODO: Make this work
// const getSequentialColors = (pieceColors, color, step = 1) => {};

const getPositionalCluesByIndex = memoize((index, board, state) => {
	if (state.length === 0) return [];
	const clues = ['*', '*', '*'];

	if (index == 2) {
		const topPiece = state[0];
		const leftPiece = state[1];

		// Get the top pieces colors
		const topColors = defragmentPieceColors(topPiece);
		// Recreate the clues for the top piece
		// TODO: We should be able to find a way to not have to recreate the clues
		const topClues = getColorCluesByIndex(0, board);
		// Filter out the color that is already in the clues
		const topColor = topColors.filter((color) => !topClues.includes(color))[0];

		// Get the left pieces colors
		const leftColors = defragmentPieceColors(leftPiece);
		// Recreate the clues for the left piece
		const leftClues = getColorCluesByIndex(1, board);
		// Find the index of the color that is already in the clues
		const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
		// Get the next color in the array
		const leftColor = leftColors[(leftColorIndex + 1) % 3];

		clues[0] = leftColor;
		clues[1] = topColor;
	}

	if (index == 3) {
		const leftPiece = state[2];

		// Get the left pieces colors
		const leftColors = defragmentPieceColors(leftPiece);
		// Recreate the clues for the left piece
		const leftClues = getPositionalCluesByIndex(2, board, state);
		// Filter out the color that is already in the clues
		const leftColor = leftColors.filter((color) => !leftClues.includes(color))[0];

		clues[0] = leftColor;
	}

	// if (index == 5) {
	// 	const topPiece = state[1];
	// 	const leftPiece = state[4];

	// 	// Get the top pieces colors
	// 	const topColors = defragmentPieceColors(topPiece);
	// 	// Recreate the clues for the top piece
	// 	const topClues = getColorCluesByIndex(1, board);
	// 	// Find the index of the color that is already in the clues
	// 	const topColorIndex = topColors.findIndex((color) => topClues.includes(color));
	// 	// Get two colors next in the array
	// 	const topColor = topColors[(topColorIndex + 2) % 3];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getColorCluesByIndex(4, board);
	// 	// Find the index of the color that is already in the clues
	// 	const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
	// 	// Get the next color in the array
	// 	const leftColor = leftColors[(leftColorIndex + 1) % 3];

	// 	clues[0] = leftColor;
	// 	clues[1] = topColor;
	// }

	// if (index == 6) {
	// 	const leftPiece = state[5];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getPositionalCluesByIndex(5, board, state);
	// 	// Filter out the color that is already in the clues
	// 	const leftColor = leftColors.filter((color) => !leftClues.includes(color))[0];

	// 	clues[0] = leftColor;
	// }

	// if (index == 7) {
	// 	const topPiece = state[3];
	// 	const leftPiece = state[6];

	// 	// Get the top pieces colors
	// 	const topColors = defragmentPieceColors(topPiece);
	// 	// Recreate the clues for the top piece
	// 	const topClues = getColorCluesByIndex(3, board);
	// 	// Find the index of the color that is already in the clues
	// 	const topColorIndex = topColors.findIndex((color) => topClues.includes(color));
	// 	// Get two colors next in the array
	// 	const topColor = topColors[(topColorIndex + 2) % 3];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getColorCluesByIndex(6, board);
	// 	// Find the index of the color that is already in the clues
	// 	const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
	// 	// Get the next color in the array
	// 	const leftColor = leftColors[(leftColorIndex + 1) % 3];

	// 	clues[0] = leftColor;
	// 	clues[1] = topColor;
	// }

	// if (index == 10) {
	// 	const topPiece = state[7];
	// 	const leftPiece = state[8];

	// 	// Get the top pieces colors
	// 	const topColors = defragmentPieceColors(topPiece);
	// 	// Recreate the clues for the top piece
	// 	const topClues = getColorCluesByIndex(8, board);
	// 	// Find the index of the color that is already in the clues
	// 	const topColorIndex = topColors.findIndex((color) => topClues.includes(color));
	// 	// Get two colors next in the array
	// 	const topColor = topColors[(topColorIndex + 2) % 3];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getColorCluesByIndex(9, board);
	// 	// Find the index of the color that is already in the clues
	// 	const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
	// 	// Get the next color in the array
	// 	const leftColor = leftColors[(leftColorIndex + 1) % 3];

	// 	clues[0] = leftColor;
	// 	clues[1] = topColor;
	// }

	// if (index == 11) {
	// 	const leftPiece = state[10];
	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getPositionalCluesByIndex(10, board, state);
	// 	// Filter out the color that is already in the clues
	// 	const leftColor = leftColors.filter((color) => !leftClues.includes(color))[0];

	// 	clues[0] = leftColor;
	// }

	// if (index == 12) {
	// 	const topPiece = state[9];
	// 	const leftPiece = state[12];

	// 	// Get the top pieces colors
	// 	const topColors = defragmentPieceColors(topPiece);
	// 	// Recreate the clues for the top piece
	// 	const topClues = getColorCluesByIndex(9, board);
	// 	// Find the index of the color that is already in the clues
	// 	const topColorIndex = topColors.findIndex((color) => topClues.includes(color));
	// 	// Get two colors next in the array
	// 	const topColor = topColors[(topColorIndex + 2) % 3];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getColorCluesByIndex(12, board);
	// 	// Find the index of the color that is already in the clues
	// 	const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
	// 	// Get the next color in the array
	// 	const leftColor = leftColors[(leftColorIndex + 1) % 3];

	// 	clues[0] = leftColor;
	// 	clues[1] = topColor;
	// }

	// if (index == 13) {
	// 	const leftPiece = state[11];
	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getPositionalCluesByIndex(12, board, state);
	// 	// Filter out the color that is already in the clues
	// 	const leftColor = leftColors.filter((color) => !leftClues.includes(color))[0];

	// 	clues[0] = leftColor;
	// }

	// if (index == 14) {
	// 	const topPiece = state[12];
	// 	const leftPiece = state[14];

	// 	// Get the top pieces colors
	// 	const topColors = defragmentPieceColors(topPiece);
	// 	// Recreate the clues for the top piece
	// 	const topClues = getColorCluesByIndex(12, board);
	// 	// Find the index of the color that is already in the clues
	// 	const topColorIndex = topColors.findIndex((color) => topClues.includes(color));
	// 	// Get two colors next in the array
	// 	const topColor = topColors[(topColorIndex + 2) % 3];

	// 	// Get the left pieces colors
	// 	const leftColors = defragmentPieceColors(leftPiece);
	// 	// Recreate the clues for the left piece
	// 	const leftClues = getColorCluesByIndex(14, board);
	// 	// Find the index of the color that is already in the clues
	// 	const leftColorIndex = leftColors.findIndex((color) => leftClues.includes(color));
	// 	// Get the next color in the array
	// 	const leftColor = leftColors[(leftColorIndex + 1) % 3];

	// 	clues[0] = leftColor;
	// 	clues[1] = topColor;
	// }

	return clues;
});

const mergeClues = memoize((boardClues, positionalClues) => {
	const clues = boardClues;

	for (let i = 0; i < positionalClues.length; i++) {
		if (positionalClues[i] !== '*') {
			clues[i] = positionalClues[i];
		}
	}

	return clues;
});

// Main Loop:
const solutions = [];
// const branchExploration = [];

let loop = 0;
const maxLoops = 44000000;
const mainLoop = async (index, board, piecesRemaining, state = []) => {
	if (loop > maxLoops) return ['null'];
	loop++;

	// Stop when we have a solution:
	const elFin = piecesRemaining.length === 0;
	if (elFin) solutions.push(state);

	const boardClues = getColorCluesByIndex(index, board);
	// const clues = getColorCluesByIndex(index, board);
	const positionalClues = getPositionalCluesByIndex(index, board, state);

	const clues = mergeClues(boardClues, positionalClues);
	const possiblePieces = findPossiblePieces(clues, piecesRemaining);

	const isDeadEnd = possiblePieces.length === 0;
	if (isDeadEnd) {
		// If there are no possible pieces, but there are pieces remaining,
		// we need to backtrack:
		// const lastBranch = branchExploration.pop();
		return solutions.push(state);
	}

	// if (possiblePieces.length === 1) {
	// 	console.log(`🍤 ~ mainLoop ~ possiblePieces.length:`, possiblePieces.length);
	// 	state.push(possiblePieces[0]);
	// 	piecesRemaining = piecesRemaining.filter((piece) => piece !== possiblePieces[0]);
	// 	await mainLoop(index + 1, board, piecesRemaining, state);
	// } else {
	// 	// If there are multiple possible pieces, we need to recurse and try each one:
	// 	// branchExploration.push(index);
	// }
	for (let i = 0; i < possiblePieces.length; i++) {
		const newState = [...state, possiblePieces[i]];
		const newPiecesRemaining = piecesRemaining.filter((piece) => piece !== possiblePieces[i]);
		await mainLoop(index + 1, board, newPiecesRemaining, newState);
	}
};

await mainLoop(0, board, pieces);

const filteredSolutions = solutions.filter((solution) => solution.length >= 16);
console.log(`🍤 ~ solutions:`, solutions.length);
console.log('🍤 ~ filteredSolutions: ', filteredSolutions.length);

// // Validate the solution to ensure there are no duplicates
// const validateSolution = (solution, pieces) => {
// 	const pieceStringSet = new Set();
// 	for (const piece of pieces) {
// 		const pieceString = JSON.stringify(piece);
// 		pieceStringSet.add(pieceString);
// 	}

// 	for (const solutionPiece of solution) {
// 		const solutionPieceString = JSON.stringify(solutionPiece);
// 		if (!pieceStringSet.has(solutionPieceString)) {
// 			console.error('Duplicate piece found in the solution:', solutionPiece);
// 			return false;
// 		}
// 		pieceStringSet.delete(solutionPieceString);
// 	}

// 	return true;
// };

// // Call the validation function
// const isSolutionValid = validateSolution(solution, pieces);

const fin = {
	message: 'The answer is 42',
	true: false,
	pieces: pieces.length,
	solutions: solutions.length,
	validSolutions: filteredSolutions.length,
	test: filteredSolutions[0],
};
console.log('fin: ', fin);
