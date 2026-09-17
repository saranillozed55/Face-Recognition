FROM python:3.11-slim

# System dependencies needed for future vision libraries (dlib, opencv, Face-Recognition,and others)
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    g++ \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]