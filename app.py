import io
import numpy as np
import tensorflow as tf
# import tf_keras as keras
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from PIL import Image

# 1. Define the 23 categories (Replace these with your exact Kaggle labels!)
CLASS_NAMES = ['Acne and Rosacea Photos','Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions','Atopic Dermatitis Photos','Bullous Disease Photos','Cellulitis Impetigo and other Bacterial Infections','Eczema Photos', 'Exanthems and Drug Eruptions','Hair Loss Photos Alopecia and other Hair Diseases','Herpes HPV and other STDs Photos','Light Diseases and Disorders of Pigmentation','Lupus and other Connective Tissue diseases','Melanoma Skin Cancer Nevi and Moles','Nail Fungus and other Nail Disease','Poison Ivy Photos and other Contact Dermatitis','Psoriasis pictures Lichen Planus and related diseases','Scabies Lyme Disease and other Infestations and Bites','Seborrheic Keratoses and other Benign Tumors', 'Systemic Disease','Tinea Ringworm Candidiasis and other Fungal Infections','Urticaria Hives','Vascular Tumors', 'Vasculitis Photos', 'Warts Molluscum and other Viral Infections']

# 2. Dictionary to hold our model in memory
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):# --- Startup ---
    print("Loading VGG16 Base Model...")
    ml_models["vgg_base"] = tf.keras.applications.VGG16(weights='imagenet', include_top=False, input_shape=(160, 160, 3))
    
    print("Loading Custom Skin Model...")
    ml_models["skin_model"] = tf.keras.models.load_model(r"results\skin_model_v2_fix_23.keras")
    
    print("All models loaded successfully!")
    yield
    # --- Shutdown ---
    ml_models.clear()

app = FastAPI(lifespan=lifespan)
app.mount("/frontend", StaticFiles(directory="static", html=True), name="static")
def prepare_image(image_bytes):
    """Resizes and formats the image EXACTLY how VGG16 expects it."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((160, 160)) 
    img_array = np.array(img, dtype=np.float32) # Don't divide by 255!
    img_batch = np.expand_dims(img_array, axis=0)
    
    # Let VGG16 do its own mathematical magic
    return tf.keras.applications.vgg16.preprocess_input(img_batch)

@app.post("/predict")
async def predict_skin_condition(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image and preprocess it
        contents = await file.read()
        processed_image = prepare_image(contents)

        # STEP 1: Pass image through VGG16 to extract features
        vgg_model = ml_models["vgg_base"]
        features = vgg_model.predict(processed_image)
        
        # STEP 2: Flatten the (1, 5, 5, 512) features into a 1D array of 12800
        flattened_features = features.reshape(1, -1)

        # STEP 3: Pass the 12800 features into your friend's model
        skin_model = ml_models["skin_model"]
        predictions = skin_model.predict(flattened_features)
        
        # Get the highest probability prediction
        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index])
        predicted_class = CLASS_NAMES[predicted_index]

        return {
            "diagnosis": predicted_class,
            "confidence": round(confidence * 100, 2),
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))