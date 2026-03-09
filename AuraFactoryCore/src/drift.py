import pandas as pd

def calculate_drift(live_batch, golden_signature):

    drift_results = {}

    for feature in golden_signature.index:

        if feature in live_batch:

            golden_value = golden_signature[feature]
            live_value = live_batch[feature]

            if golden_value != 0:
                drift = abs((live_value - golden_value) / golden_value) * 100
                drift_results[feature] = drift

    drift_df = pd.Series(drift_results)

    overall_drift = drift_df.mean()

    return drift_df, overall_drift