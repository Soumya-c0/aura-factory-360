import pandas as pd


def find_root_causes(drift_series, top_n=3):

    # Sort drift descending
    sorted_drift = drift_series.sort_values(ascending=False)

    # Top contributors
    top_features = sorted_drift.head(top_n)

    explanations = {
        "temp_mean": "Temperature deviation detected",
        "pressure_mean": "Pressure instability in process",
        "rpm_mean": "Motor speed variation affecting batch",
        "power_mean": "Average power consumption increased",
        "power_max": "Energy spikes detected in equipment",
        "power_std": "Power fluctuations indicate unstable load",
        "vibration_mean": "Possible mechanical vibration issue"
    }

    root_causes = []

    for feature, value in top_features.items():

        explanation = explanations.get(feature, "Unknown cause")

        root_causes.append({
            "feature": feature,
            "drift_percent": float(value),
            "explanation": explanation
        })

    return root_causes