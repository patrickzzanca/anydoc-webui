import os
import time
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

try:
    import anydoc
except ImportError:
    try:
        import firecrawl_anydoc as anydoc
    except ImportError:
        anydoc = None

app = FastAPI(title="Firecrawl AnyDoc Web UI")

# Serve static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>AnyDoc Web UI is running! Static files missing.</h1>"

@app.post("/api/convert")
async def convert_file(file: UploadFile = File(...)):
    if anydoc is None:
        raise HTTPException(
            status_code=500,
            detail="Pacote 'firecrawl-anydoc' não está instalado no ambiente."
        )

    _, ext = os.path.splitext(file.filename)
    if not ext:
        ext = ".bin"

    start_time = time.perf_counter()
    temp_file_path = None

    try:
        # Save uploaded file to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # Perform conversion
        if hasattr(anydoc, "to_markdown"):
            content = anydoc.to_markdown(temp_file_path)
        elif hasattr(anydoc, "convert"):
            content = anydoc.convert(temp_file_path)
        elif hasattr(anydoc, "convert_to_markdown"):
            content = anydoc.convert_to_markdown(temp_file_path)
        else:
            raise AttributeError("Função de conversão não encontrada no módulo anydoc.")

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return JSONResponse({
            "status": "success",
            "filename": file.filename,
            "content": content,
            "elapsed_ms": elapsed_ms
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro durante a conversão do arquivo '{file.filename}': {str(e)}"
        )
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "anydoc-webui",
        "anydoc_installed": anydoc is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
