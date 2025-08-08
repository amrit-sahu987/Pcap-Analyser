from clustering import main as cluster
from AnomalyDetector import main as detect

if __name__ == '__main__':
    # cl = cluster('./uploads/sample4.pcap')
    cl = cluster('./uploads/sample4.pcap')
    de = detect('./uploads/sample4.pcap')
    print(de)
    print(cl)