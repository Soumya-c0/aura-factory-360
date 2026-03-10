from fastapi import FastAPI
from src.data_loader import load_datasets
from src.feature_engineering import simulate_batches, aggregate_batch_features
from src.golden_signature import compute_golden_signature
from src.drift import calculate_drift
from src.root_cause import find_root_causes
from src.recommendation_engine import generate_recommendations
from src.golden_signature import update_golden_signature
from src.energy_scheduler import optimize_schedule

app = FastAPI(title="AuraFactoryCore API")
process_df, production_df = load_datasets()
process_df = simulate_batches(process_df, production_df)
batch_features = aggregate_batch_features(process_df)
golden_signature = compute_golden_signature(batch_features, production_df)

@app.get("/")
def home():
    return {"message": "Aura Factory Core API Running"}

@app.get("/get_golden_signature")
def get_golden_signature():
    return golden_signature.to_dict()

@app.get("/optimize_schedule")
def optimize(energy_limit: int = 1000, carbon_limit: int = 500):

    result = optimize_schedule(
        "data/_h_batch_process_data.xlsx",
        energy_limit,
        carbon_limit
    )

    return result

@app.post("/check_drift")
def check_drift(batch_index: int):
    live_batch = batch_features.iloc[batch_index]
    live_quality = production_df.iloc[batch_index]
    drift_details, drift_score = calculate_drift(live_batch, golden_signature)
    root_causes = find_root_causes(drift_details)
    recommendations = generate_recommendations(root_causes)
    updated_signature, improved = update_golden_signature(
        golden_signature,
        live_quality
    )
    return {
    "overall_drift": float(drift_score),
    "feature_drifts": drift_details.to_dict(),
    "root_causes": root_causes,
    "recommendations": recommendations,
    "self_learning_update": improved
}