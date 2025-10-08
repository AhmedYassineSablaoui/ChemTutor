FROM python:3.11-slim

# System deps (RDKit + HTTPS + curl/ping for debugging)
RUN apt-get update && apt-get install -y \
    libxrender1 libxext6 libsm6 ca-certificates \
    curl iputils-ping \
 && update-ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 👇 Add this here
ENV DJANGO_SETTINGS_MODULE=chemtutor.settings

COPY requirements.txt .

# Force NumPy < 2 to avoid RDKit issues
RUN pip install --no-cache-dir "numpy<2" && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# 👇 Copy your fine-tuned models into container
# Make sure you have backend/models/chem locally before building
COPY models/chemberta/fine_tuned_t5_chem_small/fine_tuned_t5_chem_small /app/models/chemberta/fine_tuned_t5_chem_small

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]