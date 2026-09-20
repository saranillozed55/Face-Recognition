# Facial Recognition 
A facial recognition application for SCE(Software and Compute Engineering) club. The application uses a React frontend for webcam access and basic UI buttons, while utilizing a FastAPI backend that handles facial
verification with DeepFace.

## Live Website
Website: 

## Stack
* React - Interface and webcam input
* FastAPI - Backend API to process your image and webcam from the frontend
* DeepFace - Handles facial verification and identification with Deepface.verify
* MTCNN - Detects face before processed by DeepFace
* face-api.js - Used for drawing face bounding box
* react-webcam -  Access to user's webcam from React
* OpenCV - Prepare images for facial recognition system
* Docker - Package all dependencies into containers
* Render - Deploys application

DeepFace - Chose DeepFace because it was easy-to-use when comparing two images and check if they were the same person. Also, the GitHub repo was simple to understand for quick iteration. 

MTCNN - Chose MTCNN since it was designed specifically for detecting faces in images. Compared to using more general computer vision library, it made it easier to locate faces before sending them to DeepFace.

FaceNet512(model_name) - Chose as the recognition model because it helped compare faces when images have relatively significant differences in lighting, or quality. 

## API

POST /api/verify
-Compares reference image with a webcam image and returns a boolean whether they match or not.

POST /api/identify(unused)
-Search for known_faces directory to identify if they are in the folder.

## Run Locally
### Backend
cd backend
python3.11 -m venv .venv

Install dependencies:
pip install -r requirements.txt

Start Server:
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev
