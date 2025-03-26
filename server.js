// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;


function ensureResumeViewerImageExists() {
    return new Promise((resolve, reject) => {
      // Check if image exists
      exec('docker image inspect resume-viewer', (error) => {
        if (error) {
          console.log('Resume viewer image not found, building it now...');
          // Build the image
          exec('docker build -t resume-viewer -f resume-template/Dockerfile.build .', (buildError, stdout, stderr) => {
            if (buildError) {
              console.error('Error building resume-viewer image:', stderr);
              reject(buildError);
            } else {
              console.log('Successfully built resume-viewer image');
              resolve();
            }
          });
        } else {
          console.log('Resume viewer image already exists');
          resolve();
        }
      });
    });
  }
  
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
        console.log(`Making data.json accessible...`);
exec(`chmod -R 755 ${containerDir}`, (chmodError) => {
    if (chmodError) {
        console.error(`Warning: chmod failed: ${chmodError.message}`);
    }
    
    // Launch Docker container with multiple volume mounts
    const dockerRunCmd = `
    # First run the container
    docker run -d -p ${containerPort}:80 --name resume-${containerId} resume-viewer && 
    
    # Then copy the data.json file directly into the container
    docker cp ${path.join(containerDir, 'data.json')} resume-${containerId}:/usr/share/nginx/html/data.json && 
    
    # Make sure it has the right permissions
    docker exec resume-${containerId} chmod 644 /usr/share/nginx/html/data.json
`;

console.log(`Executing Docker command: ${dockerRunCmd}`);
const dataJsonPath = path.join(containerDir, 'data.json');
if (!fs.existsSync(dataJsonPath)) {
    console.error(`Error: data.json not found at ${dataJsonPath}`);
    return res.status(500).send('Error: Resume data not found');
}

const fileSize = fs.statSync(dataJsonPath).size;
if (fileSize === 0) {
    console.error(`Error: data.json is empty (0 bytes)`);
    return res.status(500).send('Error: Resume data is empty');
}

console.log(`Verified data.json exists (${fileSize} bytes)`);

// Log the first 100 characters to verify content
const previewContent = fs.readFileSync(dataJsonPath, 'utf8').substring(0, 100);
console.log(`Data preview: ${previewContent}...`);
exec(dockerRunCmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error with Docker commands: ${error.message}`);
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
});
});
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