const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const identifyEWaste = async (imagePath) => {
  const [result] = await client.labelDetection(imagePath);
  const labels = result.labelAnnotations;

  // Find the most relevant label
  const category = labels.find((label) => 
    [
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
    ].includes(label.description)
  );

  if (category) {
    return { category: category.description, confidence: category.score * 100 };
  } else {
    return { category: 'Unknown', confidence: 0 };
  }
};
