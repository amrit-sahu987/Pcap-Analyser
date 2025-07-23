#from nfstream import NFStreamer
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import glob
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
import seaborn as sns
import scipy

"""
optimisations:
- remove na from dataset
- use robust scaler in preprocessing
- remove outliers using iqr in preprocessing
- cross validate over epochs, batch size, latent space dimension
- implement early stopping
- experiment with dropout and sparsity
- detect number of protocols
"""

def combine():
    files = glob.glob('./training_data/wireshark101v2files/*.csv')
    dfs = []

    for file in files:
        df = pd.read_csv(file)
        dfs.append(df)

    combined = pd.concat(dfs, ignore_index=True)
    combined.to_csv('./training_data/combined.csv', index=False)

def main(inputfile='./training_data/bigFlows.csv'):
    df = pd.read_csv(inputfile)
    df['Proto_encoded'] = LabelEncoder().fit_transform(df['Proto'])
    df.drop(columns=['SrcAddr', 'Sport', 'DstAddr', 'Dport', 'Proto'], inplace=True)

    dur = df['Dur'].to_numpy().reshape(-1,1)
    df['Dur'] = MinMaxScaler().fit_transform(dur)

    totpkts = df['TotPkts'].to_numpy().reshape(-1,1)
    df['TotPkts'] = MinMaxScaler().fit_transform(totpkts)

    totbytes = df['TotBytes'].to_numpy().reshape(-1,1)
    df['TotBytes'] = MinMaxScaler().fit_transform(totbytes)

    continuous_features = df[['Dur', 'TotPkts', 'TotBytes']].to_numpy(dtype='float32')
    proto_encoded = df['Proto_encoded'].to_numpy(dtype='int32')

    cont_train, cont_test, proto_train, proto_test = train_test_split(
        continuous_features, proto_encoded, test_size=0.3, random_state=42
    )

    return (cont_train, proto_train), (cont_test, proto_test)
    
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



if __name__ == '__main__':
    main()