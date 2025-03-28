const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// a
let imageChecked = false;

function ensureResumeViewerImageExists() {
    return new Promise((resolve, reject) => {
      if (imageChecked) {
        console.log('Resume viewer image already verified');
        resolve();
        return;
      }
      
      exec('docker image inspect resume-viewer', (error) => {
        if (error) {
          console.log('Resume viewer image not found, building it now...');
          exec('docker build -t resume-viewer -f resume-template/Dockerfile.build .', (buildError, stdout, stderr) => {
            if (buildError) {
              console.error('Error building resume-viewer image:', stderr);
              reject(buildError);
            } else {
              console.log('Successfully built resume-viewer image');
              imageChecked = true;
              resolve();
            }
          });
        } else {
          console.log('Resume viewer image already exists');
          imageChecked = true;
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


    try {
        await ensureResumeViewerImageExists();
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
            

            const uniqueContainerName = `resume-${containerId}`;
            //d
            const dockerRunCmd = `
            docker run -d -p ${containerPort}:80 --name ${uniqueContainerName} resume-viewer && 
            docker cp ${path.join(containerDir, 'data.json')} ${uniqueContainerName}:/usr/share/nginx/html/data.json && 
            docker exec ${uniqueContainerName} chmod 644 /usr/share/nginx/html/data.json
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
                    createdAt: new Date()
                };
                
                res.json({
                    success: true,
                    containerId: containerId,
                    url: `http://localhost:${containerPort}`
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
            url: `http://localhost:${activeContainers[containerId].port}`
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