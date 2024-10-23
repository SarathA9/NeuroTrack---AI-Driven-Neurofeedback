# ml_service/app.py
from flask import Flask, request, jsonify
import numpy as np
from scipy.signal import butter, lfilter
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import joblib
import json
import logging
from datetime import datetime

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load ML models
try:
    focus_model = tf.keras.models.load_model('models/focus_model.h5')
    relaxation_model = tf.keras.models.load_model('models/relaxation_model.h5')
    mindfulness_model = tf.keras.models.load_model('models/mindfulness_model.h5')
    scaler = joblib.load('models/scaler.pkl')
except Exception as e:
    logger.error(f"Error loading models: {e}")
    # Initialize dummy models for development
    focus_model = relaxation_model = mindfulness_model = None
    scaler = StandardScaler()

def butter_bandpass(lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return b, a

def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = lfilter(b, a, data)
    return y

def extract_frequency_bands(eeg_data, fs=256):
    """Extract different frequency bands from EEG data"""
    delta = butter_bandpass_filter(eeg_data, 0.5, 4, fs)
    theta = butter_bandpass_filter(eeg_data, 4, 8, fs)
    alpha = butter_bandpass_filter(eeg_data, 8, 13, fs)
    beta = butter_bandpass_filter(eeg_data, 13, 30, fs)
    gamma = butter_bandpass_filter(eeg_data, 30, 100, fs)
    
    return {
        'delta': np.mean(np.abs(delta)),
        'theta': np.mean(np.abs(theta)),
        'alpha': np.mean(np.abs(alpha)),
        'beta': np.mean(np.abs(beta)),
        'gamma': np.mean(np.abs(gamma))
    }

def calculate_metrics(frequency_bands):
    """Calculate various metrics from frequency bands"""
    metrics = {
        'attention_index': frequency_bands['beta'] / (frequency_bands['alpha'] + frequency_bands['theta']),
        'relaxation_index': frequency_bands['alpha'] / (frequency_bands['beta'] + frequency_bands['theta']),
        'mindfulness_index': frequency_bands['theta'] / frequency_bands['beta'],
        'cognitive_load': frequency_bands['theta'] / frequency_bands['alpha'],
        'neural_coherence': np.mean([frequency_bands['alpha'], frequency_bands['theta']]) / frequency_bands['beta']
    }
    return metrics

def get_feedback_level(score):
    """Determine feedback level based on score"""
    if score >= 0.8:
        return 'good'
    elif score >= 0.6:
        return 'medium'
    return 'low'

@app.route('/process', methods=['POST'])
def process_eeg():
    try:
        data = request.json.get('data')
        raw_eeg = np.array(data['eegData'])
        session_type = data.get('sessionType', 'focus')
        
        # Extract frequency bands
        frequency_bands = extract_frequency_bands(raw_eeg)
        
        # Calculate basic metrics
        metrics = calculate_metrics(frequency_bands)
        
        # Prepare features for ML model
        features = np.array([[
            frequency_bands['delta'],
            frequency_bands['theta'],
            frequency_bands['alpha'],
            frequency_bands['beta'],
            frequency_bands['gamma'],
            metrics['attention_index'],
            metrics['relaxation_index'],
            metrics['cognitive_load']
        ]])
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Get appropriate model prediction
        if session_type == 'focus':
            score = focus_model.predict(scaled_features)[0][0] if focus_model else np.random.random()
        elif session_type == 'relaxation':
            score = relaxation_model.predict(scaled_features)[0][0] if relaxation_model else np.random.random()
        else:  # mindfulness
            score = mindfulness_model.predict(scaled_features)[0][0] if mindfulness_model else np.random.random()
        
        # Prepare response
        response = {
            'timestamp': datetime.now().isoformat(),
            'frequency_bands': frequency_bands,
            'metrics': metrics,
            'score': float(score),
            'feedback_level': get_feedback_level(score),
            'session_type': session_type
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error processing EEG data: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)