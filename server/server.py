import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from parser import main as parse_pcap
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from openli import deleteIp, endAll, modifyIp, simulateFlow, startAll, configIp
from AnomalyDetector import main as detect

#api_key = os.environ.get("API_KEY")
load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
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
            response = client.responses.create(
                model="gpt-4.1",
                input=[
                    {
                        "role": "developer",
                        "content": [
                            {
                                "type": "input_text",
                                "text": "Answer concisely, within a few sentences. Ignore the fact that some packets have a question mark as the destination, this is normal."
                            }
                        ]
                    },
                    {
                        "role": "user",
                        "content": [
                            { 
                                "type": "input_text", 
                                "text": "Can you detect any anomalies in this pcap packet metadata? " + str(packets)
                            }
                        ]
                    } 
                ]
            )
            message = response.output_text
            pass
        except:
            message = 'gpt broken'
        return jsonify({
            "message": message,
            "data": packets
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/open-li/<method>', methods=["GET"])
def openLiSim(method):
    # match method:
    #     # next to each button have an option to see under the hood, which shows the script executed
    #     case "start-all":
    #         try:
    #             result = startAll()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    #     case "config-ip":
    #         try:
    #             result = configIp()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    #     case "modify-ip":
    #         try:
    #             result = modifyIp()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    #     case "delete-ip":
    #         try:
    #             result = deleteIp()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    #     case "sim-flow":
    #         try:
    #             result = simulateFlow()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    #     case "end-all":
    #         try:
    #             result = endAll()
    #             return jsonify(result)
    #         except Exception as e:
    #             return jsonify({'error': str(e)}), 500
    try:
        match method:
            case "start-all":
                result = startAll()
                return jsonify(result)
            case "config-ip":
                result = configIp()
                return jsonify(result)
            case "modify-ip":
                result = modifyIp()
                return jsonify(result)
            case "delete-ip":
                result = deleteIp()
                return jsonify(result)
            case "sim-flow":
                result = simulateFlow()
                return jsonify(result)
            case "end-all":
                result = endAll()
                return jsonify(result)
    except Exception as e:
                return jsonify({'error': str(e)}), 500


@app.route('/anomaly-detection', methods=["GET"])
def anomalyDetection():
    filename = request.args.get('filename')
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    filepath = os.path.join('.', filepath)
    try:
        temp = detect(filepath)
        print(type(temp))
        return jsonify(temp)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


