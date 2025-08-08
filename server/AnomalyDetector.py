import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import tensorflow as tf
import pickle
import subprocess
import os
import json

from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers, losses
from tensorflow.keras.models import Model
from keras.saving import register_keras_serializable

from netflow import main as input
from netflow import process as proc

@register_keras_serializable()
class AnomalyDetector(Model):
    # def __init__(self, num_proto_categories=14, embedding_dim=2, **kwargs):
    def __init__(self, input_dim, **kwargs):
        super(AnomalyDetector, self).__init__(**kwargs)
        # self.num_proto_categories = num_proto_categories
        # self.embedding_dim = embedding_dim

        # self.embedding = layers.Embedding(
        #     input_dim=num_proto_categories, output_dim=embedding_dim
        # )


        self.encoder = tf.keras.Sequential([
            layers.Dense(64, activation="relu"), 
            layers.Dropout(0.3),
            layers.Dense(32, activation="relu"), 
            layers.Dropout(0.2),
            layers.Dense(8, activation="relu")
        ])

        self.decoder = tf.keras.Sequential([
            layers.Dense(32, activation="relu"), 
            layers.Dropout(0.3),
            layers.Dense(64, activation="relu"), 
            layers.Dropout(0.2),
            layers.Dense(input_dim, activation="tanh")
        ])

        self.batch_size = 64
        self.epochs = 7
        self.input_dim = input_dim

    def get_config(self):
        config = super().get_config()
        config.update({
            "input_dim": self.input_dim
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

    def call(self, inputs):
        # cont_x, proto_x = inputs

        # proto_embedded = self.embedding(proto_x)
        # proto_embedded = tf.reshape(proto_embedded, (-1, proto_embedded.shape[-1]))

        # x = tf.concat([cont_x, proto_embedded], axis=1)

        encoded = self.encoder(inputs)
        decoded = self.decoder(encoded)
        return decoded
    
def prepare_targets(cont_features, proto_indices, embedding_layer):
    proto_embedded = embedding_layer(proto_indices)
    proto_embedded = tf.reshape(proto_embedded, (-1, proto_embedded.shape[-1]))
    targets = tf.concat([cont_features, proto_embedded], axis=1)
    return targets

def predict(model, data):
    with open('threshold.pkl', 'rb') as f:
        threshold = pickle.load(f)
    print(threshold)
    reconstructions = model(data)
    loss = tf.keras.losses.mse(reconstructions, data)
    return reconstructions, tf.math.less(loss, threshold / 20), loss
    return tf.math.less(loss, threshold)
    # return loss and reconstructions too for analysing performance

def train():
    # (cont_train, proto_train), (cont_test, proto_test) = input('./training_data/combined_samples.csv')
    train, test = input('./training_data/combined_samples.csv', './training_data/combined.csv')
    input_dim = train.shape[1]

    # autoencoder = AnomalyDetector(num_proto_categories=14, embedding_dim=2)
    autoencoder = AnomalyDetector(input_dim=input_dim)


    # optimiser = tf.keras.optimizers.Adam(learning_rate=0.0005, clipnorm=1.0)
    autoencoder.compile(optimizer='adam', loss='mse')

    # y_train = prepare_targets(cont_train, proto_train, autoencoder.embedding)
    # y_test = prepare_targets(cont_test, proto_test, autoencoder.embedding)

    autoencoder.fit(
        train, train,
        epochs=autoencoder.epochs,
        batch_size=autoencoder.batch_size,
        validation_data=(test, test),
        shuffle=True
    )

    autoencoder.save('autoencoder.keras')

    reconstructions = autoencoder.predict(test)
    errors = tf.keras.losses.mse(test, reconstructions).numpy()

    threshold = np.mean(errors) + (3 * np.std(errors))
    print(threshold)
    with open('threshold.pkl', 'wb') as f:
        pickle.dump(threshold, f)

def convert(inputfile):
    if not os.path.isfile(inputfile):
        raise FileNotFoundError(f"PCAP file not found: {inputfile}")

    command = ['./generate_flows.sh', inputfile]

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Script failed:\n{e.stderr}")

def main(inputfile):
    # train()
    # return
    convert(inputfile)
    base, _ = os.path.splitext(inputfile)

    model = tf.keras.models.load_model('autoencoder.keras')    

    file = base + '.csv'
    test = proc(file)

    reconstructions, predictions, loss = predict(model, test)

    # reconstructed = model.predict(test)
    # original = prepare_targets(cont_sample, proto_sample, model.embedding).numpy()
    # print(len(np.unique(reconstructed, axis=0)))

    df = pd.read_csv(file)
    df = df.replace('', np.nan).dropna()
    anomalies = []

    t, f = 0, 0
    for j, i in enumerate(predictions):
        if i == True:
            t += 1
        else:
            flow = df.iloc[j].to_dict()
            anomalies.append(flow)
            f += 1
            # print(test[j])
            # print(reconstructions[j])
    print("Normal: ", t)
    print("Anomaly: ", f)

    dfd = pd.DataFrame(loss)
    # print(dfd.describe())

    return anomalies

if __name__ == '__main__':
    # tmp = main('./training_data/bigFlows.csv')
    main('./uploads/sample4.pcap')