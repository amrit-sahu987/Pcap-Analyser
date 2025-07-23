import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers, losses
from tensorflow.keras.models import Model

from netflow import main as input

class AnomalyDetector(Model):
    def __init__(self, num_proto_categories=6, embedding_dim=2):
        super(AnomalyDetector, self).__init__()

        self.embedding = layers.Embedding(
            input_dim=num_proto_categories, output_dim=embedding_dim
        )


        self.encoder = tf.keras.Sequential([
            layers.Dense(3, activation="relu"), 
            layers.Dense(2, activation="relu")
        ])

        self.decoder = tf.keras.Sequential([
            layers.Dense(3, activation="relu"), 
            layers.Dense(5, activation="sigmoid")
        ])

        self.batch_size = 128
        self.epochs = 20

    def call(self, inputs):
        cont_x, proto_x = inputs

        proto_embedded = self.embedding(proto_x)
        proto_embedded = tf.reshape(proto_embedded, (-1, proto_embedded.shape[-1]))

        x = tf.concat([cont_x, proto_embedded], axis=1)

        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded
    
def prepare_targets(cont_features, proto_indices, embedding_layer):
    proto_embedded = embedding_layer(proto_indices)
    proto_embedded = tf.reshape(proto_embedded, (-1, proto_embedded.shape[-1]))
    targets = tf.concat([cont_features, proto_embedded], axis=1)
    return targets

def predict(model, data, threshold):
  reconstructions = model(data)
  loss = tf.keras.losses.mae(reconstructions, prepare_targets(data[0], data[1], model.embedding))
  return tf.math.less(loss, threshold)

def main():

    (cont_train, proto_train), (cont_test, proto_test) = input('./training_data/bigFlows.csv')

    autoencoder = AnomalyDetector(num_proto_categories=8, embedding_dim=2)

    autoencoder.compile(optimizer='adam', loss='mae')

    y_train = prepare_targets(cont_train, proto_train, autoencoder.embedding)
    y_test = prepare_targets(cont_test, proto_test, autoencoder.embedding)

    history = autoencoder.fit(
        [cont_train, proto_train], y_train,
        epochs=autoencoder.epochs,
        batch_size=autoencoder.batch_size,
        validation_data=([cont_test, proto_test], y_test),
        shuffle=True
    )

    # plt.plot(history.history["loss"], label="Training Loss")
    # plt.plot(history.history["val_loss"], label="Validation Loss")
    # plt.legend()
    # plt.show()

    threshold = np.mean(history.history["loss"]) + np.std(history.history["loss"])
    (trainx, trainy),(testx, testy) = input('./training_data/combined.csv')
    reconstructions = predict(autoencoder, [trainx, trainy], threshold)
    true_values = prepare_targets(trainx, trainy, autoencoder.embedding)
    # test_loss = tf.keras.losses.mse(true_values, reconstructions)

    # plt.hist(reconstructions, bins=2)
    # plt.show()

    # plt.hist(test_loss[None, :], bins=50)
    # plt.xlabel("Test loss")
    # plt.ylabel("No of examples")
    # plt.show()


if __name__ == '__main__':
    main()