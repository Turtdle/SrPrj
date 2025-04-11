document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const resultArea = document.getElementById('result-area');
    const templateSelector = document.getElementById('template-selector');

    // Ensure template selector exists in the DOM
    if (!templateSelector) {
        console.error('Template selector not found. Adding it dynamically.');
        
        // Create template selector if it doesn't exist
        const uploadSection = document.getElementById('Upload');
        if (uploadSection) {
            const selectorContainer = document.createElement('div');
            selectorContainer.className = 'template-selector-container';
            selectorContainer.innerHTML = `
                <h3>Choose a template style:</h3>
                <div class="template-options">
                    <div class="template-option">
                        <input type="radio" id="modern-template" name="template" value="modern" checked>
                        <label for="modern-template">
                            <div class="template-preview modern">
                                <div class="preview-content">
                                    <div class="preview-header"></div>
                                    <div class="preview-body">
                                        <div class="preview-column left"></div>
                                        <div class="preview-column right"></div>
                                    </div>
                                </div>
                            </div>
                            <span>Modern Design</span>
                        </label>
                    </div>
                    <div class="template-option">
                        <input type="radio" id="professional-template" name="template" value="professional">
                        <label for="professional-template">
                            <div class="template-preview professional">
                                <div class="preview-content">
                                    <div class="preview-header pro"></div>
                                    <div class="preview-section"></div>
                                    <div class="preview-section"></div>
                                    <div class="preview-section"></div>
                                </div>
                            </div>
                            <span>Professional Design</span>
                        </label>
                    </div>
                </div>
            `;
            
            // Add template selector before the drop zone
            const dropZoneContainer = dropZone.parentElement;
            dropZoneContainer.parentElement.insertBefore(selectorContainer, dropZoneContainer);
        }
    }

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
        const file = files[0]; 
        console.log('File received:', file.name);
        
        // Get the selected template
        const templateRadios = document.querySelectorAll('input[name="template"]');
        let selectedTemplate = 'modern'; // Default to modern template
        
        templateRadios.forEach(radio => {
            if (radio.checked) {
                selectedTemplate = radio.value;
            }
        });
        
        console.log('Selected template:', selectedTemplate);

        dropZone.innerHTML = `<p>Drag & Drop files here or click to upload</p>`;

        if (!file.name.endsWith('.docx')) {
            resultArea.innerHTML = `<p style="color: red;">Please upload a .docx file</p>`;
            return;
        }
        
        resultArea.innerHTML = `<p>Processing ${file.name} with ${selectedTemplate} template...</p>
                             <div class="processing-spinner"></div>`;
        

        const formData = new FormData();
        formData.append('docxFile', file);
        formData.append('template', selectedTemplate);
        
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
                        <p><small>Template: ${data.template}</small></p>
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