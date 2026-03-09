def generate_recommendations(root_causes):

    recommendations_map = {

        "temp_mean": "Adjust heating system to maintain optimal temperature range",

        "pressure_mean": "Inspect pressure regulators and stabilize pressure levels",

        "rpm_mean": "Reduce motor speed slightly to match optimal RPM range",

        "power_mean": "Optimize machine load to reduce average energy consumption",

        "power_max": "Investigate sudden power spikes in equipment",

        "power_std": "Stabilize machine load to avoid power fluctuations",

        "vibration_mean": "Check equipment for mechanical imbalance or wear"
    }

    recommendations = []

    for cause in root_causes:

        feature = cause["feature"]

        if feature in recommendations_map:
            recommendations.append(recommendations_map[feature])

    return recommendations