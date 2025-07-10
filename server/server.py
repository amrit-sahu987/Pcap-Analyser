from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from parser import main as parse_pcap
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET"])
def hello():
    return 'Hello, World?'

@app.route('/upload', methods=['POST'])
def upload_pcap():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    UPLOAD_FOLDER = 'uploads'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        packets = parse_pcap(filepath)  # This should return a list of dicts
        return jsonify(packets)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
