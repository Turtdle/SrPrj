document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultArea = document.getElementById('result-area');

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File selected through input
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    });

    // Drag and drop handling
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

    // Process uploaded file
    async function handleFiles(files) {
        const file = files[0]; // Handle first file only
        console.log('File received:', file.name);
        
        // Reset drop zone to original state
        dropZone.innerHTML = `<p>Drag & Drop JSON file here or click to upload</p>`;
        
        // Check if file is a .json file
        if (!file.name.endsWith('.json')) {
            resultArea.innerHTML = `<p style="color: red;">Please upload a JSON file</p>`;
            return;
        }
        
        resultArea.innerHTML = `<p>Processing ${file.name}...</p>`;
        
        // Create form data and append file
        const formData = new FormData();
        formData.append('jsonFile', file);
        
        try {
            // Send to server endpoint
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                resultArea.innerHTML = `
                    <p style="color: green;">${data.message}</p>
                    <a href="/preview" class="btn-primary">Preview Resume</a>
                `;
            } else {
                resultArea.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            resultArea.innerHTML = `<p style="color: red;">Error uploading file: ${error.message}</p>`;
        }
    }
});