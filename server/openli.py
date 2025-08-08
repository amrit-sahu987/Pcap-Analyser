# import docker
# import time

# #docker exec -i -t openli-agency /bin/bash
# #less /var/log/openli/collector
# client = docker.from_env()
# coll = client.containers.get("openli-collector")
# med = client.containers.get("openli-mediator")
# prov = client.containers.get("openli-provisioner")
# lea = client.containers.get("openli-agency")
# def startAll():
#     try:
#         exec_result = prov.exec_run("service openli-provisioner start", demux = False)
#         output1 = exec_result.output.decode()
#         exit_code1 = exec_result.exit_code

#         exec_result = med.exec_run("service openli-mediator start", demux = False)
#         output2 = exec_result.output.decode()
#         exit_code2 = exec_result.exit_code

#         exec_result = coll.exec_run("service openli-collector start", demux = False)
#         output3 = exec_result.output.decode()
#         exit_code3 = exec_result.exit_code
#         if exit_code1 != 0 or exit_code2 != 0 or exit_code3 != 0:
#             raise Exception("Failed to start processes")
#         else:
#             return dict(
#                 Provisioner_output = output1,
#                 Provisioner_exit_code = exit_code1,
#                 Mediator_output = output2,
#                 Mediator_exit_code = exit_code2,
#                 Collector_output = output3,
#                 Collector_exit_code = exit_code3,
#             )
#     except Exception as e:
#         raise Exception(f"{e}")

# def configIp():
#     try:
#         command = """curl -X POST -H 
#         "Content-Type: application/json" 
#         -d '{"liid": "STATIC002", 
#         "authcc": "NZ", "delivcc": "NZ", 
#         "mediator": 1, "agencyid": "mocklea", 
#         "starttime": 0, "endtime": 0, 
#         "user": "salcock", "accesstype": "fiber", 
#         "staticips": [{"iprange": "10.1.18.217", 
#         "sessionid": 101}]}' 
#         http://172.18.0.2:8080/ipintercept"""

#         exec_result = prov.exec_run(command, demux = False)
#         output = exec_result.output.decode()
#         exit_code = exec_result.exit_code
#         if exit_code != 0:
#             raise Exception("Could not configure IP capture")
#         else:
#             return dict(Provisioner_output = output, Provisioner_exit_code = exit_code)
#     except Exception as e:
#         raise Exception(f"{e}")

# def modifyIp():
#     try:
#         command = """curl -X PUT -H 
#         "Content-Type: application/json" 
#         -d '{"liid": "STATIC002", "staticips": 
#         [{"iprange": "10.1.18.208/28", 
#         "sessionid": 101}, {"iprange": 
#         "2001:db8:abcd:0012::/64", 
#         "sessionid": 888}]}' 
#         http://172.18.0.2:8080/ipintercept"""

#         exec_result = prov.exec_run(command, demux = False)
#         output = exec_result.output.decode()
#         exit_code = exec_result.exit_code
#         if exit_code != 0:
#             raise Exception("Could not modify IP capture")
#         else:
#             return dict(Provisioner_output = output, Provisioner_exit_code = exit_code)
#     except Exception as e:
#         raise Exception(f"{e}")


# def deleteIp():
#     try:
#         command = """curl -X DELETE 
#         http://172.18.0.2:8080/ipintercept/STATIC002"""

#         exec_result = prov.exec_run(command, demux = False)
#         output = exec_result.output.decode()
#         exit_code = exec_result.exit_code
#         if exit_code != 0:
#             raise Exception("Could not delete IP capture")
#         else: 
#             return dict(Provisioner_output = output, Provisioner_exit_code = exit_code)
#     except Exception as e:
#         raise Exception(f"{e}")

# def run_trace_with_timeout(container, cmd, timeout=5):
#     exec_res = container.exec_run(cmd, stream=True, demux=False)
    
#     # stream = exec_res.output  

#     # output = ""
#     # start = time.time()

#     # for chunk in stream:
#     #     decoded = chunk.decode(errors='ignore')
#     #     output += decoded
#     #     if time.time() - start > timeout:
#     #         break

#     check = container.exec_run("bash -lc \"pkill -f tracepktdump\"", demux=False)
#     print(exec_res.exit_code)
#     return check.exit_code

#     # for chunk in stream:
#     #     output += chunk.decode(errors='ignore')

#     # check = container.exec_run("bash -lc \"echo $?\"", demux=True)
#     # exit_code = int(check.output.decode().strip().split()[0]) if check.exit_code == 0 else None

#     return exit_code

# def simulateFlow():
#     command1 = """tracereplay -X 10 
#     /home/openli-coll/pcaps/staticip.pcap 
#     ring:eth2"""
    
#     command2 = """tracepktdump -c 1 etsilive:172.19.0.3:41002"""#hi2

#     command3 = """tracepktdump -c 1 etsilive:172.19.0.3:41003"""#hi3

    

#     exec_result2 = lea.exec_run(command1, stream = True, demux = False)
#     output2 = ""
#     for chunk in exec_result2.output:
#         output2 += chunk.decode()
#     exit_code2 = exec_result2.exit_code

#     exec_result3 = lea.exec_run(command2, stream = True, demux = False)
#     output3 = ""
#     for chunk in exec_result3.output:
#         output3 += chunk.decode()
#     exit_code3 = exec_result3.exit_code

#     exec_result1 = coll.exec_run(command1, demux = False)
#     output1 = exec_result1.output.decode()
#     exit_code1 = exec_result1.exit_code

#     # output2, exit_code2 = run_trace_with_timeout(lea, command1)
#     # output3, exit_code3 = run_trace_with_timeout(lea, command2)

#     return dict(Collector_output = output1, 
#          Collector_exit_code = exit_code1, 
#          Hi2_output = output2, 
#          Hi2_exit_code = exit_code2, 
#          Hi3_output = output3, 
#          Hi3_exit_code = exit_code3)

# def endAll():
#     try:
#         exec_result = prov.exec_run("stop_provisioner.sh", demux = False)
#         output1 = exec_result.output.decode()
#         exit_code1 = exec_result.exit_code

#         exec_result = med.exec_run("stop_mediator.sh", demux = False)
#         output2 = exec_result.output.decode()
#         exit_code2 = exec_result.exit_code

#         exec_result = coll.exec_run("stop_collector.sh", demux = False)
#         output3 = exec_result.output.decode()
#         exit_code3 = exec_result.exit_code

#         if exit_code1 != 0 or exit_code2 != 0 or exit_code3 != 0:
#             raise Exception("Could not terminate processes")
#         else:
#             return dict(
#                 Provisioner_output = output1,
#                 Provisioner_exit_code = exit_code1,
#                 Mediator_output = output2,
#                 Mediator_exit_code = exit_code2,
#                 Collector_output = output3,
#                 Collector_exit_code = exit_code3)
#     except Exception as e:
#         raise Exception(f"{e}")




     
     

