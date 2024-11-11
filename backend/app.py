from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
import os

app = Flask(__name__)

# Load the trained model (Make sure this path is correct)
model_path = 'C:/Users/HP/OneDrive/Desktop/eWasteManagement/backend/trained_model/ewaste_model.h5'
model = tf.keras.models.load_model(model_path)

# Class names (e-waste types)
class_names = ['batteries', 'keyboard', 'mouse', 'microwave', 'mobile', 'pcb', 'printer', 'player', 'television', 'washing_machine'] 

@app.route('/identify-ewaste', methods=['POST'])
def identify_ewaste():
    data = request.get_json()
    img_url = data['imageUrl']
    
    # Fetch the image from URL
    try:
        img_data = requests.get(img_url).content
        img = image.load_img(img_data, target_size=(128, 128))  # Resize image
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0  # Rescale image

        # Make prediction
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions[0])]
        confidence_score = np.max(predictions[0])

        return jsonify({'ewasteTypes': [predicted_class], 'confidence': confidence_score})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
