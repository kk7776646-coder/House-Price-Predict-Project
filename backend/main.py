from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

from model_loader import (
    model,
    scaler,
    feature_names,
    default_features
)


app = FastAPI(
    title="House Price Prediction API",
    description="API for predicting house prices using Machine Learning",
    version="1.0"
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Health Check
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "House Price Prediction API is running"
    }


# -----------------------------
# Prediction Input
# -----------------------------

@app.post("/predict")
def predict_house_price(data: dict):

    # Create DataFrame from default features
    input_data = pd.DataFrame(
        [default_features.values],
        columns=default_features.index
    )

    # -----------------------------
    # Replace user inputs
    # -----------------------------

    values_to_update = {

        "OverallQual": data["OverallQual"],

        "YearBuilt": str(data["YearBuilt"]),

        "YearRemodAdd": str(data["YearRemodAdd"]),

        "TotalBsmtSF": data["TotalBsmtSF"],

        "GrLivArea": data["GrLivArea"],

        "1stFlrSF": data["FirstFloorArea"],

        "GarageArea": data["GarageArea"],

        "GarageCars": data["GarageCars"],

        "FullBath": data["FullBath"],

        "HalfBath": data["HalfBath"],

        "BedroomAbvGr": data["BedroomAbvGr"],

        "TotRmsAbvGrd": data["TotRmsAbvGrd"]
    }


    # -----------------------------
    # Update available features
    # -----------------------------

    for feature, value in values_to_update.items():

        if feature in input_data.columns:

            input_data[feature] = value


    # -----------------------------
    # Exact feature order
    # -----------------------------

    input_data = input_data.reindex(
        columns=feature_names,
        fill_value=0
    )


    # -----------------------------
    # Scaling
    # -----------------------------

    input_scaled = scaler.transform(input_data)


    # -----------------------------
    # Prediction
    # -----------------------------

    prediction = model.predict(input_scaled)[0]


    # -----------------------------
    # Response
    # -----------------------------

    return {
        "success": True,
        "predicted_price": float(prediction)
    }