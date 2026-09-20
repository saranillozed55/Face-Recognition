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
* OpenCV - Image processing for finding faces
* Docker - Package all dependencies into containers
* Render - Deploys application

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
