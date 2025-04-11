const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Track which images have been checked
let modernTemplateChecked = false;
let professionalTemplateChecked = false;
async function buildDockerImages() {
  try {
    await ensureTemplateImageExists('modern');
    await ensureTemplateImageExists('professional');
    console.log('Docker images ready');
  } catch (error) {
    console.error('Error building Docker images:', error);
  }
}
buildDockerImages();
// Ensure template images exist
function ensureTemplateImageExists(templateName) {
    return new Promise((resolve, reject) => {
        const imageTag = templateName === 'professional' ? 'professional-resume-viewer' : 'resume-viewer';
        const isChecked = templateName === 'professional' ? professionalTemplateChecked : modernTemplateChecked;
        const dockerfile = templateName === 'professional' 
            ? 'professional-template/Dockerfile.build' 
            : 'resume-template/Dockerfile.build';
        
        if (isChecked) {
            console.log(`${imageTag} image already verified`);
            resolve();
            return;
        }
        
        exec(`docker image inspect ${imageTag}`, (error) => {
            if (error) {
                console.log(`${imageTag} image not found, building it now...`);
                exec(`docker build -t ${imageTag} -f ${dockerfile} .`, (buildError, stdout, stderr) => {
                    if (buildError) {
                        console.error(`Error building ${imageTag} image:`, stderr);
                        reject(buildError);
                    } else {
                        console.log(`Successfully built ${imageTag} image`);
                        if (templateName === 'professional') {
                            professionalTemplateChecked = true;
                        } else {
                            modernTemplateChecked = true;
                        }
                        resolve();
                    }
                });
            } else {
                console.log(`${imageTag} image already exists`);
                if (templateName === 'professional') {
                    professionalTemplateChecked = true;
                } else {
                    modernTemplateChecked = true;
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const activeContainers = {};

app.post('/upload', upload.single('docxFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    if (!req.file.originalname.endsWith('.docx')) {
        return res.status(400).send('Please upload a .docx file');
    }

    // Get template choice - default to 'modern' if not specified
    const templateChoice = req.body.template || 'modern';
    const imageTag = templateChoice === 'professional' ? 'professional-resume-viewer' : 'resume-viewer';

    try {
        await ensureTemplateImageExists(templateChoice);
    } catch (error) {
        console.error(`Failed to ensure ${imageTag} image exists:`, error);
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
            
            // Read and validate the generated data.json file
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

            // Parse and enhance the data.json content
            try {
                const dataJsonContent = fs.readFileSync(dataJsonPath, 'utf8');
                const dataJsonObj = JSON.parse(dataJsonContent);
                
                // Make sure project technologies are populated
                if (dataJsonObj.projects) {
                    for (const project of dataJsonObj.projects) {
                        if (!project.technologies || project.technologies.length === 0) {
                            // Identify potential technologies from description
                            const description = project.description || '';
                            const tech = [];
                            
                            // Extract technologies based on common keywords in the description
                            if (description.toLowerCase().includes('marketing')) {
                                tech.push('Digital Marketing', 'Content Strategy');
                            }
                            if (description.toLowerCase().includes('social media')) {
                                tech.push('Social Media');
                            }
                            if (description.toLowerCase().includes('campaign')) {
                                tech.push('Campaign Management');
                            }
                            if (description.toLowerCase().includes('design')) {
                                tech.push('Design');
                            }
                            if (description.toLowerCase().includes('content')) {
                                tech.push('Content Creation');
                            }
                            if (description.toLowerCase().includes('analytics') || description.toLowerCase().includes('data')) {
                                tech.push('Analytics');
                            }
                            
                            // If we still have no technologies, add some generic ones based on the project name
                            if (tech.length === 0) {
                                tech.push('Project Management', 'Professional Skills');
                            }
                            
                            project.technologies = tech;
                        }
                    }
                }

                const validatedData = {
                    name: dataJsonObj.name || 'Professional Name',
                    contact: {
                        location: (dataJsonObj.contact && dataJsonObj.contact.location) || 'Location',
                        phone: (dataJsonObj.contact && dataJsonObj.contact.phone) || 'Phone',
                        email: (dataJsonObj.contact && dataJsonObj.contact.email) || 'Email'
                    },
                    education: Array.isArray(dataJsonObj.education) ? dataJsonObj.education : [],
                    experience: Array.isArray(dataJsonObj.experience) ? dataJsonObj.experience : [],
                    projects: Array.isArray(dataJsonObj.projects) ? dataJsonObj.projects : [],
                    skills: {
                        languages: (dataJsonObj.skills && Array.isArray(dataJsonObj.skills.languages)) 
                            ? dataJsonObj.skills.languages : [],
                        tools: (dataJsonObj.skills && Array.isArray(dataJsonObj.skills.tools)) 
                            ? dataJsonObj.skills.tools : []
                    }
                };

                fs.writeFileSync(dataJsonPath, JSON.stringify(validatedData, null, 2));
                
                const previewContent = JSON.stringify(validatedData).substring(0, 100);
                console.log(`Data preview after validation: ${previewContent}...`);
                
                const uniqueContainerName = `resume-${containerId}`;
                
                // Split into individual commands
                const runContainerCmd = `docker run -d -p ${containerPort}:80 --name ${uniqueContainerName} ${imageTag}`;
                const copyDataCmd = `docker cp ${dataJsonPath} ${uniqueContainerName}:/usr/share/nginx/html/data.json`;
                const setPermissionsCmd = `docker exec ${uniqueContainerName} chmod 644 /usr/share/nginx/html/data.json`;

                // Execute commands one by one with proper error handling
                console.log(`Executing container creation: ${runContainerCmd}`);
                exec(runContainerCmd, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error creating container: ${error.message}`);
                        console.error(`Docker stderr: ${stderr}`);
                        return res.status(500).send('Error creating container');
                    }
                    
                    const containerId = stdout.trim();
                    console.log(`Container created with ID: ${containerId}`);
                    
                    console.log(`Executing file copy: ${copyDataCmd}`);
                    exec(copyDataCmd, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error copying data file: ${error.message}`);
                            console.error(`Docker stderr: ${stderr}`);
                            return res.status(500).send('Error copying data file to container');
                        }
                        
                        console.log(`Data file copied successfully`);
                        
                        console.log(`Setting permissions: ${setPermissionsCmd}`);
                        exec(setPermissionsCmd, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error setting file permissions: ${error.message}`);
                                console.error(`Docker stderr: ${stderr}`);
                                
                                // Add more detailed error inspection
                                console.error(`Full error object:`, JSON.stringify(error, null, 2));
                                
                                // Check if container exists and get its status
                                exec(`docker inspect ${uniqueContainerName}`, (inspectError, inspectOutput) => {
                                    if (inspectError) {
                                        console.error(`Container inspection error: ${inspectError.message}`);
                                    } else {
                                        console.log(`Container status: ${inspectOutput}`);
                                    }
                                    
                                    // Try to execute a simple command to check if exec works at all
                                    exec(`docker exec ${uniqueContainerName} ls -la /usr/share/nginx/html/`, (lsError, lsOutput, lsStderr) => {
                                        if (lsError) {
                                            console.error(`Error executing simple ls command: ${lsError.message}`);
                                            console.error(`ls stderr: ${lsStderr}`);
                                        } else {
                                            console.log(`Directory listing: ${lsOutput}`);
                                        }
                                        
                                        return res.status(500).send('Error setting file permissions - see server logs for details');
                                    });
                                });
                            }
                            
                            console.log(`Permissions set successfully`);
                            
                            exec(`docker logs resume-${containerId}`, (logError, logOutput) => {
                                console.log(`Container logs: ${logOutput}`);
                                
                                activeContainers[containerId] = {
                                    id: containerId,
                                    port: containerPort,
                                    createdAt: new Date(),
                                    template: templateChoice
                                };
                                
                                res.json({
                                    success: true,
                                    containerId: containerId,
                                    url: `http://localhost:${containerPort}`,
                                    template: templateChoice
                                });
                            });
                        });
                    });
                });
            } catch (parseError) {
                console.error(`Error parsing or validating data.json: ${parseError.message}`);
                return res.status(500).send('Error processing resume data');
            }
        });
    });
});

app.get('/container/:id', (req, res) => {
    const containerId = req.params.id;
    if (activeContainers[containerId]) {
        res.json({
            active: true,
            url: `http://localhost:${activeContainers[containerId].port}`,
            template: activeContainers[containerId].template || 'modern'
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