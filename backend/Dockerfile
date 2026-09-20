#use python version 3.11
FROM python:3.11-slim

# System dependencies needed for future vision libraries (dlib, opencv, Face-Recognition,and others)
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    g++ \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

#goes to app directory
WORKDIR /app

#layer caching - docker looks at every layer
#if layer was changed then rebuild, if it did not change use the cache
COPY requirements.txt .

#install dependencies 
RUN pip install --no-cache-dir -r requirements.txt

#copy the rest of our app into the container
COPY . .

#expose port
EXPOSE 8000

#uses CMD to start the container after building
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]