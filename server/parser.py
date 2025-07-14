import pyshark
import json

def handle_udp(packet):
    try:
        return packet.dns.qry_name
    except AttributeError:
        try:
            return packet.mdns.dns_ptr_domain_name
        except AttributeError:
            raise

def handle_igmp(packet):
    proto = 'IGMP'
    try:
        igmp_type = packet.igmp.type
        match igmp_type:
            case "0x11":
                proto += ' MQ'
            case "0x12":
                proto += ' v1 MR'
            case "0x16":
                proto += ' v2 MR'
            case "0x22":
                proto += ' v3 MR'
            case _:
                proto += 'Unknown'
    except:
        pass
    
    return proto

def handle_arp(packet):
    ipv = 'IPv4'
    prot = 'ARP'
    try:
        source_address = packet.arp.src_proto_ipv4
        destination_address = packet.arp.dst_proto_ipv4
    except:
        print("arp packet error")
        packet.pretty_print()
    
    return ipv, prot, source_address, destination_address

def handle_ipv4(packet):
    ipv, prot, dest = "IPv4", "?", "?"
    source_address = packet.ip.src
    destination_address = packet.ip.dst
    try:
        prot = packet.transport_layer
        match prot:
            case "TCP":
                pass
            case "UDP":
                try:
                    dest = packet.dns.qry_name
                except:
                    try:
                        dest = packet.mdns.dns_ptr_domain_name
                    except:
                        pass
            case None:
                if packet.ip.proto == '1':
                    prot = 'ICMP'
                elif packet.ip.proto == '2':
                    prot = handle_igmp(packet)
                else:
                    print("ipv4 none prot, not icmp/igmp")
                    packet.pretty_print()
            case _:
                print("ipv4 none prot, not icmp/igmp")
                print(packet)
    except:
        pass
    
    return ipv, prot, source_address, destination_address, dest

def handle_icmpv6(packet):
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
    return prot

def handle_ipv6(packet):
    ipv, prot, dest = "IPv6", "?", "?"
    source_address = packet.ipv6.src
    destination_address = packet.ipv6.dst
    try:
        prot = packet.transport_layer
        match prot:
            case "TCP":
                pass
            case "UDP":
                try:
                    dest = packet.dns.qry_name
                except:
                    try:
                        dest = packet.mdns.dns_ptr_domain_name
                    except:
                        pass
            case None:
                if packet.ipv6.nxt == '58':
                    prot = handle_icmpv6(packet)
                elif packet.ipv6.nxt == '0':
                    if packet.ipv6.hopopts_nxt == '58':
                        prot = 'ICMPv6 hop'
                    else:
                        print("Unknown type of icmpv6 hop")
                        print(packet)
                else:
                    print("Unknown type of ipv6")
                    print(packet.ipv6._all_fields)
                
            case _:
                print("ipv6 none prot, not icmp/igmp")
                print(packet)
    except:
        pass

    return ipv, prot, source_address, destination_address, dest


def parse(packet):
    pct = dict(IP_version = "?", 
               protocol = "?", 
               source_ip = "?", 
               destination_ip = "?",
               destination = "?",
                 time = "?")
    try:
        if packet.eth.type == '0x0800':#ipv4
            pct['IP_version'], pct['protocol'], pct['source_ip'], pct['destination_ip'], pct['protocol'] = handle_ipv4(packet)
        elif packet.eth.type == '0x86dd':#ipv6
            pct['IP_version'], pct['protocol'], pct['source_ip'], pct['destination_ip'], pct['destination'] = handle_ipv6(packet)
        elif packet.eth.type == '0x0806': #arp
            pct['IP_version'], pct['protocol'], pct['source_ip'], pct['destination_ip'] = handle_arp(packet)
        else:
            print("ip type???")
            pct['IP_version'] = packet.eth.type
    except:
        print('malformed packet: ' + packet.eth._ws_expert_message)
        pct['destination'] = packet.eth._ws_expert_message
    
    try:
        pct['protocol'] = packet.transport_layer
    except:
        pass
    
    packet_time = packet.sniff_time
    pct['time'] = packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y")

    return pct

def main(inputfile = "./uploads/sample1.pcap"):
    capture = pyshark.FileCapture(input_file=inputfile)
    data = []
    for packet in capture:
        pct = parse(packet)
        data.append(pct)
    return data


if __name__ == '__main__':
    main()

# def main(inputfile="./uploads/sample5.pcap"):
#     capture = pyshark.FileCapture(input_file=inputfile)
#     data = []
#     for packet in capture:
#         prot = packet.transport_layer
#         print(prot)
#         try:
#             if packet.eth.type == '0x0800':#ipv4
#                 ipv = 'IPv4'
#                 source_address = packet.ip.src
#                 destination_address = packet.ip.dst
#                 match prot:
#                     case "TCP":
#                         pass
#                     case "UDP":
#                         try:
#                             pass
#                             print(packet.dns.qry_name)
#                         except:
#                             try:
#                                 pass
#                                 print(packet.mdns.dns_ptr_domain_name)
#                             except:
#                                 pass
#                     case None:
#                         if packet.ip.proto == '1':
#                             prot = 'ICMP'
#                         elif packet.ip.proto == '2':
#                             prot = 'IGMP '
#                             temp = packet.igmp.type
#                             match temp:
#                                 case "0x11":
#                                     prot += 'MQ'
#                                 case "0x12":
#                                     prot += 'v1 MR'
#                                 case "0x16":
#                                     prot += 'v2 MR'
#                                 case "0x22":
#                                     prot += 'v3 MR'
#                                 case "0x17":
#                                     prot += 'LG'
#                                 case _:
#                                     prot += 'Unknown'
#                         else:
#                             print("ipv4 none prot, not icmp/igmp")
#                             packet.pretty_print()
#                             quit()
#                     case _:
#                         print("Unrecognised ipv4 protocol" + prot)
#                         packet.pretty_print()
#                         quit()
#             elif packet.eth.type == '0x86dd':#ipv6
#                 ipv = 'IPv6'
#                 source_address = packet.ipv6.src
#                 destination_address = packet.ipv6.dst
#                 match prot:
#                     case "TCP":
#                         pass
#                     case "UDP":
#                         try:
#                             pass
#                             print(packet.mdns.dns_ptr_domain_name)
#                         except:
#                             pass
#                     case None:
#                         if packet.ipv6.nxt == '58': 
#                             prot = 'ICMPv6 '
#                             temp = packet.icmpv6.type
#                             match temp:
#                                 case '130':
#                                     prot += 'MLD MLQ'
#                                 case '131':
#                                     prot += 'MLD MLR'
#                                 case '132':
#                                     prot += 'MLD MLD'
#                                 case '133':
#                                     prot += 'NDP RS'
#                                 case '134':
#                                     prot += 'NDP RA'
#                                 case '135':
#                                     prot += 'NDP NS'
#                                 case '136':
#                                     prot += 'NDP NA'
#                                 case '137':
#                                     prot += 'NDP RM'
#                                 case _:
#                                     prot += 'Unknown'
#                         elif packet.ipv6.nxt == '0':
#                             if packet.ipv6.hopopts_nxt == '58':
#                                 prot = 'ICMPv6 hop'
#                             else:
#                                 print("Unknown type of icmpv6 hop")
#                                 print(packet)
#                                 quit()
#                         else:
#                             print("Unknown type of ipv6")
#                             print(packet.ipv6._all_fields)
#                             quit()                          
#                     case _:
#                         print("Unrecognised ipv6 protocol" + prot)
#                         packet.pretty_print()
#                         quit()
#             elif packet.eth.type == '0x0806': #arp
#                 ipv = 'IPv4'
#                 prot = 'ARP'
#                 try:
#                     source_address = packet.arp.src_proto_ipv4
#                     destination_address = packet.arp.dst_proto_ipv4
#                 except:
#                     print("arp packet error")
#                     packet.pretty_print()
#                     quit()
#             else:
#                 print("ip type???")
#                 ipv = '?'
#         except:
#             print('malformed packet: ' + packet.eth._ws_expert_message)
#         packet_time = packet.sniff_time
#         timestamp = packet_time.strftime("%H:%M:%S") + " " + packet_time.strftime("%d/%m/%y")
        
#         pct = dict(IP_version = ipv, protocol = prot, source_ip = source_address, destination_ip = destination_address, time = timestamp)
#         data.append(pct)
#     # with open("packet_data.json", "w") as f:#swap w for a as and when appending
#     #     json.dump(data, f, indent=2)
#     return data

