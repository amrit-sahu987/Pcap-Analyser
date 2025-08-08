#from nfstream import NFStreamer
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import glob
from sklearn.preprocessing import LabelEncoder, MinMaxScaler, RobustScaler, StandardScaler
from sklearn.model_selection import train_test_split
import seaborn as sns
import scipy
import os

"""
optimisations:
- remove na from dataset?? - argus deals with this?
- use robust scaler in preprocessing
- remove outliers using iqr in preprocessing
- cross validate over epochs, batch size, latent space dimension
- implement early stopping
- experiment with dropout and sparsity
- detect number of protocols?? - maybe just account for each new one discovered and adjust accordingly
"""

def combine():
    files = glob.glob('./training_data/sample_traces/*.csv')
    dfs = []

    for file in files:
        if os.path.getsize(file) == 0:
            print(f"Skipping empty file: {file}")
            continue

        try:
            df = pd.read_csv(file)
            dfs.append(df)
        except pd.errors.EmptyDataError:
            print(f"EmptyDataError: skipping file {file}")
        except Exception as e:
            print(f"Error reading {file}: {e}")

    if dfs:
        combined = pd.concat(dfs, ignore_index=True)
        combined.to_csv('./training_data/combined_samples.csv', index=False)
        print("Combined CSV saved successfully.")
    else:
        print("No valid CSV files found to combine.")

def process(inputfile='./training_data/combined_samples.csv'):
    print(inputfile)
    df = pd.read_csv(inputfile)
    df = df.replace('', np.nan).dropna()

    protocols = ['unknown', 'tcp', 'icmp', 'udp', 'arp', 'ipv6', 'ipv6-icmp', 'igmp', 'wlan', 
                'rtp', 'rtcp', 'gre', 'ah', 'mux', 'egp', 'unas', 'sps', 'st2', 'tlsp', 'aris',
                'vines', 'any', 'sat-mon', 'wb-expak', 'pri-enc', 'ip', 'leaf-2', 'cphb','mhrp', 
                'ipip', 'ptp', 'tcf', 'cpnx', 'ipx-n-ip', 'sep', 'sdrp', 'netblt', 'idpr', 
                'etherip', 'mobile', 'aes-sp3-d', 'crudp', 'ddx', 'compaq-peer', 'sctp', 
                'ipv6-opts', 'pvp', 'mtp', 'br-sat-mon', 'dgp', 'gmtp', 'dcn', 'sun-nd', 'isis', 
                'ipcv', 'iso-tp4', 'vrrp', 'ib', 'fire', 'ax.25', 'snp', 'crtp', 'pup', 'ipnip', 
                'larp', 'l2tp', 'qnx', 'pnni', 'iplt', 'encap', 'mfe-nsp', 'fc', '3pc', 'igp', 
                'nsfnet-igp', 'emcon', 'prm', 'wsn', 'kryptolan', 'ipcomp', 'iso-ip', 'micp', 
                'trunk-1', 'il', 'pgm', 'rsvp', 'zero', 'esp', 'xtp', 'ipv6-route', 'ospf', 
                'idrp', 'wb-mon', 'stp', 'vmtp', 'ipv6-no', 'swipe', 'pipe', 'ifmp', 'pim', 
                'irtp', 'ipv6-frag', 'visa', 'uti', 'merit-inp', 'scps', 'xns-idp', 'eigrp', 
                'idpr-cmtp', 'sat-expak', 'ggp', 'skip', 'cftp', 'a/n', 'sm', 'ttp', 'leaf-1', 
                'narp', 'rvd', 'nvp', 'i-nlsp', 'bbn-rcc', 'sprite-rpc', 'iatp', 'srp', 'smp', 
                'xnet', 'ddp', 'tp++', 'ippc', 'argus', 'trunk-2', 'hmp', 'rdp', 'cbt', 
                'sccopmce', 'chaos', 'secure-vmtp', 'bna', 'llc', 'nlb']
    
    # encoder = {proto: idx for idx, proto in enumerate(protocols)}
    # df['Proto_encoded'] = df['Proto'].map(lambda x: encoder.get(x, encoder['unknown']))

    df['Proto'] = df['Proto'].fillna('unknown').apply(lambda x: x if x in protocols else 'unknown')

    df_encoded = pd.get_dummies(df, columns=['Proto'], prefix='Proto', prefix_sep='_')
    expected_cols = {f'Proto_{proto}' for proto in protocols}
    missing_cols = expected_cols - set(df_encoded.columns)
    if missing_cols:
        zeros_df = pd.DataFrame(0, index=df_encoded.index, columns=list(missing_cols))
        df_encoded = pd.concat([df_encoded, zeros_df], axis=1)

    df_encoded.drop(columns=['SrcAddr', 'Sport', 'DstAddr', 'Dport'], inplace=True)

    dur = df_encoded['Dur'].to_numpy().reshape(-1,1)
    df_encoded['Dur'] = StandardScaler().fit_transform(dur)

    totpkts = df_encoded['TotPkts'].to_numpy().reshape(-1,1)
    df_encoded['TotPkts'] = StandardScaler().fit_transform(totpkts)

    totbytes = df_encoded['TotBytes'].to_numpy().reshape(-1,1)
    df_encoded['TotBytes'] = StandardScaler().fit_transform(totbytes)
    
    # continuous_features = df[['Dur', 'TotPkts', 'TotBytes']].to_numpy(dtype='float32')
    # proto_encoded = df['Proto_encoded'].to_numpy(dtype='int32')

    # cont_train, cont_test, proto_train, proto_test = train_test_split(
    #     continuous_features, proto_encoded, test_size=0.3, random_state=42
    # )

    # return (cont_train, proto_train), (cont_test, proto_test)

    # train, test = train_test_split(df.to_numpy(dtype='float32'), test_size=0.2, random_state=42)
    # return train, test
    return df_encoded.to_numpy(dtype='float32')
    
    # x_test, x_val = train_test_split(x_test, test_size=0.5, random_state=42)
    

    # p1, p99 = np.percentile(df['TotBytes'], [1, 99])
    # print(p1, p99)
    # print(df['TotBytes'].describe())
    
    # box plot to show outliers in numberrs of bytes
    # fig, ax = plt.subplots()
    # a = df['TotBytes']
    # ax.boxplot(a, vert = False)
    # plt.show()

    # variable correlation heatmap
    # corr = df.corr()
    # plt.figure(dpi=130)
    # sns.heatmap(df.corr(), annot=True, fmt= '.2f')
    # plt.show()

    # pie chart of protocol distribution
    # plt.pie(df.Proto_encoded.value_counts(), 
    #     labels= ['1', '2', '3', '4', '5', '6'], 
    #     autopct='%.f')
    # plt.title('Proto Proportionality')
    # plt.show()

def main(input1, input2):
    return process(input1), process(input2)


if __name__ == '__main__':
    main('./training_data/combined_samples.csv', './training_data/combined.csv')
      
    # df = pd.read_csv('./training_data/combined.csv')
    
    # print(df['Proto'].unique())
    # numprots = df['Proto'].nunique()
    # print(numprots)