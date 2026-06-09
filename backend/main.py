"""Shim entry point — delegates to app.main:app for uvicorn.
Usage: uvicorn main:app --host 0.0.0.0 --port 8000
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
