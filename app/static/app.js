document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');
    const resultFilename = document.getElementById('resultFilename');
    const speedBadge = document.getElementById('speedBadge');
    const markdownPreview = document.getElementById('markdownPreview');
    const markdownRaw = document.getElementById('markdownRaw');
    const btnPreview = document.getElementById('btnPreview');
    const btnRaw = document.getElementById('btnRaw');
    const btnCopy = document.getElementById('btnCopy');
    const btnDownload = document.getElementById('btnDownload');
    const healthPill = document.getElementById('healthPill');
    const statusText = document.getElementById('statusText');

    let currentMarkdownContent = '';
    let currentFileName = '';

    // Check health status
    async function checkHealth() {
        try {
            const res = await fetch('/api/health');
            if (res.ok) {
                const data = await res.json();
                healthPill.classList.add('online');
                healthPill.classList.remove('offline');
                statusText.textContent = data.anydoc_installed ? 'Engine Pronta' : 'Aviso: Anydoc indisponível';
            } else {
                throw new Error();
            }
        } catch (e) {
            healthPill.classList.add('offline');
            healthPill.classList.remove('online');
            statusText.textContent = 'Servidor Offline';
        }
    }
    checkHealth();

    // Drag & Drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFileUpload(fileInput.files[0]);
        }
    });

    // Upload & Process File
    async function handleFileUpload(file) {
        const formData = new FormData();
        formData.append('file', file);

        dropZone.classList.add('hidden');
        loader.classList.remove('hidden');
        resultSection.classList.add('hidden');

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro na conversão do arquivo.');
            }

            currentMarkdownContent = data.content || '';
            currentFileName = data.filename || file.name;

            // Render Markdown
            resultFilename.textContent = currentFileName;
            speedBadge.textContent = `⚡ ${data.elapsed_ms} ms`;
            markdownRaw.value = currentMarkdownContent;

            if (window.marked) {
                markdownPreview.innerHTML = marked.parse(currentMarkdownContent);
            } else {
                markdownPreview.textContent = currentMarkdownContent;
            }

            loader.classList.add('hidden');
            dropZone.classList.remove('hidden');
            resultSection.classList.remove('hidden');

        } catch (error) {
            alert(`Falha no processamento: ${error.message}`);
            loader.classList.add('hidden');
            dropZone.classList.remove('hidden');
        }
    }

    // Toggle Preview vs Raw
    btnPreview.addEventListener('click', () => {
        btnPreview.classList.add('active');
        btnRaw.classList.remove('active');
        markdownPreview.classList.remove('hidden');
        markdownRaw.classList.add('hidden');
    });

    btnRaw.addEventListener('click', () => {
        btnRaw.classList.add('active');
        btnPreview.classList.remove('active');
        markdownRaw.classList.remove('hidden');
        markdownPreview.classList.add('hidden');
    });

    // Copy Content
    btnCopy.addEventListener('click', () => {
        if (!currentMarkdownContent) return;
        navigator.clipboard.writeText(currentMarkdownContent).then(() => {
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = `<i class="fa-solid fa-check"></i> Copiado!`;
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
            }, 2000);
        });
    });

    // Download .md File
    btnDownload.addEventListener('click', () => {
        if (!currentMarkdownContent) return;
        const blob = new Blob([currentMarkdownContent], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const baseName = currentFileName.substring(0, currentFileName.lastIndexOf('.')) || currentFileName;
        a.href = url;
        a.download = `${baseName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
