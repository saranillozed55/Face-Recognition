from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Facial Recognition API")

# Allow the React dev server (and later, your deployed frontend) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your real frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/api/process-image")
async def process_image(file: UploadFile = File(...)):
    # Placeholder — this is where your face recognition logic will go later
    contents = await file.read()

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(contents),
        "message": "Image received successfully. Processing logic not yet implemented."
    }