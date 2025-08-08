import base64
from io import BytesIO
import os
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np
from pyod.models.cof import COF
from autoelbow_rupakbob import autoelbow
from sklearn.neighbors import LocalOutlierFactor
from sklearn.ensemble import IsolationForest
import pandas as pd

from netflow import process
from AnomalyDetector import convert


def main(inputfile, dim=2):
    convert(inputfile)
    base, _ = os.path.splitext(inputfile)
    file = base + '.csv'
    data = process(file)
    print('1')
    k = autoelbow.auto_elbow_search(data)
    print('2')
    kmeans = KMeans(n_clusters=k)#k = 5 for my training datasets
    kmeans.fit(data)
    print('3')
    indices = dist_anomalies(data, kmeans)

    df = pd.read_csv(file)
    df = df.replace('', np.nan).dropna()
    anomalies = []
    for i in indices:
        anomalies.append(df.iloc[i].to_dict())
    return anomalies


    # anomalies = lof_anomalies(data)
    # anomalies = forest_anomalies(data)
    # new_data, new_centres, new_anomalies = dim_reduction(data, kmeans.cluster_centers_, anomalies, dim)
    return indices#, plot(new_data, new_centres, new_anomalies, dim)

def plot(data, centres, anomalies, dim=2):
    if dim == 3:
        x1, y1, z1 = np.hsplit(data, 3)
        x2, y2, z2 = np.hsplit(centres, 3)
        x3, y3, z3 = np.hsplit(anomalies, 3)

        fig = plt.figure()
        ax = fig.add_subplot(projection='3d')
        ax.scatter(x1, y1, z1, label='Data')
        ax.scatter(x2, y2, z2, label='Centres', color='y')
        ax.scatter(x3, y3, z3, label='Anomalies', color='r')
        ax.legend()
    elif dim == 2:
        x1, y1 = np.hsplit(data, 2)
        x2, y2 = np.hsplit(centres, 2)
        x3, y3 = np.hsplit(anomalies, 2)

        fig, ax = plt.subplots()
        ax.scatter(x1, y1, label='Data')
        ax.scatter(x2, y2, label='Centres', color='y')
        ax.scatter(x3, y3, label='Anomalies', color='r')
        ax.legend()
    else:
        print('weird data dim')
        quit()

    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    image_base64 = base64.b64encode(img.read()).decode('utf-8')
    img.close()
    # plt.show()
    return image_base64

def forest_anomalies(data):
    clf = IsolationForest(random_state=42, contamination=0.0001)
    predictions = clf.fit_predict(data)
    anomalies = data[predictions == -1]
    print(len(anomalies))
    return anomalies

def dist_anomalies(data, model):
    distances = np.linalg.norm(data - model.cluster_centers_[model.labels_], axis = 1)
    print('4d')
    threshold = np.mean(distances) + (25 * np.std(distances))
    indices = np.where(distances > threshold)[0]
    anomalies = data[indices]
    # print(indices)
    # print(anomalies)
    # mask = np.isin(data, anomalies, invert=True)
    # data = data[mask]
    # print(len(anomalies))
    return indices
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
def cof_anomalies(data):
    cof = COF(contamination=0.0001, method='fast')
    cof.fit(data)
    print('4c')
    anomalies = data[cof.labels_ == 1]
    print(len(anomalies))
    return anomalies

def lof_anomalies(data):
    clf = LocalOutlierFactor(n_neighbors=5)
    clf.fit_predict(data)
    print('4l')
    anomalies = data[clf.negative_outlier_factor_ < -10]
    print(len(anomalies))
    return anomalies

def dim_reduction(data, centres, anomalies, k=2):
    pca = PCA(n_components=k)
    new_data = pca.fit_transform(data)
    print('5')
    if len(anomalies) > 0:
        new_anomalies = pca.transform(anomalies)
        print('6a')
    else:
        new_anomalies = np.empty(0)
        print('6b')
    new_centres = pca.transform(centres)
    print('7')
    return new_data, new_centres, new_anomalies

if __name__ == '__main__':
    pass
    # use a pcap file here from now on
    # main('./training_data/bigFlows.pcap') 
