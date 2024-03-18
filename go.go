package main

import (
	"encoding/json"
	"fmt"
)

type Board struct {
	Side  string `json:"side"`
	Value string `json:"value"`
}

type Piece struct {
	ID      int    `json:"id"`
	Color1  string `json:"color_1"`
	Color2  string `json:"color_2"`
	Color3  string `json:"color_3"`
}

func memoize(fn func(...interface{}) interface{}) func(...interface{}) interface{} {
	cache := make(map[string]interface{})
	return func(args ...interface{}) interface{} {
		stringifiedArgs, _ := json.Marshal(args)
		if _, ok := cache[string(stringifiedArgs)]; !ok {
			cache[string(stringifiedArgs)] = fn(args...)
		}
		return cache[string(stringifiedArgs)]
	}
}

func defragmentPieceColors(piece Piece) []string {
	return []string{piece.Color1, piece.Color2, piece.Color3}
}

func findPossiblePieces(colors []string, pieces []Piece) []Piece {
	var possiblePieces []Piece
	for _, piece := range pieces {
		pieceColors := defragmentPieceColors(piece)
		hasAllColors := true
		for _, color := range colors {
			if color != "*" && !contains(pieceColors, color) {
				hasAllColors = false
				break
			}
		}
		if !hasAllColors {
			continue
		}
		colorsMatchSequentially := false
		for startIndex := 0; startIndex < 3; startIndex++ {
			sequentialColors := []string{
				pieceColors[startIndex],
				pieceColors[(startIndex+1)%3],
				pieceColors[(startIndex+2)%3],
			}
			colorsMatchSequentially = true
			for index, color := range colors {
				if color != "*" && sequentialColors[index] != color {
					colorsMatchSequentially = false
					break
				}
			}
			if colorsMatchSequentially {
				break
			}
		}
		if colorsMatchSequentially {
			possiblePieces = append(possiblePieces, piece)
		}
	}
	return possiblePieces
}

func getColorCluesByIndex(index int, board []Board) []string {
	clues := []string{"*", "*", "*"}
	leftSide := findSide(board, "left")
	rightSide := findSide(board, "right")
	bottomSide := findSide(board, "bottom")
	if index == 0 {
		leftColor := getColor(leftSide.Value, 3)
		rightColor := getColor(rightSide.Value, 0)
		clues[0] = leftColor
		clues[1] = rightColor
	} else if index == 1 {
		leftColor := getColor(leftSide.Value, 2)
		clues[0] = leftColor
	} else if index == 3 {
		rightColor := getColor(rightSide.Value, 1)
		clues[1] = rightColor
	} else if index == 4 {
		leftColor := getColor(leftSide.Value, 1)
		clues[0] = leftColor
	} else if index == 8 {
		rightColor := getColor(rightSide.Value, 2)
		clues[1] = rightColor
	} else if index == 9 {
		leftColor := getColor(leftSide.Value, 0)
		bottomColor := getColor(bottomSide.Value, 0)
		clues[0] = leftColor
		clues[2] = bottomColor
	} else if index == 15 {
		rightColor := getColor(rightSide.Value, 3)
		bottomColor := getColor(bottomSide.Value, 3)
		clues[1] = rightColor
		clues[2] = bottomColor
	}
	return clues
}

func findSide(board []Board, side string) Board {
	for _, b := range board {
		if b.Side == side {
			return b
		}
	}
	return Board{}
}

func getColor(value string, index int) string {
	colors := split(value, ",")
	if index >= 0 && index < len(colors) {
		return colors[index]
	}
	return ""
}

func split(value string, sep string) []string {
	var result []string
	for _, s := range value {
		result = append(result, string(s))
	}
	return result
}

func getPositionalCluesByIndex(index int, board []Board, state []Piece) []string {
	if len(state) == 0 {
		return []string{"*", "*", "*"}
	}
	clues := []string{"*", "*", "*"}
	if index == 2 {
		topPiece := state[0]
		leftPiece := state[1]
		topColors := defragmentPieceColors(topPiece)
		topClues := getColorCluesByIndex(0, board)
		topColor := findColorNotInClues(topColors, topClues)
		leftColors := defragmentPieceColors(leftPiece)
		leftClues := getColorCluesByIndex(1, board)
		leftColorIndex := findColorIndexInClues(leftColors, leftClues)
		leftColor := leftColors[(leftColorIndex+1)%3]
		clues[0] = leftColor
		clues[1] = topColor
	} else if index == 3 {
		leftPiece := state[2]
		leftColors := defragmentPieceColors(leftPiece)
		leftClues := getPositionalCluesByIndex(2, board, state)
		leftColor := findColorNotInClues(leftColors, leftClues)
		clues[0] = leftColor
	}
	return clues
}

func findColorNotInClues(colors []string, clues []string) string {
	for _, color := range colors {
		if !contains(clues, color) {
			return color
		}
	}
	return ""
}

func findColorIndexInClues(colors []string, clues []string) int {
	for index, color := range colors {
		if contains(clues, color) {
			return index
		}
	}
	return -1
}

func contains(arr []string, value string) bool {
	for _, v := range arr {
		if v == value {
			return true
		}
	}
	return false
}

func mergeClues(boardClues []string, positionalClues []string) []string {
	clues := make([]string, len(boardClues))
	copy(clues, boardClues)
	for i := 0; i < len(positionalClues); i++ {
		if positionalClues[i] != "*" {
			clues[i] = positionalClues[i]
		}
	}
	return clues
}

func mainLoop(index int, board []Board, piecesRemaining []Piece, state []Piece, solutions *[][]Piece) {
	if len(*solutions) >= 1000000000000 {
		return
	}
	elFin := len(piecesRemaining) == 0
	if elFin {
		*solutions = append(*solutions, state)
	}
	boardClues := getColorCluesByIndex(index, board)
	positionalClues := getPositionalCluesByIndex(index, board, state)
	clues := mergeClues(boardClues, positionalClues)
	possiblePieces := findPossiblePieces(clues, piecesRemaining)
	isDeadEnd := len(possiblePieces) == 0
	if isDeadEnd {
		return
	}
	for _, piece := range possiblePieces {
		newState := append([]Piece(nil), state...)
		newState = append(newState, piece)
		newPiecesRemaining := make([]Piece, len(piecesRemaining))
		copy(newPiecesRemaining, piecesRemaining)
		newPiecesRemaining = removePiece(newPiecesRemaining, piece)
		mainLoop(index+1, board, newPiecesRemaining, newState, solutions)
	}
}

func removePiece(pieces []Piece, piece Piece) []Piece {
	var newPieces []Piece
	for _, p := range pieces {
		if p != piece {
			newPieces = append(newPieces, p)
		}
	}
	return newPieces
}

func validateSolution(solution []Piece, pieces []Piece) bool {
	pieceStringSet := make(map[string]bool)
	for _, piece := range pieces {
		pieceString, _ := json.Marshal(piece)
		pieceStringSet[string(pieceString)] = true
	}
	for _, solutionPiece := range solution {
		solutionPieceString, _ := json.Marshal(solutionPiece)
		if _, ok := pieceStringSet[string(solutionPieceString)]; !ok {
			fmt.Println("Duplicate piece found in the solution:", solutionPiece)
			return false
		}
		delete(pieceStringSet, string(solutionPieceString))
	}
	return true
}

func main() {
	board := []Board{
		{Side: "left", Value: "orange,white,red,white"},
		{Side: "right", Value: "blue,red,green,black"},
		{Side: "bottom", Value: "green,green,white,green"},
	}
	pieces := []Piece{
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
	var solutions [][]Piece
	mainLoop(0, board, pieces, []Piece{}, &solutions)
	filteredSolutions := make([][]Piece, 0)
	for _, solution := range solutions {
		if len(solution) >= 15 {
			filteredSolutions = append(filteredSolutions, solution)
		}
	}
	fin := map[string]interface{}{
		"message":         "The answer is 42",
		"true":            false,
		"pieces":          len(pieces),
		"solutions":       len(solutions),
		"validSolutions":  len(filteredSolutions),
	}
	if len(filteredSolutions) > 0 {
		fin["test"] = filteredSolutions[0]
	} else {
		fin["test"] = "No valid solutions found."
	}
	fmt.Println("fin: ", fin)
}


