class Cell {
    constructor(i, j) {
        this.row = i
        this.col = j
        this.holder = false
        this.player
        this.occupied = false
    }
}

class Grid {
    constructor(row, column, object, ctx) {
        this.rows = row
        this.cols = column
        this.ctx = ctx
        this.grid = []
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = new Array()
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = new object(i, j)
            }
        }
    }
    show() {
        let width = this.ctx.canvas.width
        let height = this.ctx.canvas.height
        //clear the canvas
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0, 0, width, height)

        let cells_width = parseInt(width / this.cols)
        let cells_height = parseInt(height / this.rows)
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                this.ctx.beginPath()
                this.ctx.fillStyle = "white"
                this.ctx.rect(
                    i * cells_width,
                    j * cells_height,
                    cells_width,
                    cells_width
                )
                this.ctx.fill()
                this.ctx.stroke()
            }
        }
    }
    update() {
        let width = this.ctx.canvas.width
        let height = this.ctx.canvas.height
        let cells_width = parseInt(width / this.cols)
        let cells_height = parseInt(height / this.rows)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let cell = this.grid[i][j]
                if (cell.holder) {
                    if (cell.player.name == "x") {
                        this.ctx.beginPath()
                        line(
                            this.ctx,
                            "black",
                            10,
                            i * cells_width,
                            j * cells_height,
                            i * cells_width + cells_width,
                            j * cells_height + cells_height
                        )
                        line(
                            this.ctx,
                            "black",
                            10,
                            i * cells_width + cells_width,
                            j * cells_height,
                            i * cells_width,
                            j * cells_height + cells_height
                        )
                    } else if (cell.player.name == "o") {
                        this.ctx.beginPath()
                        this.ctx.arc(
                            i * cells_width + cells_width / 2,
                            j * cells_height + cells_height / 2,
                            cells_width / 2,
                            0,
                            2 * Math.PI
                        )
                        this.ctx.stroke()
                    }
                }
            }
        }
    }
}

//draw a line on canvas
function line(ctx, stroke, width, x, y, nx, ny) {
    ctx.beginPath()
    ctx.strokeStyle = stroke
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.lineWidth = width
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()
}

class Player {
    constructor(name, grid, ctx) {
        this.name = name
        this.grid = grid
        this.ctx = ctx
        this.tracker = []
    }
    check(a, b) {
        return this.tracker.includes(this.grid.grid[a][b])
    }
    checkWin() {
        let conditions = new Array()
        conditions[0] = this.check(0, 0) && this.check(1, 0) && this.check(2, 0)
        conditions[1] = this.check(0, 0) && this.check(0, 1) && this.check(0, 2)
        conditions[2] = this.check(0, 0) && this.check(1, 1) && this.check(2, 2)
        conditions[3] = this.check(1, 0) && this.check(1, 1) && this.check(1, 2)
        conditions[4] = this.check(2, 0) && this.check(2, 1) && this.check(2, 2)
        conditions[5] = this.check(0, 1) && this.check(1, 1) && this.check(2, 1)
        conditions[6] = this.check(0, 2) && this.check(1, 2) && this.check(2, 2)
        conditions[7] = this.check(0, 2) && this.check(1, 1) && this.check(2, 0)

        let win = false
        for (let i = 0; i < conditions.length; i++) {
            win = win || conditions[i]
        }
        return win
    }
}

//front-end
let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

let number_of_players = 2

let grid = new Grid(3, 3, Cell, ctx)
let player = new Player("x", grid, ctx)
let ai = new Player("o", grid, ctx)
let winner
let win = false
grid.show()
console.log(grid)
const tf = require("@tensorflow/tfjs")

async function loadModel() {
    window.model = await tf.loadLayersModel("./src/model-1a/model.json")
    let input = tf.tensor([[1, 0, 0,1, 1,0,0,1, 1, 0, 0, 0, 0,1,0,0,0,0]])
    let o = model.predict(input)
    console.log(o.arraySync())
}
loadModel()

canvas.onclick = (e) => {
    if (win) {
        console.log("game over")
    } else {
        let x = e.layerX
        let y = e.layerY
        let posI, posJ
        let width = ctx.canvas.width
        let height = ctx.canvas.height
        let cells_width = parseInt(width / grid.cols)
        let cells_height = parseInt(height / grid.rows)
        for (let i = 0; i < grid.rows; i++) {
            for (let j = 0; j < grid.cols; j++) {
                if (x >= i * cells_width && x < i * cells_width + cells_width) {
                    posI = i
                }
                if (
                    y >= j * cells_height &&
                    y < j * cells_height + cells_height
                ) {
                    posJ = j
                }
            }
        }
        document.querySelector(
            ".turn"
        ).innerHTML = `${ai.name.toUpperCase()}-Turn`

        if (!grid.grid[posI][posJ].occupied) {
            grid.grid[posI][posJ].holder = true
            grid.grid[posI][posJ].player = player
            grid.grid[posI][posJ].occupied = true
            player.tracker.push(grid.grid[posI][posJ])
        }else{
            return
        }
        grid.update()
        if (player.checkWin()) {
            console.log(player)
            win = player.checkWin()
            winner = player
            document.querySelector(
                ".turn"
            ).innerHTML = `${winner.name.toUpperCase()}-Win`
            document.querySelector(".reset").disabled = false
        } else {
            playAi()
        }
    }
}

function playAi() {
    // let input = new Array(3).fill(0).map((e) => new Array(3).fill(0))
    // for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //         if (grid.grid[i][j]?.player?.name == "x") input[i][j] = -1
    //         else if (grid.grid[i][j]?.player?.name == "o") input[i][j] = 1
    //     }
    // }
    // input = tf.tensor(input).reshape([1, 9])
    // console.log(input.print())
    let input = new Array(18).fill(0)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let value = 0
            if (grid.grid[i][j]?.player?.name == "x") value = -1
            else if (grid.grid[i][j]?.player?.name == "o") value = 1
            let index = 2*((i * 3) + j)
            if(value == -1) index+=1
            input[index] = value == 0 ? 0 : 1
        }
    }
    input = tf.tensor(input).reshape([1, 18])
    let o = model.predict(input)
    o = o.arraySync()
    o = o[0]
    let [max, index] = [0, 0]
    for (let i = 0; i < 9; i++) {
        if (o[i] > max) [max, index] = [o[i], i]
    }
    let [i, j] = [Math.floor(index / 3), index % 3]
    console.log(index, i, j)
    let [posI, posJ] = [i, j]
    if (!grid.grid[posI][posJ].occupied) {
        grid.grid[posI][posJ].holder = true
        grid.grid[posI][posJ].player = ai
        grid.grid[posI][posJ].occupied = true
        ai.tracker.push(grid.grid[posI][posJ])

        //change turn
        document.querySelector(
            ".turn"
        ).innerHTML = `${player.name.toUpperCase()}-Turn`
        //check if win
        if (ai.checkWin()) {
            console.log(ai)
            win = ai.checkWin()
            winner = ai
            document.querySelector(
                ".turn"
            ).innerHTML = `${winner.name.toUpperCase()}-Win`
            document.querySelector(".reset").disabled = false
        }
        grid.update()
    } else {
        document.querySelector(
            ".turn"
        ).innerHTML = `${player.name.toUpperCase()}-Win`
        document.querySelector(".reset").disabled = false
    }
}

document.querySelector(".reset").onclick = () => {
    grid = new Grid(3, 3, Cell, ctx)
    player = new Player("x", grid, ctx)
    ai = new Player("o", grid, ctx)
    winner = ""
    win = false
    grid.show()
    document.querySelector(".reset").disabled = true
    document.querySelector(".turn").innerHTML = "X-Turn"
}
