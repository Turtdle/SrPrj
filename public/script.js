document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultArea = document.getElementById('result-area');
    const templateSelection = document.getElementById('template-selection');
    const generateBtn = document.getElementById('generate-btn');
    const templateCards = document.querySelectorAll('.template-card');
    
    let uploadedFile = null;
    let selectedTemplate = 'standard'; // Default template

    // Drop zone handling
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelection(e.target.files);
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
            handleFileSelection(e.dataTransfer.files);
        }
    });

    // Template selection
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            templateCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            // Update selected template
            selectedTemplate = card.getAttribute('data-template');
        });
    });

    // Set default selected template
    templateCards[0].classList.add('selected');

    // Generate button
    generateBtn.addEventListener('click', () => {
        if (uploadedFile) {
            generateWebsite(uploadedFile, selectedTemplate);
        }
    });

    function handleFileSelection(files) {
        const file = files[0];
        console.log('File received:', file.name);

        // Reset UI
        dropZone.innerHTML = `<p>Drag & Drop files here or click to upload</p>`;

        if (!file.name.endsWith('.docx')) {
            resultArea.innerHTML = `<p style="color: red;">Please upload a .docx file</p>`;
            templateSelection.style.display = 'none';
            return;
        }
        
        resultArea.innerHTML = `<p>File "${file.name}" uploaded successfully!</p>`;
        uploadedFile = file;
        
        // Show template selection
        templateSelection.style.display = 'block';
    }

    async function generateWebsite(file, template) {
        resultArea.innerHTML = `<p>Processing ${file.name} with ${template} template...</p>`;
        
        const formData = new FormData();
        formData.append('docxFile', file);
        formData.append('template', template);
        
        try {
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
                    // Hide template selection after successful generation
                    templateSelection.style.display = 'none';
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