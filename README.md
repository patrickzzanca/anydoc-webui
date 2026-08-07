# AnyDoc Web UI (`anydoc-webui`)

Interface Web moderna e ultra-rápida construída para conversão de documentos em **Markdown (LLM-Ready)** utilizando o motor Rust **Firecrawl AnyDoc** (`firecrawl-anydoc`).

---

## ⚡ Recursos
- **Motor Rust de Alta Velocidade:** Medição de tempo por conversão em milissegundos (< 5ms).
- **Suporte a 14+ Formatos:** PDF, DOCX, DOC, PPTX, XLSX, XLS, ODT, RTF, EPUB, CSV, HTML.
- **Interface Dark Mode:** Visualização ao vivo com suporte a visualização renderizada e raw markdown, cópia em um clique e download de arquivo `.md`.
- **Dockerizado:** Pronto para implantação em servidores Homelab (ex: Gandalf).

---

## 🚀 Como Rodar no Gandalf / Docker

### 1. Iniciar via Docker Compose
No terminal do servidor ou via SSH no diretório `anydoc-webui`:

```bash
docker compose up -d --build
```

O container subirá na porta **`8090`**.

### 2. Acessar no Navegador
Acesse através do IP do servidor Gandalf ou domínio local:
```
http://gandalf.local:8090
# ou
http://<IP-DO-GANDALF>:8090
```

---

## 🛠️ Desenvolvimento Local (Sem Docker)

```bash
pip install fastapi uvicorn python-multipart firecrawl-anydoc

python app/main.py
```
Acesse `http://localhost:8000`.
