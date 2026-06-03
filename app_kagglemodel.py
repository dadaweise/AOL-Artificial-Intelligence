import io
import numpy as np
import tensorflow as tf
import tf_keras as keras
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from PIL import Image

CLASS_NAMES = ['Acne and Rosacea Photos','Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions','Atopic Dermatitis Photos','Bullous Disease Photos','Cellulitis Impetigo and other Bacterial Infections','Eczema Photos', 'Exanthems and Drug Eruptions','Hair Loss Photos Alopecia and other Hair Diseases','Herpes HPV and other STDs Photos','Light Diseases and Disorders of Pigmentation','Lupus and other Connective Tissue diseases','Melanoma Skin Cancer Nevi and Moles','Nail Fungus and other Nail Disease','Poison Ivy Photos and other Contact Dermatitis','Psoriasis pictures Lichen Planus and related diseases','Scabies Lyme Disease and other Infestations and Bites','Seborrheic Keratoses and other Benign Tumors', 'Systemic Disease','Tinea Ringworm Candidiasis and other Fungal Infections','Urticaria Hives','Vascular Tumors', 'Vasculitis Photos', 'Warts Molluscum and other Viral Infections']

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print("Loading TensorFlow model...")
    # Point this to the FOLDER containing saved_model.pb, not the file itself# Keras 3 method for loading legacy SavedModels for inference
    ml_models["skin_model"] = keras.models.load_model(r"results\my_model")
    print("Model loaded successfully!")
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, replace with your precise frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/frontend", StaticFiles(directory="static", html=True), name="static")

def prepare_image(image_bytes):
    """Resizes and formats the image for the TensorFlow model."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((300, 300))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/predict")
async def predict_skin_condition(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        contents = await file.read()
        processed_image = prepare_image(contents)

        model = ml_models["skin_model"]
        predictions = model.predict(processed_image)[0]
        
        formatted_results = []
        for index, raw_confidence in enumerate(predictions):
            formatted_results.append({
                "condition": CLASS_NAMES[index],
                "confidence": round(float(raw_confidence) * 100, 2)
            })
        
        sorted_results = sorted(formatted_results, key=lambda x: x["confidence"], reverse=True)

        return {
            "filename": file.filename,
            "results": sorted_results[:4]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))