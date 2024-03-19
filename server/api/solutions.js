export default defineEventHandler(async (event) => {
	// Setup:
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

	const boardClues = [
		// 0
		{ left: 'white', right: 'blue', bottom: '*' },
		// 1
		{ left: 'red', right: '*', bottom: '*' },
		// 2
		{ left: '*', right: '*', bottom: '*' },
		// 3
		{ left: '*', right: 'red', bottom: '*' },
		// 4
		{ left: 'white', right: '*', bottom: 'blue' },
		// 5
		{ left: 'white', right: '*', bottom: '*' },
		// 6
		{ left: '*', right: '*', bottom: '*' },
		// 7
		{ left: '*', right: '*', bottom: '*' },
		// 8
		{ left: '*', right: '*', bottom: '*' },
		// 9
		{ left: 'orange', right: '*', bottom: 'green' },
		// 10
		{ left: '*', right: '*', bottom: '*' },
		// 11
		{ left: '*', right: '*', bottom: 'green' },
		// 12
		{ left: '*', right: '*', bottom: '*' },
		// 13
		{ left: '*', right: '*', bottom: 'white' },
		// 14
		{ left: '*', right: '*', bottom: '*' },
		// 15
		{ left: '*', right: 'black', bottom: 'green' },
	];

	const pieceDirection = [
		// 0
		'up',
		// ROW
		// 1
		'up',
		// 2
		'down',
		// 3
		'up',
		// ROW
		// 4
		'up',
		// 5
		'down',
		// 6
		'up',
		// 7
		'down',
		// 8
		'up',
		// ROW
		// 9
		'up',
		// 10
		'down',
		// 11
		'up',
		// 12
		'down',
		// 13
		'up',
		// 14
		'down',
		// 15
		'up',
	];

	// Helper functions:
	const getClueColor = (piece, placement) => {
		const { direction, pieceRotation, color_1, color_2, color_3 } = piece;

		const cases = [
			[color_2, color_3, color_1],
			[color_3, color_1, color_2],
		];
		const currentCase = placement === 'left' && direction === 'up' ? 0 : 1;

		return cases[currentCase][pieceRotation];
	};

	const matchColor = (clue, color) => {
		return clue === '*' || clue === color;
	};

	const colorMatchesSequentially = (clues, piece) => {
		const sequentialOrders = [
			[1, 2, 3],
			[2, 3, 1],
			[3, 1, 2],
		];

		return sequentialOrders.map(
			(order) =>
				matchColor(clues.left, piece[`color_${order[0]}`]) &&
				matchColor(clues.right, piece[`color_${order[1]}`]) &&
				matchColor(clues.bottom, piece[`color_${order[2]}`])
		);
	};

	const matchPieceToClues = (piece, clues) => {
		const pieceColors = [piece.color_1, piece.color_2, piece.color_3];
		const hasAllColors = Object.values(clues).every((color) => color === '*' || pieceColors.includes(color));
		if (!hasAllColors) return false;

		const testSequentialOrders = colorMatchesSequentially(clues, piece);
		return testSequentialOrders.includes(true);
	};

	// Main functions:
	const getClues = (index, state) => {
		// Setup clues:
		const clues = { ...boardClues[index] };

		// If the piece has no known neighbors, return the clues:
		const skip = [0, 1, 4, 9];
		if (skip.includes(index)) return clues;

		// Update left and right clues:
		let leftPiece, rightPiece;

		// We always want to check the piece to the left:
		leftPiece = state[index - 1];

		// If the piece is pointing down, we know that there's a piece above it:
		if (pieceDirection[index] === 'down') {
			if (index < 3) rightPiece = state[index - 2];
			else if (index < 8) rightPiece = state[index - 4];
			else rightPiece = state[index - 6];
		}

		// Update clues:
		if (leftPiece) clues.left = getClueColor(leftPiece, 'left');
		if (rightPiece) clues.right = getClueColor(rightPiece, 'right');

		return clues;
	};

	const findPossiblePieces = (clues, pieces) => {
		return pieces.filter((piece) => matchPieceToClues(piece, clues));
	};

	const updatePiece = (piece, clues, mainIndex) => {
		let pieceRotation = 0;

		const testSequentialOrders = colorMatchesSequentially(clues, piece);
		pieceRotation = testSequentialOrders.indexOf(true);

		return {
			...piece,
			direction: pieceDirection[mainIndex],
			pieceRotation,
			index: mainIndex,
		};
	};

	const removeCurrentPiece = (pieces, piece) => {
		return pieces.filter((p) => p.id !== piece.id);
	};

	// Main Loop;
	let solutions = [];

	const main = (index = 0, state = [], piecesRemaining = pieces) => {
		// End condition:
		if (state.length === 16) solutions.push(state);

		// Core Logic:
		const clues = getClues(index, state);
		const possiblePieces = findPossiblePieces(clues, piecesRemaining, index);

		// Handle dead end:
		if (possiblePieces.length === 0 && piecesRemaining.length >= 0) return;

		// Handle what we've learned and go deeper:
		for (let i = 0; i < possiblePieces.length; i++) {
			const piece = updatePiece(possiblePieces[i], clues, index);
			const newPiecesRemaining = removeCurrentPiece(piecesRemaining, piece);

			main(index + 1, [...state, piece], newPiecesRemaining);
		}
	};

	let currentTime = performance.timeOrigin + performance.now();

	main();

	currentTime = performance.timeOrigin + performance.now() - currentTime;

	return {
		time: currentTime + 'ms',
		'solutions.length': solutions.length,
		solutions: solutions,
	};
});
