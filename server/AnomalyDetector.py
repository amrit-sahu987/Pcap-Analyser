import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import tensorflow as tf
import pickle

from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers, losses
from tensorflow.keras.models import Model
from keras.saving import register_keras_serializable

from netflow import main as input

@register_keras_serializable()
class AnomalyDetector(Model):
    def __init__(self, num_proto_categories=14, embedding_dim=2, **kwargs):
        super(AnomalyDetector, self).__init__(**kwargs)
        self.num_proto_categories = num_proto_categories
        self.embedding_dim = embedding_dim

        self.embedding = layers.Embedding(
            input_dim=num_proto_categories, output_dim=embedding_dim
        )


        self.encoder = tf.keras.Sequential([
            layers.Dense(3, activation="relu"), 
            layers.Dense(2, activation="relu")
        ])

        self.decoder = tf.keras.Sequential([
            layers.Dense(3, activation="relu"), 
            layers.Dense(embedding_dim + 3, activation="sigmoid")
        ])

        self.batch_size = 128
        self.epochs = 20

    def get_config(self):
        config = super().get_config()
        config.update({
            "num_proto_categories": self.num_proto_categories,
            "embedding_dim": self.embedding_dim,
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

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

def predict(model, data):
  with open('threshold.pkl', 'rb') as f:
    threshold = pickle.load(f)
  reconstructions = model(data)
  loss = tf.keras.losses.mse(reconstructions, prepare_targets(data[0], data[1], model.embedding))
  return tf.math.less(loss, threshold), loss

def train():
    (cont_train, proto_train), (cont_test, proto_test) = input('./training_data/bigFlows.csv')

    autoencoder = AnomalyDetector(num_proto_categories=14, embedding_dim=2)

    autoencoder.compile(optimizer='adam', loss='mae')

    y_train = prepare_targets(cont_train, proto_train, autoencoder.embedding)
    y_test = prepare_targets(cont_test, proto_test, autoencoder.embedding)

    autoencoder.fit(
        [cont_train, proto_train], y_train,
        epochs=autoencoder.epochs,
        batch_size=autoencoder.batch_size,
        validation_data=([cont_test, proto_test], y_test),
        shuffle=True
    )

    autoencoder.save('autoencoder.keras')

    reconstructions = autoencoder.predict([cont_train, proto_train])
    errors = tf.keras.losses.mse(y_train, reconstructions).numpy()

    threshold = np.mean(errors) + (3 * np.std(errors))

    with open('threshold.pkl', 'wb') as f:
        pickle.dump(threshold, f)

def main():

    model = tf.keras.models.load_model('autoencoder.keras')    

    (trainx, trainy),(testx, testy) = input('./training_data/combined.csv')
    predictions, loss = predict(model, [trainx, trainy])

    reconstructed = model.predict([trainx, trainy])
    # original = prepare_targets(cont_sample, proto_sample, model.embedding).numpy()
    print(reconstructed[:5])
    print(len(np.unique(reconstructed, axis=0)))

    t, f = 0, 0
    for i in predictions:
        if i == True:
            t += 1
        else:
            f += 1
    print("Normal: ", t)
    print("Anomaly: ", f)
    print(loss[:100])

if __name__ == '__main__':
    main()