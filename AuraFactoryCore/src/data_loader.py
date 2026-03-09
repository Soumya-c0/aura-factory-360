import pandas as pd


def load_datasets():

    process_path = "data/_h_batch_process_data.xlsx"
    production_path = "data/_h_batch_production_data.xlsx"

    process_df = pd.read_excel(process_path)
    production_df = pd.read_excel(production_path)

    return process_df, production_df