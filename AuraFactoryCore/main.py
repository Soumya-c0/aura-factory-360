from src.data_loader import load_datasets
from src.feature_engineering import simulate_batches, aggregate_batch_features
from src.golden_signature import compute_golden_signature

process_df, production_df = load_datasets()

# simulate full telemetry
process_df = simulate_batches(process_df, production_df)

# generate batch features
batch_features = aggregate_batch_features(process_df)

# compute golden signature
golden_signature = compute_golden_signature(batch_features, production_df)

print("Golden Signature:")
print(golden_signature)

from src.drift import calculate_drift

# simulate live batch
live_batch = batch_features.iloc[0]

drift_details, drift_score = calculate_drift(live_batch, golden_signature)

print("\nDrift Details:")
print(drift_details)

print("\nOverall Drift Score:", drift_score)

