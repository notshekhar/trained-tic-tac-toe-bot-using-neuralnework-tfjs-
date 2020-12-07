const tf = require("@tensorflow/tfjs")

const model = tf.sequential({
    layers: [
        tf.layers.dense({ inputShape: [9], units: 64, activation: "relu" }),
        tf.layers.dense({ units: 9, activation: "softmax" }),
    ],
})
const modelConv2d = tf.sequential({
    layers: [
        tf.layers.conv2d({ inputShape: [3, 3, 1], filters: 21, kernelSize: 1 }),
        tf.layers.flatten(),
        tf.layers.dense({ units: 64, activation: "relu" }),
        tf.layers.dense({ units: 9, activation: "softmax" }),
    ],
})
model.compile({
    optimizer: "sgd",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
})
modelConv2d.compile({
    optimizer: "sgd",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
})

// let input = tf.tensor(
//     [
//         [1, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     [2, 9]
// )
// let output = tf.tensor(
//     [
//         [1, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 1, 0, 0, 0, 0, 0, 0, 0],
//     ],
//     [2, 9]
// )

module.exports = { model, modelConv2d }
