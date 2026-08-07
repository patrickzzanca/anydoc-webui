FROM python:3.11-slim

WORKDIR /app

# Install build dependencies for Rust/native modules if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir fastapi uvicorn python-multipart firecrawl-anydoc

# Copy app code
COPY ./app /app

# Expose port
EXPOSE 8000

# Start app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
