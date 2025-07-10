import pyshark
import json

def main(inputfile):
    capture = pyshark.FileCapture(input_file=inputfile)
    data = []
    for packet in capture:
        prot = packet.transport_layer
        try:
            if packet.eth.type == '0x0800':#ipv4
                ipv = 'IPv4'
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
                            prot = 'IGMP '
                            temp = packet.igmp.type
                            match temp:
                                case "0x11":
                                    prot += 'MQ'
                                case "0x12":
                                    prot += 'v1 MR'
                                case "0x16":
                                    prot += 'v2 MR'
                                case "0x22":
                                    prot += 'v3 MR'
                                case "0x17":
                                    prot += 'LG'
                                case _:
                                    prot += 'Unknown'
                        else:
                            print("ipv4 none prot, not icmp/igmp")
                            packet.pretty_print()
                            quit
                    case _:
                        print("Unrecognised ipv4 protocol" + prot)
                        packet.pretty_print()
                        quit()
            elif packet.eth.type == '0x86dd':#ipv6
                ipv = 'IPv6'
                source_address = packet.ipv6.src
                destination_address = packet.ipv6.dst
                match prot:
                    case "TCP":
                        pass
                    case "UDP":
                        pass
                    case None:
                        if packet.ipv6.nxt == '58': 
                            prot = 'ICMPv6 '
                            temp = packet.icmpv6.type
                            match temp:
                                case '130':
                                    prot += 'MLD MLQ'
                                case '131':
                                    prot += 'MLD MLR'
                                case '132':
                                    prot += 'MLD MLD'
                                case '133':
                                    prot += 'NDP RS'
                                case '134':
                                    prot += 'NDP RA'
                                case '135':
                                    prot += 'NDP NS'
                                case '136':
                                    prot += 'NDP NA'
                                case '137':
                                    prot += 'NDP RM'
                                case _:
                                    prot += 'Unknown'
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
                ipv = 'IPv4'
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
                ipv = '?'
        except:
            print('malformed packet: ' + packet.eth._ws_expert_message)
        packet_time = packet.sniff_time
        timestamp = packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y")
        
        pct = dict(IP_version = ipv, protocol = prot, source_ip = source_address, destination_ip = destination_address, time = timestamp)
        data.append(pct)
    # with open("packet_data.json", "w") as f:#swap w for a as and when appending
    #     json.dump(data, f, indent=2)
    return data

if __name__ == '__main__':
    main()