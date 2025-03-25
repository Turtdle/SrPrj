document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultArea = document.getElementById('result-area');

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    async function handleFiles(files) {
        const file = files[0]; // Handle first file only
        console.log('File received:', file.name);
        
        // Reset drop zone to original state
        dropZone.innerHTML = `<p>Drag & Drop files here or click to upload</p>`;
        
        // Check if file is a .docx file
        if (!file.name.endsWith('.docx')) {
            resultArea.innerHTML = `<p style="color: red;">Please upload a .docx file</p>`;
            return;
        }
        
        resultArea.innerHTML = `<p>Processing ${file.name}...</p>`;
        
        // Create form data and append file
        const formData = new FormData();
        formData.append('docxFile', file);
        
        try {
            // Send to server endpoint
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success) {
                    resultArea.innerHTML = `
                        <p style="color: green;">Success! Your resume website is ready!</p>
                        <a href="${data.url}" target="_blank" class="btn-primary">View Your Resume Website</a>
                        <p><small>Container ID: ${data.containerId}</small></p>
                        <p><small>This website will be available for 24 hours</small></p>
                    `;
                } else {
                    resultArea.innerHTML = `<p style="color: red;">Error: ${data.message || 'Unknown error'}</p>`;
                }
            } else {
                const error = await response.text();
                resultArea.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            resultArea.innerHTML = `<p style="color: red;">Error uploading file: ${error.message}</p>`;
        }
    }
});