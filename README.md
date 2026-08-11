# AnyDoc Web UI (`anydoc-webui`)

Interface Web moderna e ultra-rápida construída para conversão de documentos em **Markdown (LLM-Ready)** utilizando o motor Rust **Firecrawl AnyDoc** (`firecrawl-anydoc`).

---

## ⚡ Recursos
- **Motor Rust de Alta Velocidade:** Medição de tempo por conversão em milissegundos (< 5ms).
- **Suporte Amplo a Formatos:** PDF, DOCX, DOC, PPTX, XLSX, XLS, ODT, RTF, EPUB, CSV.
- **Interface Dark Mode:** Visualização ao vivo com suporte a visualização renderizada e raw markdown, cópia em um clique e download de arquivo `.md`.
- **Dockerizado & CasaOS:** Pronto para implantação em servidores Homelab / CasaOS.

---

## 🚀 Como Rodar via Docker

### 1. Iniciar via Docker Compose
No terminal do seu servidor ou máquina local:

```bash
docker compose up -d --build
```

O contêiner subirá na porta **`8090`**.

### 2. Acessar no Navegador
Acesse através do IP do seu servidor ou localhost:
```
http://localhost:8090
# ou
http://<IP-DO-SEU-SERVIDOR>:8090
```

---

## 🛠️ Desenvolvimento Local (Sem Docker)

```bash
pip install fastapi uvicorn python-multipart firecrawl-anydoc

python app/main.py
```
Acesse `http://localhost:8000`.
