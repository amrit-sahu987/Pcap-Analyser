import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from parser import main as parse_pcap
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

#api_key = os.environ.get("API_KEY")
load_dotenv()
app = Flask(__name__)
CORS(app)
client = OpenAI()

app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 100
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        packets = parse_pcap(filepath)  # This should return a list of dicts
        message = 'hello'
        try:
            # response = client.responses.create(
            #     model="gpt-4.1",
            #     input=[
            #         {
            #             "role": "developer",
            #             "content": [
            #                 {
            #                     "type": "input_text",
            #                     "text": "Answer concisely, within a few sentences. Ignore the fact that some packets have a question mark as the destination, this is normal."
            #                 }
            #             ]
            #         },
            #         {
            #             "role": "user",
            #             "content": [
            #                 { 
            #                     "type": "input_text", 
            #                     "text": "Can you detect any anomalies in this pcap packet metadata? " + str(packets)
            #                 }
            #             ]
            #         } 
            #     ]
            # )
            # message = response.output_text
            pass
        except:
            message = 'gpt broken'
        return jsonify({
            "message": message,
            "data": packets
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
