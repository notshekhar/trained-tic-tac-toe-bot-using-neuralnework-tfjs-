const fs = require("fs")
const tf = require("@tensorflow/tfjs")
require("tfjs-node-save")

let file = fs.readFileSync("normalized_data-1b.json")
let json = JSON.parse(file)

const { model, modelConv2d } = require("./model")

const { input, output } = json

const [TRAIN_DATA_SIZE, TEST_DATA_SIZE] = [input.length, 1000]

//data
// const data = {
//     xs: tf.tensor(input).reshape([TRAIN_DATA_SIZE, 3, 3, 1]),
//     labels: tf.tensor(output).reshape([TRAIN_DATA_SIZE, 9]),
// }

// // test data
// let [testXs, testYs] = [
//     tf
//         .tensor(input.slice(TRAIN_DATA_SIZE - TEST_DATA_SIZE))
//         .reshape([TEST_DATA_SIZE, 3, 3, 1]),
//     tf
//         .tensor(output.slice(TRAIN_DATA_SIZE - TEST_DATA_SIZE))
//         .reshape([TEST_DATA_SIZE, 9]),
// ]
console.log(input.length, input[0].length, input[0])
const data = {
    xs: tf.tensor(input).reshape([TRAIN_DATA_SIZE, 18]),
    labels: tf.tensor(output).reshape([TRAIN_DATA_SIZE, 9]),
}

// test data
let [testXs, testYs] = [
    tf
        .tensor(input.slice(TRAIN_DATA_SIZE - TEST_DATA_SIZE))
        .reshape([TEST_DATA_SIZE, 18]),
    tf
        .tensor(output.slice(TRAIN_DATA_SIZE - TEST_DATA_SIZE))
        .reshape([TEST_DATA_SIZE, 9]),
]
let counter = 0

const onBatchEnd = (batch, log) => {
    process.stdout.write(
        `batch : ${log.batch} loss: ${log.loss.toFixed(6)} acc: ${log.acc}\r`
    )
}
const onEpochEnd = (epoc, log) => {
    console.log(
        `Epoch : ${counter++} loss: ${log.loss.toFixed(6)} acc: ${log.acc}\r`
    )
}
const onTrainBegin = (logs) => {
    counter = 0
    console.log("training begain")
}
const onTrainEnd = (logs) => {
    console.log("training done")
}

async function saveModel(filename) {
    await model.save("file://./" + filename)
}
// saveModel("model-test")
// modelConv2d
//     .fit(data.xs, data.labels, {
//         batchSize: 100,
//         epochs: 10,
//         shuffle: true,
//         validationData: [testXs, testYs],
//         callbacks: { onTrainBegin, onBatchEnd, onEpochEnd, onTrainEnd },
//     })
//     .then((info) => {
//         console.log("Final accuracy", info.history.acc)
//         saveModel("model-conv2d")
//         let o = model.predict(
//             tf.tensor([-1, 0, 1, 0, -1, 0, 0, 0, 0]).reshape([1, 9])
//         )
//         o.print()
//     })

model
    .fit(data.xs, data.labels, {
        batchSize: 100,
        epochs: 5,
        shuffle: true,
        validationData: [testXs, testYs],
        callbacks: { onTrainBegin, onBatchEnd, onEpochEnd, onTrainEnd },
    })
    .then((info) => {
        console.log("Final accuracy", info.history.acc)
        saveModel("model-1a")
        let o = model.predict(
            tf.tensor([1, 0, 0,1, 1,0,0,1, 1, 0, 0, 0, 0,1,0,0,0,0]).reshape([1, 18])
        )
        o.print()
    })