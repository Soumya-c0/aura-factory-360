import pandas as pd


def prepare_batch_summary(file_path):

    df = pd.read_excel(file_path)

    batch_summary = df.groupby("Batch_ID").agg(
        duration=("Time_Minutes", lambda x: x.max() - x.min()),
        avg_power=("Power_Consumption_kW", "mean")
    ).reset_index()

    batch_summary["energy_kwh"] = (
        batch_summary["duration"] * batch_summary["avg_power"]
    )

    return batch_summary


def add_carbon_estimate(df, emission_factor=0.5):

    df["carbon_output"] = df["energy_kwh"] * emission_factor

    return df


def optimize_schedule(file_path, energy_limit=1000, carbon_limit=500):

    df = prepare_batch_summary(file_path)
    df = add_carbon_estimate(df)

    df = df.sort_values("energy_kwh", ascending=False)

    schedule = []
    total_energy = 0
    total_carbon = 0

    for _, row in df.iterrows():

        if (
            total_energy + row["energy_kwh"] <= energy_limit
            and total_carbon + row["carbon_output"] <= carbon_limit
        ):

            schedule.append(row["Batch_ID"])
            total_energy += row["energy_kwh"]
            total_carbon += row["carbon_output"]

    return {
        "scheduled_batches": schedule,
        "total_energy": total_energy,
        "total_carbon": total_carbon
    }