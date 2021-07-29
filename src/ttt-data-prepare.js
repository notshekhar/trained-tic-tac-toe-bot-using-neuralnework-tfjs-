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
        let inp = new Array(18).fill(0)
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                let value = state.state[i][j]
                let index = 2*((i * 3) + j)
                if(value == -1) index+=1
                inp[index] = value == 0 ? 0 : 1
            }
        }
        data.push({
            // x: state.state,
            x: inp,
            y: out,
        })
        current = state.pastState
        state = current.pastState
    }
})

console.log("normalizing data ...")
let n_data = {
    input: [],
    output: [],
}

for(let j=0; j<5; j++){
    for (let i = 0; i < data.length; i++) {
        n_data.input.push(data[i].x)
        n_data.output.push(data[i].y)
    }
}
console.log("normalizing done.")

function shuffleData() {
    console.log("Shuffling data ....")
    let len = n_data.input.length
    console.log(len)
    for (let i = 0; i < len; i++) {
        let random = Math.floor(Math.random() * len);
        [n_data.input[i], n_data.input[random]] = [n_data.input[random], n_data.input[i]];
        [n_data.output[i], n_data.output[random]] = [n_data.output[random], n_data.output[i]]
    }
    console.log("shuffle done")
}

// shuffleData()
console.log(n_data.input[0], n_data.output[0])
console.log("writing data into file")

fs.writeFile("normalized_data-1b.json", JSON.stringify(n_data), (err) => {
    return err ? console.log(err) : console.log("done")
})
