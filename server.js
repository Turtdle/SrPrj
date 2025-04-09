const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Track if resume viewer images have been checked
let standardImageChecked = false;
let professionalImageChecked = false;

function ensureResumeViewerImageExists(template) {
    const imageName = template === 'professional' ? 'resume-viewer-professional' : 'resume-viewer';
    const imageChecked = template === 'professional' ? professionalImageChecked : standardImageChecked;
    const dockerfilePath = template === 'professional' ? 'resume-template/Dockerfile.professional' : 'resume-template/Dockerfile.build';
    
    return new Promise((resolve, reject) => {
      if (imageChecked) {
        console.log(`${imageName} image already verified`);
        resolve();
        return;
      }
      
      exec(`docker image inspect ${imageName}`, (error) => {
        if (error) {
          console.log(`${imageName} image not found, building it now...`);
          exec(`docker build -t ${imageName} -f ${dockerfilePath} .`, (buildError, stdout, stderr) => {
            if (buildError) {
              console.error(`Error building ${imageName} image:`, stderr);
              reject(buildError);
            } else {
              console.log(`Successfully built ${imageName} image`);
              if (template === 'professional') {
                professionalImageChecked = true;
              } else {
                standardImageChecked = true;
              }
              resolve();
            }
          });
        } else {
          console.log(`${imageName} image already exists`);
          if (template === 'professional') {
            professionalImageChecked = true;
          } else {
            standardImageChecked = true;
          }
          resolve();
        }
      });
    });
  }
  
function findPythonInterpreter() {
    const inDocker = fs.existsSync('/.dockerenv');
    
    const possiblePaths = [
        inDocker ? 'python3' : null,
        inDocker ? 'python' : null,
        path.join(__dirname, '.venv', 'bin', 'python3'),
        path.join(__dirname, '.venv', 'bin', 'python'),
        path.join(__dirname, '.venv', 'Scripts', 'python.exe'),
    ].filter(Boolean);
    
    for (const pythonPath of possiblePaths) {
        try {
            if (pythonPath.includes(__dirname) && !fs.existsSync(pythonPath)) {
                continue;
            }
            
            const result = require('child_process').spawnSync(
                pythonPath.includes(' ') ? `"${pythonPath}"` : pythonPath, 
                ['--version']
            );
            
            if (result.status === 0) {
                console.log(`Found working Python interpreter at: ${pythonPath}`);
                return pythonPath;
            }
        } catch (e) {
        }
    }
    
    console.log('Falling back to system Python');
    return 'python';
}

const PYTHON_PATH = findPythonInterpreter();

// Create directory for template preview images
const previewDir = path.join(__dirname, 'public', 'img');
if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
}

// Create basic placeholder preview images if they don't exist
const standardPreview = path.join(previewDir, 'template-standard.png');
const professionalPreview = path.join(previewDir, 'template-professional.png');

// This is a simple function to create a placeholder image file if it doesn't exist
function createPlaceholderImageIfNeeded(filePath, content) {
    if (!fs.existsSync(filePath)) {
        console.log(`Creating placeholder image at ${filePath}`);
        fs.writeFileSync(filePath, content || 'PLACEHOLDER');
    }
}

createPlaceholderImageIfNeeded(standardPreview);
createPlaceholderImageIfNeeded(professionalPreview);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

const activeContainers = {};

app.post('/upload', upload.single('docxFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    if (!req.file.originalname.endsWith('.docx')) {
        return res.status(400).send('Please upload a .docx file');
    }

    // Get selected template (default to standard if not specified)
    const selectedTemplate = req.body.template || 'standard';
    console.log(`Selected template: ${selectedTemplate}`);

    try {
        await ensureResumeViewerImageExists(selectedTemplate);
    } catch (error) {
        console.error('Failed to ensure resume-viewer image exists:', error);
        return res.status(500).send('Error preparing container image');
    }

    const docxPath = req.file.path;
    const containerId = uuidv4();
    const containerPort = 8000 + Math.floor(Math.random() * 1000);
    
    const containerDir = path.join(__dirname, 'container-data', containerId);
    fs.mkdirSync(containerDir, { recursive: true });
    
    fs.copyFileSync(docxPath, path.join(containerDir, 'doc.docx'));
    
    fs.copyFileSync(
        path.join(__dirname, 'docx_handler', 'docxparser.py'),
        path.join(containerDir, 'docxparser.py')
    );
    fs.copyFileSync(
        path.join(__dirname, 'docx_handler', 'docxtodict.py'),
        path.join(containerDir, 'docxtodict.py')
    );
    
    console.log(`Using Python interpreter: ${PYTHON_PATH}`);
    console.log(`Working directory: ${containerDir}`);
    
    let pythonCmd;
    if (PYTHON_PATH.includes(' ')) {
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
        
        console.log(`Making data.json accessible...`);
        exec(`chmod -R 755 ${containerDir}`, (chmodError) => {
            if (chmodError) {
                console.error(`Warning: chmod failed: ${chmodError.message}`);
            }
            
            // Set the correct image name based on template
            const imageName = selectedTemplate === 'professional' ? 'resume-viewer-professional' : 'resume-viewer';
            const uniqueContainerName = `resume-${containerId}`;
            
            const dockerRunCmd = `
            docker run -d -p ${containerPort}:80 --name ${uniqueContainerName} ${imageName} && 
            docker cp ${path.join(containerDir, 'data.json')} ${uniqueContainerName}:/usr/share/nginx/html/data.json && 
            docker exec ${uniqueContainerName} chmod 644 /usr/share/nginx/html/data.json
            `;

            console.log(`Executing Docker command with image ${imageName}: ${dockerRunCmd}`);
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

            const previewContent = fs.readFileSync(dataJsonPath, 'utf8').substring(0, 100);
            console.log(`Data preview: ${previewContent}...`);
            exec(dockerRunCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error with Docker commands: ${error.message}`);
                    console.error(`Docker stderr: ${stderr}`);
                    return res.status(500).send('Error launching container');
                }
                
                activeContainers[containerId] = {
                    id: stdout.trim(),
                    port: containerPort,
                    createdAt: new Date(),
                    template: selectedTemplate
                };
                
                res.json({
                    success: true,
                    containerId: containerId,
                    url: `http://localhost:${containerPort}`,
                    template: selectedTemplate
                });
            });
        });
    });
});

app.get('/container/:id', (req, res) => {
    const containerId = req.params.id;
    if (activeContainers[containerId]) {
        res.json({
            active: true,
            url: `http://localhost:${activeContainers[containerId].port}`,
            template: activeContainers[containerId].template
        });
    } else {
        res.json({ active: false });
    }
});

setInterval(() => {
    const now = new Date();
    Object.entries(activeContainers).forEach(([id, container]) => {
        const hoursSinceCreation = (now - container.createdAt) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) { 
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