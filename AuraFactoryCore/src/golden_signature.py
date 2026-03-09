import pandas as pd

def compute_golden_signature(batch_features, production_df):
    merged = pd.merge(batch_features, production_df, on="Batch_ID")
    golden_batches = merged[
        (merged["Dissolution_Rate"] > 90) &
        (merged["Moisture_Content"] < merged["Moisture_Content"].median()) &
        (merged["power_mean"] < merged["power_mean"].median())
    ]
    golden_signature = golden_batches.drop(columns=["Batch_ID"]).mean()
    return golden_signature

def update_golden_signature(golden_signature, live_quality):
    if live_quality["Dissolution_Rate"] > golden_signature["Dissolution_Rate"]:
        return golden_signature, True
    return golden_signature, False