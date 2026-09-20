from pandas import DataFrame
import os
import shutil
import tempfile
import traceback


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace

app = FastAPI(title="Facial Recognition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KNOWN_FACES_DIR = os.path.join(os.path.dirname(__file__), "known_faces")

# lower = stricter match 
DISTANCE_THRESHOLD = 0.7


@app.get("/")
def read_root():
    return {"status": "Backend is running"}

#return string for image paths
def _save_temp_file(upload: UploadFile) -> str:
    filename = upload.filename or "upload.jpg"
    suffix = os.path.splitext(filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(upload.file, tmp)
        return tmp.name


@app.post("/api/identify")
async def identify_face(img: UploadFile = File(...)): # parameter comes from a form file upload
    img_path = None
    try:
        img_path = _save_temp_file(img)


        #searches for the identity of an input image from known_faces 
        results = DeepFace.find(
            img_path=img_path,
            db_path=KNOWN_FACES_DIR,
            model_name="Facenet512", # more forigiving so it recognizes webcam and image 
            enforce_detection=True,  # raises ValueError if no face found
            detector_backend="mtcnn",
        )

        matches = results[0]

        #check if objects are same type, if so run code
        if isinstance(matches, list):
            if not matches:
                return {"samePerson": False, "identity": None, "distance": None}
            best_match = matches[0]
        else:
            if matches.empty:
                return {"samePerson": False, "identity": None, "distance": None}
            best_match = matches.iloc[0].to_dict()

        #added this to identify if person is in known_faces and is closely related to a picture in there
        distance = float(best_match["distance"])
        is_match = distance <= DISTANCE_THRESHOLD

        identity_path = str(best_match["identity"])
        identity_name = os.path.splitext(os.path.basename(identity_path))[0]

        return {
            "samePerson": is_match,
            "identity": identity_name if is_match else None,
            "distance": distance,
        }

    # no face detected in the frame
    except ValueError:
        return {"samePerson": False, "identity": None, "distance": None}

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Face identification failed.")

    finally:
        if img_path and os.path.exists(img_path):
            os.remove(img_path)

@app.post("/api/verify")
async def verify_face(reference: UploadFile = File(...), webcam: UploadFile = File(...)):
    reference_path = None
    webcam_path = None
    try:
        reference_path = _save_temp_file(reference)
        webcam_path = _save_temp_file(webcam)

        result = DeepFace.verify(
            img1_path = reference_path,
            img2_path = webcam_path,
            enforce_detection = True,
            detector_backend="mtcnn",
        )

        return {
            "samePerson" : bool(result["verified"]),
            "distance": float(result["distance"]),
            "threshold": float(result["threshold"]),
        }

    except ValueError:
        return{"samePerson": False, "distance": None, "threshold":None}
    except Exception:
        raise HTTPException(status_code=500, detail="Verifaction failed")

    finally: #temp files are deleted even if verify throws an exception
        for p in (reference_path, webcam_path):
            if p and os.path.exists(p):
                os.remove(p)