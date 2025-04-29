const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Configure middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));
app.use(express.json());

// Configure templates directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Track active resumes
const activeResumes = {};

// Add root route handler for the homepage
app.get('/', (req, res) => {
  res.render('index');
});


// Process the uploaded resume file
app.post('/upload', upload.single('docxFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    if (!req.file.originalname.endsWith('.docx')) {
        return res.status(400).send('Please upload a .docx file');
    }

    // Get template choice - default to 'modern' if not specified
    const templateChoice = req.body.template || 'modern';

    try {
        const docxPath = req.file.path;
        const resumeId = uuidv4();
        const resumeDir = path.join(__dirname, 'resumes', resumeId);
        
        // Create directory for this resume
        fs.mkdirSync(resumeDir, { recursive: true });
        
        // Copy the DOCX file
        fs.copyFileSync(docxPath, path.join(resumeDir, 'doc.docx'));
        
        // Copy the necessary Python scripts
        fs.copyFileSync(
            path.join(__dirname, 'docx_handler', 'docxparser.py'),
            path.join(resumeDir, 'docxparser.py')
        );
        fs.copyFileSync(
            path.join(__dirname, 'docx_handler', 'docxtodict.py'),
            path.join(resumeDir, 'docxtodict.py')
        );
        
        // Find Python interpreter
        const pythonPath = findPythonInterpreter();
        
        // Execute Python script to process document
        const pythonCmd = `cd ${resumeDir} && ${pythonPath} docxtodict.py`;
        
        exec(pythonCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error processing document: ${error.message}`);
                console.error(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                return res.status(500).send('Error processing document');
            }
            
            console.log(`Document processed: ${stdout}`);
            
            // Read and validate the generated data.json file
            const dataJsonPath = path.join(resumeDir, 'data.json');
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

                // Write the validated JSON back to file
                fs.writeFileSync(dataJsonPath, JSON.stringify(validatedData, null, 2));
                
                // Create CSS directory for the resume
                const cssDir = path.join(resumeDir, 'css');
                fs.mkdirSync(cssDir, { recursive: true });
                
                // Copy the appropriate CSS file based on template choice
                const sourceCssFile = templateChoice === 'professional' 
                    ? path.join(__dirname, 'professional-template', 'src', 'App.css')
                    : path.join(__dirname, 'resume-template', 'src', 'App.css');
                
                const destCssFile = path.join(cssDir, 'style.css');
                fs.copyFileSync(sourceCssFile, destCssFile);
                
                // Save template type
                fs.writeFileSync(path.join(resumeDir, 'template-type.txt'), templateChoice);
                
                // Register the active resume
                activeResumes[resumeId] = {
                    id: resumeId,
                    createdAt: new Date(),
                    template: templateChoice,
                    data: validatedData
                };
                
                // Return success response with resume URL
                res.json({
                    success: true,
                    resumeId: resumeId,
                    url: `/resume/${resumeId}`,
                    template: templateChoice
                });
            } catch (parseError) {
                console.error(`Error parsing or validating data.json: ${parseError.message}`);
                return res.status(500).send('Error processing resume data');
            }
        });
    } catch (error) {
        console.error('Error in resume processing:', error);
        return res.status(500).send('Server error during resume processing');
    }
});

// Route to check if a resume exists
app.get('/resume/exists/:id', (req, res) => {
    const resumeId = req.params.id;
    if (activeResumes[resumeId]) {
        res.json({
            active: true,
            url: `/resume/${resumeId}`,
            template: activeResumes[resumeId].template || 'modern'
        });
    } else {
        res.json({ active: false });
    }
});

// Route to serve the resume page
app.get('/resume/:id', (req, res) => {
    const resumeId = req.params.id;
    
    // Check if the resume exists
    if (!activeResumes[resumeId]) {
        const resumeDataPath = path.join(__dirname, 'resumes', resumeId, 'data.json');
        
        // Try to load from file system if not in memory
        if (fs.existsSync(resumeDataPath)) {
            try {
                const resumeData = JSON.parse(fs.readFileSync(resumeDataPath, 'utf8'));
                
                // Determine template from directory structure or default to modern
                let template = 'modern';
                const templateTypePath = path.join(__dirname, 'resumes', resumeId, 'template-type.txt');
                if (fs.existsSync(templateTypePath)) {
                    template = fs.readFileSync(templateTypePath, 'utf8').trim();
                }
                
                // Add to active resumes
                activeResumes[resumeId] = {
                    id: resumeId,
                    createdAt: new Date(),
                    template: template,
                    data: resumeData
                };
            } catch (error) {
                console.error(`Error loading resume ${resumeId}:`, error);
                return res.status(404).render('error', { 
                    message: 'Resume not found or could not be loaded' 
                });
            }
        } else {
            return res.status(404).render('error', { 
                message: 'Resume not found' 
            });
        }
    }
    
    // Get the resume data
    const resume = activeResumes[resumeId];
    
    // Render the appropriate template
    if (resume.template === 'professional') {
        res.render('professional-resume', { 
            resume: resume.data,
            resumeId: resumeId 
        });
    } else {
        res.render('modern-resume', { 
            resume: resume.data,
            resumeId: resumeId 
        });
    }
});

// Clean up old resumes periodically (after 24 hours)
setInterval(() => {
    const now = new Date();
    Object.entries(activeResumes).forEach(([id, resume]) => {
        const hoursSinceCreation = (now - resume.createdAt) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) { 
            delete activeResumes[id];
            console.log(`Removed resume ${id} from active resumes cache`);
        }
    });
}, 3600000); // Check every hour

// Helper function to find Python interpreter
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
            // Continue to next path
        }
    }
    
    console.log('Falling back to system Python');
    return 'python';
}

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Simplified Resume Server running at http://localhost:${port}`);
    console.log(`Using Python interpreter: ${findPythonInterpreter()}`);
});