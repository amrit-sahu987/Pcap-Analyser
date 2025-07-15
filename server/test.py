from openai import OpenAI
from parser import main as parse_pcap

client = OpenAI()
filepath = "./uploads/sample5.pcap"
packets = parse_pcap(filepath)

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

print(response.output_text)