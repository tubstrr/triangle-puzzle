// Setup:
const board = [
	// { side: 'left', value: 'orange,white,red,white' },
	// { side: 'right', value: 'blue,red,green,black' },
	// { side: 'bottom', value: 'green,green,white,green' },
	{ side: 'left', value: 'white,red,white' },
	{ side: 'right', value: 'blue,red,green' },
	{ side: 'bottom', value: 'blue,black,green' },
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
	{ left: 'white', right: 'blue', bottom: '*' },
	{ left: 'red', right: '*', bottom: '*' },
	{ left: '*', right: '*', bottom: '*' },
	{ left: '*', right: 'red', bottom: '*' },
	{ left: 'white', right: '*', bottom: 'blue' },
	{ left: '*', right: '*', bottom: '*' },
	{ left: '*', right: '*', bottom: 'black' },
	{ left: '*', right: '*', bottom: '*' },
	{ left: '*', right: 'green', bottom: 'green' },
	{ left: 'orange', right: '*', bottom: '*' },
	{ left: '*', right: '*', bottom: '*' },
	{ left: '*', right: '*', bottom: '*' },
	{ left: '*', right: '*', bottom: 'green' },
	{ left: '*', right: '*', bottom: 'green' },
	{ left: '*', right: '*', bottom: 'white' },
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
		if (rightPiece.pieceRotation === 0) clues.right = rightPiece.color_3;
		if (rightPiece.pieceRotation === 1) clues.right = rightPiece.color_1;
		if (rightPiece.pieceRotation === 2) clues.right = rightPiece.color_2;
	}

	return clues;
};

const getClues = (index, state) => {
	let clues = { ...boardClues[index] };
	const positionalClues = getPositionalClues(index, state);
	if (positionalClues) clues = { ...boardClues[index], ...positionalClues };

	return clues;
};

const matchPieceToClues = (piece, clues) => {
	const pieceColors = [piece.color_1, piece.color_2, piece.color_3];
	const hasAllColors = Object.values(clues).every((color) => color === '*' || pieceColors.includes(color));
	if (!hasAllColors) return false;

	const colorsMatchSequentially = [0, 1, 2].some((startIndex) => {
		const sequentialColors = [
			pieceColors[startIndex],
			pieceColors[(startIndex + 1) % 3],
			pieceColors[(startIndex + 2) % 3],
		];
		return Object.values(clues).every((color, index) => color === '*' || sequentialColors[index] === color);
	});
	if (colorsMatchSequentially) return true;
};

const updatePieces = (pieces, clues, mainIndex) => {
	return pieces
		.map((piece, index) => {
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
			} else {
				// If none of the rotations match, set pieceRotation to -1 to indicate no valid rotation
				pieceRotation = -1;
			}

			return {
				...piece,
				direction: pieceDirection[mainIndex],
				pieceRotation,
			};
		})
		.filter((piece) => piece.pieceRotation !== -1); // Filter out pieces with no valid rotation
};

const findPossiblePieces = (clues, pieces, mainIndex) => {
	return pieces
		.filter((piece) => matchPieceToClues(piece, clues))
		.map((piece) => {
			const pieceColors = [piece.color_1, piece.color_2, piece.color_3];
			const pieceRotation = findMatchingRotation(clues, pieceColors);
			return {
				...piece,
				direction: pieceDirection[mainIndex],
				pieceRotation,
			};
		})
		.filter((piece) => piece.pieceRotation !== -1); // Filter out pieces with no valid rotation
};

// Function to find the matching rotation for a piece based on the clues
const findMatchingRotation = (clues, pieceColors) => {
	for (let rotation = 0; rotation < 3; rotation++) {
		const rotatedColors = rotateColors(pieceColors, rotation);
		if (colorsMatchSequentially(rotatedColors, clues)) {
			return rotation;
		}
	}
	return -1; // No valid rotation found
};

// Function to rotate colors in a piece
const rotateColors = (colors, rotation) => {
	return colors.slice(rotation).concat(colors.slice(0, rotation));
};

// Function to check if the rotated colors match the clues
const colorsMatchSequentially = (rotatedColors, clues) => {
	return Object.values(clues).every((color, index) => color === '*' || rotatedColors[index] === color);
};

// Function to log positional clues for debugging
const logPositionalClues = (index, state) => {
	const clues = getPositionalClues(index, state);
	console.log(`Positional clues for index ${index}:`, clues);
};

// Main Loop;
let solutions = [];
let loopCount = 0;
const maxLoops = totalOptions(pieces.length, 3);
// const maxLoops = 100;

const initialState = Array.from({ length: 3 }, () => Array(3).fill(null));
// Function to display the solution
const displaySolution = (solution) => {
	console.log('Solution:');
	for (let i = 0; i < 3; i++) {
		let row = '';
		for (let j = 0; j < 3; j++) {
			const piece = solution[i][j];
			const colors = piece ? `${piece.color_1}, ${piece.color_2}, ${piece.color_3}` : 'Empty';
			row += `[${colors}] `;
		}
		console.log(row);
	}
};

// Main Loop;
let solutions = [];
let loopCount = 0;
const maxLoops = totalOptions(pieces.length, 3);

const initialState = Array.from({ length: 3 }, () => Array(3).fill(null));
const main = (index = 0, state = initialState, piecesRemaining = pieces) => {
	if (index === 9) {
		solutions.push(state);
		return;
	}

	const rowIndex = Math.floor(index / 3);
	const colIndex = index % 3;

	const currentPiece = state[rowIndex][colIndex];

	if (currentPiece !== null) {
		// If a piece is already placed at this index, move to the next index
		main(index + 1, state, piecesRemaining);
		return;
	}

	logPositionalClues(index, state); // Log positional clues for debugging

	const clues = getClues(index, state);
	const possiblePieces = findPossiblePieces(clues, piecesRemaining, index);

	if (possiblePieces.length === 0 && piecesRemaining.length >= 0) return;

	for (let i = 0; i < possiblePieces.length; i++) {
		const piece = possiblePieces[i];
		const newPiecesRemaining = piecesRemaining.filter((p) => p.id !== piece.id);
		const newState = [...state];
		newState[rowIndex][colIndex] = piece;
		main(index + 1, newState, newPiecesRemaining);
	}

	if (solutions.length > 0) {
		console.log('Solution found:', solutions.length);
		displaySolution(solutions[0]);
	} else {
		console.log('No solutions found.');
	}
};

main();
// const main = (index = 0, state = initialState, piecesRemaining = pieces) => {
// 	if (index === 9) {
// 		solutions.push(state);
// 		return;
// 	}

// 	const rowIndex = Math.floor(index / 3);
// 	const colIndex = index % 3;

// 	const currentPiece = state[rowIndex][colIndex];

// 	if (currentPiece !== null) {
// 		// If a piece is already placed at this index, move to the next index
// 		main(index + 1, state, piecesRemaining);
// 		return;
// 	}

// 	logPositionalClues(index, state); // Log positional clues for debugging

// 	const clues = getClues(index, state);
// 	const possiblePieces = findPossiblePieces(clues, piecesRemaining, index);

// 	if (possiblePieces.length === 0 && piecesRemaining.length >= 0) return;

// 	for (let i = 0; i < possiblePieces.length; i++) {
// 		const piece = possiblePieces[i];
// 		const newPiecesRemaining = piecesRemaining.filter((p) => p.id !== piece.id);
// 		const newState = [...state];
// 		newState[rowIndex][colIndex] = piece;
// 		main(index + 1, newState, newPiecesRemaining);
// 	}
// };

// main();

console.log('There are solutions:', solutions.length);
if (solutions.length > 0) {
	console.log('The first solution is:', solutions[0]);
}
