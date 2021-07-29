const fs = require("fs")

let winning_states = []

const Board = function (state, player) {
    this.state = state || new Array(3).fill(0).map((e) => new Array(3).fill(0))
    this.pastState = false
    this.setPastState = (board) => (this.pastState = board)
    this.togglePlayer = () => (this.player = this.player == 1 ? -1 : 1)
    // this.togglePlayer = () => (this.player = this.player == 1 ? 0.5 : 1)
    this.player = player || -1
    // this.player = player || 0.5
    this.copy = function () {
        let newState = []
        this.state.forEach((row) => {
            let arr = []
            row.forEach((el) => {
                arr.push(el)
            })
            newState.push(arr)
        })
        return new Board(newState, this.player)
    }
    this.play = (i, j) => (this.state[i][j] = this.player)
    this.isFull = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.state[i][j] == 0) return false
            }
        }
        return true
    }
    this.isPossible = (i, j) => {
        if (this.state[i][j] == 0) return true
        return false
    }
    this.checkWin = () => {
        return (this.state[0][0] == this.player) &
            (this.state[0][1] == this.player) &
            (this.state[0][2] == this.player) ||
            (this.state[1][0] == this.player) &
                (this.state[1][1] == this.player) &
                (this.state[1][2] == this.player) ||
            (this.state[2][0] == this.player) &
                (this.state[2][1] == this.player) &
                (this.state[2][2] == this.player) ||
            (this.state[0][0] == this.player) &
                (this.state[1][0] == this.player) &
                (this.state[2][0] == this.player) ||
            (this.state[0][1] == this.player) &
                (this.state[1][1] == this.player) &
                (this.state[2][1] == this.player) ||
            (this.state[0][2] == this.player) &
                (this.state[1][2] == this.player) &
                (this.state[2][2] == this.player) ||
            (this.state[0][0] == this.player) &
                (this.state[1][1] == this.player) &
                (this.state[2][2] == this.player) ||
            (this.state[0][2] == this.player) &
                (this.state[1][1] == this.player) &
                (this.state[2][0] == this.player)
            ? true
            : false
    }
}

// using DFS  going to calculate all possible states leading to winning
let board = new Board()

// console.log(board.checkWin())
// base case : if current state win the game
// -1 = opposite player turn
// 1 = our turn
// 0 = empty col

let counter = 0
function storeAll(board) {
    console.log("Storing data...")
    function allPossible(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cb = board.copy()
                if (cb.isPossible(i, j)) {
                    cb.play(i, j)
                    // console.log(cb)
                    if (!cb.checkWin() & !cb.isFull()) {
                        cb.togglePlayer()
                        cb.setPastState(board)
                        allPossible(cb)
                    } else {
                        if (cb.checkWin() && cb.player == 1) {
                            cb.setPastState(board)
                            winning_states.push(cb)
                            console.log(counter++)
                        }
                        break
                    }
                }
            }
        }
    }
    allPossible(board)
    fs.writeFile("data-1b.json", JSON.stringify(winning_states), (err) => {
        console.log(err)
    })
}

storeAll(board)
