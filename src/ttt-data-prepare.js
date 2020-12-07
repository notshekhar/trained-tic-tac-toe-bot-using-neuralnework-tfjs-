const fs = require("fs")

let file = fs.readFileSync("./data-1b.json")
let json = JSON.parse(file)

//training data
let data = []

json.forEach((winState) => {
    let state = winState.pastState
    let current = winState
    while (current.pastState) {
        let out = new Array(3).fill(0).map((e) => new Array(3).fill(0))
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (state.state[i][j] !== current.state[i][j]) {
                    out[i][j] = 1
                }
            }
        }
        // y: current.state,
        data.push({
            x: state.state,
            y: out,
        })
        current = state.pastState
        state = current.pastState
    }
})
function shuffleData() {
    console.log("Shuffling data ....")
    let len = data.length
    for (let i = 0; i < len; i++) {
        let random = Math.floor(Math.random() * len)
        let temp = data[i]
        data[i] = data[random]
        data[random] = temp
    }
    console.log("shuffle done")
}

shuffleData()
console.log("normalizing data ...")
let n_data = {
    input: [],
    output: [],
}

for (let i = 0; i < data.length; i++) {
    n_data.input.push(data[i].x)
    n_data.output.push(data[i].y)
}
console.log("normalizing done.")

console.log("writing data into file")

fs.writeFile("normalized_data-1b.json", JSON.stringify(n_data), (err) => {
    return err ? console.log(err) : console.log("done")
})
