document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');


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
        
        // Check if file is a .docx file
        if (!file.name.endsWith('.docx')) {
            dropZone.innerHTML = `<p style="color: red;">Please upload a .docx file</p>`;
            return;
        }
        
        dropZone.innerHTML = `<p>Processing ${file.name}...</p>`;
        
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
                dropZone.innerHTML = `
                    <p style="color: green;">Success! JSON file created from ${file.name}</p>
                    <p><a href="/blank.html" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Go to Blank Page</a></p>
                `;
            } else {
                const error = await response.text();
                dropZone.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            dropZone.innerHTML = `<p style="color: red;">Error uploading file: ${error.message}</p>`;
        }
    }
});