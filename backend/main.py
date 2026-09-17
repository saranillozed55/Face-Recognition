from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Facial Recognition")

# Allow the React dev server (and later, your deployed frontend) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"], # tighten this to your real frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/api/start-button")
async def process_image():
    # face recognition go here
    return {
        "message": "Button was pressed"
    }