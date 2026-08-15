import joblib
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "house_price_model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"
FEATURE_NAMES_PATH = BASE_DIR / "feature_names.pkl"
DEFAULT_FEATURES_PATH = BASE_DIR / "default_features.pkl"


model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
feature_names = joblib.load(FEATURE_NAMES_PATH)
default_features = joblib.load(DEFAULT_FEATURES_PATH)