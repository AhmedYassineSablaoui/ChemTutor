FROM python:3.11-slim

# Install system dependencies needed by RDKit for drawing
RUN apt-get update && apt-get install -y \
    libxrender1 \
    libxext6 \
    libsm6 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Force NumPy < 2 to avoid compatibility issues with RDKit
RUN pip install --no-cache-dir "numpy<2" && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
