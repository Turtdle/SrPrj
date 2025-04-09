const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Track if resume viewer images have been built
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
    
    // Check if image exists
    try {
      execSync(`docker image inspect ${imageName}`, { stdio: 'pipe' });
      console.log(`${imageName} image already exists`);
      if (template === 'professional') {
        professionalImageChecked = true;
      } else {
        standardImageChecked = true;
      }
      resolve();
    } catch (error) {
      // Image doesn't exist, build it
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
    }
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
      // Continue to next path
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
    // Create a simple 1x1 transparent PNG
    const minimalPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(filePath, minimalPng);
  }
}