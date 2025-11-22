# Dockerfile (root)
FROM python:3.11-slim

WORKDIR /app

# ensure pip deps will be installed from backend/requirements.txt
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy backend folder into container at /app/backend
COPY backend/ /app/backend/

# make sure Python can import the 'backend' package
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
