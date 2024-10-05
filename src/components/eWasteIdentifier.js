const fs = require('fs');
const tf = require('@tensorflow/tfjs-node'); // Use the Node.js version

const identifyEWaste = async (imagePath) => {
  // Load the pre-trained model (MobileNet in this case)
  const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v2_1.0_224/model.json');

  // Load the image and preprocess it
  const imageTensor = await tf.node.decodeImage(fs.readFileSync(imagePath)); // Use fs to read the image file
  const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const batchedImage = resizedImage.expandDims(0); // Add batch dimension

  // Make predictions
  const predictions = model.predict(batchedImage);
  const predictedClass = predictions.argMax(-1).dataSync()[0]; // Get the predicted class index

  // Here you would map the predicted index to your e-waste categories
  const categories = [
    'IT and Telecommunications Equipment',
    'Large Household Appliances',
    'Small Household Appliances',
    'Office Equipment',
    'Industrial Equipment',
    'Batteries',
    'Circuit Boards',
    'Medical Equipment',
    'Automotive Electronics',
    'Consumer Electronics'
  ];

  return {
    category: categories[predictedClass],
    confidence: predictions.max().dataSync()[0] * 100 // Get confidence as a percentage
  };
};

module.exports = identifyEWaste; // Export the function for use in other files
