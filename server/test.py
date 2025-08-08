# from autogluon.tabular import TabularDataset, TabularPredictor

# train_data = TabularDataset('./training_data/bigFlows.csv')
# train_data = train_data.drop(columns=['SrcAddr', 'Sport', 'DstAddr', 'Dport', 'Proto'])
# label = 'packets'
# predictor = TabularPredictor(label=label).fit(train_data)

# test_data = TabularDataset('./training_data/combined.csv')

# y_pred = predictor.predict(test_data.drop(columns=[label]))
# predictor.evaluate(test_data, silent=True)
# predictor.leaderboard(test_data)


import docker
import time
import asyncio
import subprocess
from openli import configIp as conf
#docker exec -i -t openli-agency /bin/bash

client = docker.from_env()
coll = client.containers.get("openli-collector")
med = client.containers.get("openli-mediator")
prov = client.containers.get("openli-provisioner")
lea = client.containers.get("openli-agency")

def simulateFlow():
    command1 = """tracereplay -X 10 
    /home/openli-coll/pcaps/staticip.pcap 
    ring:eth2"""
    
    command2 = """tracepktdump -c 1 etsilive:172.19.0.3:41002 > tmpfile.txt"""#hi2
    command2 = """touch tmpfile.txt"""

    command3 = """tracepktdump -c 1 etsilive:172.19.0.3:41003"""#hi3

    exec_result1 = coll.exec_run(command1, demux = False)
    output1 = exec_result1.output.decode()
    exit_code1 = exec_result1.exit_code

    output2 = ""
    exit_code2 = 17
    exec_result2 = lea.exec_run(command2, demux = False)
    # output2 = exec_result2.output.decode()
    exit_code2 = exec_result2.exit_code

    output3 = ""
    exit_code3 = 18
    # exec_result3 = lea.exec_run(command3, stream = True, demux = False)
    # for chunk in exec_result3.output:
    #     output3 += chunk.decode()
    # exit_code3 = exec_result3.exit_code

    # output2, exit_code2 = run_trace_with_timeout(lea, command1)
    # output3, exit_code3 = run_trace_with_timeout(lea, command2)

    return dict(Collector_output = output1, 
         Collector_exit_code = exit_code1, 
         Hi2_output = output2, 
         Hi2_exit_code = exit_code2, 
         Hi3_output = output3, 
         Hi3_exit_code = exit_code3)

def main():
    
    command1 = """tracereplay -X 10 
    /home/openli-coll/pcaps/staticip.pcap 
    ring:eth2"""
    exec_result1 = coll.exec_run(command1, demux = False)
    output1 = exec_result1.output.decode()
    exit_code1 = exec_result1.exit_code
    print(output1)
    print(exit_code1)
    outputfile = "test.txt"
    with open(outputfile, 'w') as f:
        proc = subprocess.Popen(
            ["docker", "exec", "openli-agency", "tracepktdump", "etsilive:172.19.0.3:41003"],
            stdout=f, 
            stderr = subprocess.STDOUT,
            text=True
        )
        try:
            proc.wait()
        except KeyboardInterrupt:
            proc.terminate()

if __name__ == '__main__':

    # conf()
    command1 = """tracereplay -X 10 
    /home/openli-coll/pcaps/staticip.pcap 
    ring:eth2"""
    exec_result1 = coll.exec_run(command1, demux = False)
    # command2 = """tracepktdump etsilive:172.19.0.3:41002 > tmpfile.txt"""#hi2
    # exec_result2 = lea.exec_run(command2, demux = False)
    # lea.exec_run("bash -lc \"pkill -f tracepktdump\"", demux=False)