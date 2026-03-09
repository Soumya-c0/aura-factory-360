import pandas as pd


def aggregate_batch_features(process_df):

    batch_features = process_df.groupby("Batch_ID").agg({

        "Temperature_C": "mean",
        "Pressure_Bar": "mean",
        "Motor_Speed_RPM": "mean",
        "Power_Consumption_kW": ["mean", "max", "std"],
        "Vibration_mm_s": "mean"

    })

    # flatten column names
    batch_features.columns = [
        "temp_mean",
        "pressure_mean",
        "rpm_mean",
        "power_mean",
        "power_max",
        "power_std",
        "vibration_mean"
    ]

    batch_features = batch_features.reset_index()

    return batch_features

import numpy as np
import pandas as pd


def simulate_batches(process_df, production_df):

    simulated_batches = []

    base_batch = process_df.copy()

    batch_ids = production_df["Batch_ID"].unique()

    for batch in batch_ids:

        temp = base_batch.copy()

        temp["Batch_ID"] = batch

        # add small random variation to simulate real conditions
        temp["Temperature_C"] += np.random.normal(0, 1, len(temp))
        temp["Pressure_Bar"] += np.random.normal(0, 0.05, len(temp))
        temp["Motor_Speed_RPM"] += np.random.normal(0, 20, len(temp))
        temp["Power_Consumption_kW"] += np.random.normal(0, 0.2, len(temp))
        temp["Vibration_mm_s"] += np.random.normal(0, 0.02, len(temp))

        simulated_batches.append(temp)

    full_process_df = pd.concat(simulated_batches, ignore_index=True)

    return full_process_df