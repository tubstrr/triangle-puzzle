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
	'up',

	'up',
	'down',
	'up',

	'up',
	'down',
	'up',
	'down',
	'up',

	'up',
	'down',
	'up',
	'down',
	'up',
	'down',
	'up',
];

const totalOptions = (numberOfPieces, permutationsPerPiece) => {
	return permutationsPerPiece ** numberOfPieces;
};

const getPositionalClues = (index, state) => {
	// Fail safe:
	const failSafe = [0, 1, 4, 9];
	if (failSafe.includes(index)) return null;

	const clues = { ...boardClues[index] };
	let leftPiece, rightPiece;

	if (index === 2) {
		leftPiece = state[1];
		rightPiece = state[0];
	}

	if (index === 3) {
		leftPiece = state[2];
	}

	if (index === 5) {
		leftPiece = state[4];
		rightPiece = state[1];
	}

	if (index === 6) {
		leftPiece = state[5];
	}

	if (index === 7) {
		leftPiece = state[6];
		rightPiece = state[3];
	}

	if (index === 8) {
		leftPiece = state[7];
	}

	if (index === 10) {
		leftPiece = state[9];
		rightPiece = state[4];
	}

	if (index === 11) {
		leftPiece = state[10];
	}

	if (index === 12) {
		leftPiece = state[11];
		rightPiece = state[6];
	}

	if (index === 13) {
		leftPiece = state[12];
	}

	if (index === 14) {
		leftPiece = state[13];
		rightPiece = state[8];
	}

	if (index === 15) {
		leftPiece = state[14];
	}

	if (leftPiece) {
		if (leftPiece.direction === 'up') {
			if (leftPiece.pieceRotation === 0) clues.left = leftPiece.color_2;
			if (leftPiece.pieceRotation === 1) clues.left = leftPiece.color_3;
			if (leftPiece.pieceRotation === 2) clues.left = leftPiece.color_1;
		}
		if (leftPiece.direction === 'down') {
			if (leftPiece.pieceRotation === 0) clues.left = leftPiece.color_3;
			if (leftPiece.pieceRotation === 1) clues.left = leftPiece.color_1;
			if (leftPiece.pieceRotation === 2) clues.left = leftPiece.color_2;
		}
	}

	if (rightPiece) {
		// if (rightPiece.direction === 'up') {
		if (rightPiece.pieceRotation === 0) clues.right = rightPiece.color_3;
		if (rightPiece.pieceRotation === 1) clues.right = rightPiece.color_1;
		if (rightPiece.pieceRotation === 2) clues.right = rightPiece.color_2;
		// }
		// if (rightPiece.direction === 'down') {
		// 	if (rightPiece.pieceRotation === 0) clues.right = rightPiece.color_1;
		// 	if (rightPiece.pieceRotation === 1) clues.right = rightPiece.color_2;
		// 	if (rightPiece.pieceRotation === 2) clues.right = rightPiece.color_3;
		// }
	}

	return clues;
};

const getClues = (index, state) => {
	let clues = { ...boardClues[index] };
	const positionalClues = getPositionalClues(index, state);
	if (positionalClues) clues = { ...positionalClues };

	return clues;
};

const matchPieceToClues = (piece, clues) => {
	const pieceColors = [piece.color_1, piece.color_2, piece.color_3];
	const hasAllColors = Object.values(clues).every((color) => color === '*' || pieceColors.includes(color));
	if (!hasAllColors) return false;

	let colorsMatchSequentially = false;

	if (
		matchColor(clues.left, piece.color_1) &&
		matchColor(clues.right, piece.color_2) &&
		matchColor(clues.bottom, piece.color_3)
	) {
		colorsMatchSequentially = true;
	}

	if (
		matchColor(clues.left, piece.color_2) &&
		matchColor(clues.right, piece.color_3) &&
		matchColor(clues.bottom, piece.color_1)
	) {
		colorsMatchSequentially = true;
	}

	if (
		matchColor(clues.left, piece.color_3) &&
		matchColor(clues.right, piece.color_1) &&
		matchColor(clues.bottom, piece.color_2)
	) {
		colorsMatchSequentially = true;
	}

	return colorsMatchSequentially;
};

const matchColor = (clue, color) => {
	return clue === '*' || clue === color;
};

const updatePieces = (pieces, clues, mainIndex) => {
	return pieces.map((piece, index) => {
		let pieceRotation = 0;

		if (
			matchColor(clues.left, piece.color_1) &&
			matchColor(clues.right, piece.color_2) &&
			matchColor(clues.bottom, piece.color_3)
		) {
			pieceRotation = 0;
		} else if (
			matchColor(clues.left, piece.color_2) &&
			matchColor(clues.right, piece.color_3) &&
			matchColor(clues.bottom, piece.color_1)
		) {
			pieceRotation = 1;
		} else if (
			matchColor(clues.left, piece.color_3) &&
			matchColor(clues.right, piece.color_1) &&
			matchColor(clues.bottom, piece.color_2)
		) {
			pieceRotation = 2;
		}

		return {
			...piece,
			direction: pieceDirection[mainIndex],
			pieceRotation,
			index: mainIndex,
		};
	});
};

const findPossiblePieces = (clues, pieces, mainIndex) => {
	const filteredPieces = pieces.filter((piece) => matchPieceToClues(piece, clues));
	const updatedPieces = updatePieces(filteredPieces, clues, mainIndex);
	return updatedPieces;
};

// Main Loop;
let solutions = [];
let loopCount = 0;
const maxLoops = totalOptions(pieces.length, 3);
// const maxLoops = 100;

const main = (index = 0, state = [], piecesRemaining = pieces) => {
	// console.log(`There are ${(maxLoops - loopCount).toLocaleString()} loops remaining`);
	loopCount++;
	// // Fail safe:
	// if (loopCount >= maxLoops) {
	// 	console.error('Too many loops');
	// 	return;
	// }

	// End condition:
	if (state.length === 16) {
		solutions.push(state);
		// return;
	}

	// Get piece clues:
	const clues = getClues(index, state);

	// Find possible pieces:
	const possiblePieces = findPossiblePieces(clues, piecesRemaining, index);

	// Handle dead end:
	if (possiblePieces.length === 0 && piecesRemaining.length >= 0) return;

	// Handle what we've learned and go deeper:
	for (let i = 0; i < possiblePieces.length; i++) {
		const piece = possiblePieces[i];
		const newPiecesRemaining = piecesRemaining.filter((p) => p.id !== piece.id);
		main(index + 1, [...state, piece], newPiecesRemaining);
	}
};

main();

console.log('There are solutions:', solutions.length);
if (solutions.length > 0) {
	console.log('The first solution is:', solutions[0]);
}
