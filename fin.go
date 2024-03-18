package main

import (
	"fmt"
)

type Piece struct {
	ID        int
	Color1    string
	Color2    string
	Color3    string
	Direction string
	Rotation  int
}

type Clues struct {
	Left   string
	Right  string
	Bottom string
}

var board = []Clues{
	{Left: "white", Right: "blue", Bottom: "*"},
	{Left: "red", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "red", Bottom: "*"},
	{Left: "white", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "green", Bottom: "*"},
	{Left: "orange", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "*"},
	{Left: "*", Right: "*", Bottom: "green"},
	{Left: "*", Right: "*", Bottom: "green"},
	{Left: "*", Right: "*", Bottom: "white"},
	{Left: "*", Right: "black", Bottom: "green"},
}

var pieces = []Piece{
	{ID: 1, Color1: "red", Color2: "black", Color3: "green"},
	{ID: 2, Color1: "red", Color2: "green", Color3: "white"},
	{ID: 3, Color1: "black", Color2: "orange", Color3: "green"},
	{ID: 4, Color1: "blue", Color2: "orange", Color3: "green"},
	{ID: 5, Color1: "white", Color2: "blue", Color3: "black"},
	{ID: 6, Color1: "white", Color2: "blue", Color3: "black"},
	{ID: 7, Color1: "orange", Color2: "white", Color3: "green"},
	{ID: 8, Color1: "black", Color2: "red", Color3: "green"},
	{ID: 9, Color1: "orange", Color2: "red", Color3: "green"},
	{ID: 10, Color1: "red", Color2: "white", Color3: "orange"},
	{ID: 11, Color1: "orange", Color2: "black", Color3: "blue"},
	{ID: 12, Color1: "white", Color2: "blue", Color3: "blue"},
	{ID: 13, Color1: "black", Color2: "green", Color3: "black"},
	{ID: 14, Color1: "green", Color2: "red", Color3: "black"},
	{ID: 15, Color1: "white", Color2: "green", Color3: "orange"},
	{ID: 16, Color1: "white", Color2: "white", Color3: "blue"},
}

var pieceDirection = []string{
	"up",
	"up",
	"down",
	"up",
	"up",
	"down",
	"up",
	"down",
	"up",
	"up",
	"down",
	"up",
	"down",
	"up",
	"down",
	"up",
}

func matchPieceToClues(piece Piece, clues Clues) bool {
	pieceColors := []string{piece.Color1, piece.Color2, piece.Color3}
	hasAllColors := true
	for _, color := range pieceColors {
		if clues.Left != "*" && clues.Left != color && clues.Right != "*" && clues.Right != color && clues.Bottom != "*" && clues.Bottom != color {
			hasAllColors = false
			break
		}
	}
	if !hasAllColors {
		return false
	}
	colorsMatchSequentially := false
	for startIndex := 0; startIndex < 3; startIndex++ {
		sequentialColors := []string{
			pieceColors[startIndex],
			pieceColors[(startIndex+1)%3],
			pieceColors[(startIndex+2)%3],
		}
		if (clues.Left == "*" || clues.Left == sequentialColors[0]) &&
			(clues.Right == "*" || clues.Right == sequentialColors[1]) &&
			(clues.Bottom == "*" || clues.Bottom == sequentialColors[2]) {
			colorsMatchSequentially = true
			break
		}
	}
	return colorsMatchSequentially
}

func updatePieces(pieces []Piece, clues Clues) []Piece {
	updatedPieces := make([]Piece, len(pieces))
	for i, piece := range pieces {
		pieceRotation := 0
		if clues.Left == piece.Color1 && clues.Right == piece.Color2 && clues.Bottom == piece.Color3 {
			pieceRotation = 0
		} else if clues.Left == piece.Color2 && clues.Right == piece.Color3 && clues.Bottom == piece.Color1 {
			pieceRotation = 1
		} else if clues.Left == piece.Color3 && clues.Right == piece.Color1 && clues.Bottom == piece.Color2 {
			pieceRotation = 2
		}
		updatedPieces[i] = Piece{
			ID:        piece.ID,
			Color1:    piece.Color1,
			Color2:    piece.Color2,
			Color3:    piece.Color3,
			Direction: pieceDirection[i],
			Rotation:  pieceRotation,
		}
	}
	return updatedPieces
}

func findPossiblePieces(clues Clues, pieces []Piece) []Piece {
	possiblePieces := make([]Piece, 0)
	for _, piece := range pieces {
		if matchPieceToClues(piece, clues) {
			possiblePieces = append(possiblePieces, piece)
		}
	}
	updatedPieces := updatePieces(possiblePieces, clues)
	return updatedPieces
}

func totalOptions(n, k int) int {
	if k > n {
		return 0
	}
	result := 1
	for i := 0; i < k; i++ {
		result *= (n - i)
		result /= (i + 1)
	}
	return result
}

func main() {
	solutions := make([][]Piece, 0)
	loopCount := 0
	maxLoops := totalOptions(len(pieces), 3)
	var main func(int, []Piece, []Piece)
	main = func(index int, state []Piece, piecesRemaining []Piece) {
		fmt.Printf("There are %d loops remaining\n", maxLoops-loopCount)
		loopCount++
		if len(state) == len(pieces) {
			solutions = append(solutions, state)
			return
		}
		clues := board[index]
		possiblePieces := findPossiblePieces(clues, piecesRemaining)
		if len(possiblePieces) == 0 && len(piecesRemaining) >= 0 {
			return
		}
		for _, piece := range possiblePieces {
			newPiecesRemaining := make([]Piece, 0)
			for _, p := range piecesRemaining {
				if p.ID != piece.ID {
					newPiecesRemaining = append(newPiecesRemaining, p)
				}
			}
			main(index+1, append(state, piece), newPiecesRemaining)
		}
	}
	main(0, []Piece{}, pieces)
	fmt.Printf("There are solutions: %d\n", len(solutions))
	if len(solutions) > 0 {
		fmt.Println("The first solution is:", solutions[0])
	}
}
