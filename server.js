// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Find the appropriate Python interpreter for the environment
function findPythonInterpreter() {
    // Check if we're running in a Docker container
    const inDocker = fs.existsSync('/.dockerenv');
    
    // Possible paths for Python interpreter
    const possiblePaths = [
        // Docker container might use system Python
        inDocker ? 'python3' : null,
        inDocker ? 'python' : null,
        // Standard venv paths on Unix/Linux/macOS
        path.join(__dirname, '.venv', 'bin', 'python3'),
        path.join(__dirname, '.venv', 'bin', 'python'),
        // Standard venv paths on Windows
        path.join(__dirname, '.venv', 'Scripts', 'python.exe'),
    ].filter(Boolean); // Remove null entries
    
    // Check which paths exist
    for (const pythonPath of possiblePaths) {
        try {
            // For local paths, check if they exist
            if (pythonPath.includes(__dirname) && !fs.existsSync(pythonPath)) {
                continue;
            }
            
            // Try executing the Python interpreter
            const result = require('child_process').spawnSync(
                pythonPath.includes(' ') ? `"${pythonPath}"` : pythonPath, 
                ['--version']
            );
            
            if (result.status === 0) {
                console.log(`Found working Python interpreter at: ${pythonPath}`);
                return pythonPath;
            }
        } catch (e) {
            // Continue to next path if this one fails
        }
    }
    
    console.log('Falling back to system Python');
    return 'python';
}

const PYTHON_PATH = findPythonInterpreter();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Track active containers
const activeContainers = {};

app.post('/upload', upload.single('docxFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Check if file is a .docx
    if (!req.file.originalname.endsWith('.docx')) {
        return res.status(400).send('Please upload a .docx file');
    }

    const docxPath = req.file.path;
    const containerId = uuidv4();
    const containerPort = 8000 + Math.floor(Math.random() * 1000);
    
    // Create directory for container data
    const containerDir = path.join(__dirname, 'container-data', containerId);
    fs.mkdirSync(containerDir, { recursive: true });
    
    // Copy uploaded file to container directory
    fs.copyFileSync(docxPath, path.join(containerDir, 'doc.docx'));
    
    // Copy the Python scripts to the container directory
    fs.copyFileSync(
        path.join(__dirname, 'docx_handler', 'docxparser.py'),
        path.join(containerDir, 'docxparser.py')
    );
    fs.copyFileSync(
        path.join(__dirname, 'docx_handler', 'docxtodict.py'),
        path.join(containerDir, 'docxtodict.py')
    );
    
    // Process the document with Python script, ensuring environment variables are passed
    // Use Python with environment determination
    console.log(`Using Python interpreter: ${PYTHON_PATH}`);
    console.log(`Working directory: ${containerDir}`);
    
    // Make a more resilient Python execution call
    let pythonCmd;
    if (PYTHON_PATH.includes(' ')) {
        // Handle paths with spaces
        pythonCmd = `cd ${containerDir} && "${PYTHON_PATH}" docxtodict.py`;
    } else {
        pythonCmd = `cd ${containerDir} && ${PYTHON_PATH} docxtodict.py`;
    }
    
    console.log(`Executing command: ${pythonCmd}`);
    
    exec(pythonCmd, {
        env: {
            ...process.env,
            PATH: process.env.PATH
        }
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error processing document: ${error.message}`);
            console.error(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error processing document');
        }
        
        console.log(`Document processed: ${stdout}`);
        
        // Launch Docker container
        exec(`docker run -d -p ${containerPort}:80 -v ${containerDir}:/app/data --name resume-${containerId} resume-viewer`, 
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error launching container: ${error.message}`);
                    console.error(`Docker stderr: ${stderr}`);
                    return res.status(500).send('Error launching container');
                }
                
                // Store container info
                activeContainers[containerId] = {
                    id: stdout.trim(),
                    port: containerPort,
                    createdAt: new Date()
                };
                
                // Return container URL to client
                res.json({
                    success: true,
                    containerId: containerId,
                    url: `http://localhost:${containerPort}`
                });
            }
        );
    });
});

// Endpoint to check container status
app.get('/container/:id', (req, res) => {
    const containerId = req.params.id;
    if (activeContainers[containerId]) {
        res.json({
            active: true,
            url: `http://localhost:${activeContainers[containerId].port}`
        });
    } else {
        res.json({ active: false });
    }
});

// Cleanup inactive containers (run every hour)
setInterval(() => {
    const now = new Date();
    Object.entries(activeContainers).forEach(([id, container]) => {
        const hoursSinceCreation = (now - container.createdAt) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) { // Remove containers older than 24 hours
            exec(`docker stop resume-${id} && docker rm resume-${id}`, (error) => {
                if (!error) {
                    delete activeContainers[id];
                    console.log(`Removed container resume-${id}`);
                }
            });
        }
    });
}, 3600000);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Using Python interpreter: ${PYTHON_PATH}`);
});