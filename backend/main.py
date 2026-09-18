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

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

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

        #searches for the identity of an input image within a specificied database
        results = DeepFace.find(
        img_path=img_path,
        db_path=KNOWN_FACES_DIR,
        enforce_detection=True, #raise exception if no face in an image
        detector_backend="mtcnn",
)

        matches = results[0]

        #check if objects are same type, if so run code 
        if isinstance(matches, list):
            print(matches[:5])
        else:
            print(matches.head())

        if isinstance(matches, list):
            if not matches:
                return {"samePerson": False, "identity": None}
            best_match = matches[0]
        else:
            if matches.empty:
                return {"samePerson": False, "identity": None}
            best_match = matches.iloc[0].to_dict()

        identity_path = str(best_match["identity"])
        identity_name = os.path.splitext(os.path.basename(identity_path))[0]

        return {
            "samePerson": True,
            "identity": identity_name,
            "distance": float(best_match["distance"]),
        }

    #if no face detected
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    #default exception
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Face identification failed.")

    finally:
        if img_path and os.path.exists(img_path):
            os.remove(img_path)