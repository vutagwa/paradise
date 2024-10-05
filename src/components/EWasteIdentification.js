import React, { useState } from 'react';

const EWasteIdentification = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) return;

    setLoading(true);
    
    // Create FormData to send image to backend
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/identify-ewaste', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setResult({ error: data.message });
      }
    } catch (error) {
      setResult({ error: 'Error processing the image.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>E-Waste Identification</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? 'Identifying...' : 'Identify E-Waste'}
        </button>
      </form>

      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <h3>Identified Category: {result.category}</h3>
              <p>Confidence: {result.confidence}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EWasteIdentification;
