import pyshark
import json

"""
def process_tcp(packet):
    print(packet)
    protocol = packet.transport_layer
    source_address = packet.ip.src
    source_port = packet[packet.transport_layer].srcport
    destination_address = packet.ip.dst
    destination_port = packet[packet.transport_layer].dstport 
    packet_time = packet.sniff_time
    packet_timestamp = packet.sniff_timestamp
    print("source_address: " + source_address)
    print("destination_address: " + destination_address)
    print("packet_time: " + packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y"))

def process_udp(packet):
    #print(packet)
    try:
        if hasattr(packet, 'udp') and packet[packet.transport_layer].dstport == '53':
            if packet.dns.qry_name:
                source_address = packet.ip.src
                destination_address = packet.ip.dst
                dns_location = packet.dns.qry_name
                packet_time = packet.sniff_time
                print('Source Address: ' + source_address)
                print('Destination Address: ' + destination_address)
                print('DNS query destination: ' + dns_location)
                print("packet_time: " + packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y"))
            elif packet.dns.resp_name:
                source_address = packet.ip.src
                destination_address = packet.ip.dst
                dns_location = packet.dns.resp_name
                packet_time = packet.sniff_time
                print('Source Address: ' + source_address)
                print('Destination Address: ' + destination_address)
                print('DNS response destination: ' + dns_location)
                print("packet_time: " + packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y"))
        else:
            print(packet)
    except AttributeError as error:
        print(error)


def process_eth(packet):
    if packet.eth.type == '0x0800':
        #ipv4
        try:
            prot = packet.ip.protocol
            source_address = packet.ip.src
            destination_address = packet.ip.dst
            print('Source Address: ' + source_address)
            print('Destination Address: ' + destination_address)
            print("protocol: " + prot)

        except:
            print("here")
    else:
        #ipv6?
        source_address = packet.ipv6.src
        destination_address = packet.ipv6.dst
        prot = "None" # only none?
        # try except finding the prot via packet.ipv6.protocol, if error then default to none
        #packet.pretty_print()
"""

def main(inputfile):
    capture = pyshark.FileCapture(input_file=inputfile)
    data = []
    for packet in capture:
        prot = packet.transport_layer
        try:
            if packet.eth.type == '0x0800':#ipv4
                source_address = packet.ip.src
                destination_address = packet.ip.dst
                match prot:
                    case "TCP":
                        pass
                    case "UDP":
                        pass
                    case None:
                        if packet.ip.proto == '1':
                            prot = 'ICMP'
                        elif packet.ip.proto == '2':
                            prot = 'IGMP'
                        else:
                            print("ipv4 none prot, not icmp/igmp")
                            packet.pretty_print()
                            quit
                    case _:
                        print("Unrecognised ipv4 protocol" + prot)
                        packet.pretty_print()
                        quit()
            elif packet.eth.type == '0x86dd':#ipv6
                source_address = packet.ipv6.src
                destination_address = packet.ipv6.dst
                match prot:
                    case "TCP":
                        pass
                    case "UDP":
                        pass
                    case None:
                        if packet.ipv6.nxt == '58':
                            prot = 'ICMPv6'
                        elif packet.ipv6.nxt == '0':
                            if packet.ipv6.hopopts_nxt == '58':
                                prot = 'ICMPv6 hop'
                            else:
                                print(packet)
                                quit()
                        else:
                            print(packet.ipv6._all_fields)
                            quit()                          
                    case _:
                        print("Unrecognised ipv6 protocol" + prot)
                        packet.pretty_print()
                        quit()
            elif packet.eth.type == '0x0806': #arp
                prot = 'ARP'
                try:
                    source_address = packet.arp.src_proto_ipv4
                    destination_address = packet.arp.dst_proto_ipv4
                except:
                    print("arp packet error")
                    packet.pretty_print()
                    quit()
            else:
                print("ip type???")
        except:
            print('malformed packet: ' + packet.eth._ws_expert_message)
        packet_time = packet.sniff_time
        timestamp = packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y")
        
        pct = dict(protocol = prot, source_ip = source_address, destination_ip = destination_address, time = timestamp)
        data.append(pct)
    # with open("packet_data.json", "w") as f:#swap w for a as and when appending
    #     json.dump(data, f, indent=2)
    return data

# if __name__ == '__main__':
#     main()