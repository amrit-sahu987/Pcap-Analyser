from autogluon.tabular import TabularDataset, TabularPredictor

train_data = TabularDataset('./training_data/bigFlows.csv')
train_data = train_data.drop(columns=['SrcAddr', 'Sport', 'DstAddr', 'Dport', 'Proto'])
label = 'packets'
predictor = TabularPredictor(label=label).fit(train_data)

test_data = TabularDataset('./training_data/combined.csv')

y_pred = predictor.predict(test_data.drop(columns=[label]))
predictor.evaluate(test_data, silent=True)
predictor.leaderboard(test_data)