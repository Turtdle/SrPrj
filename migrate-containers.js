/**
 * Migration script for moving from Docker container-based resumes to subpages
 * 
 * This script:
 * 1. Identifies all running resume containers
 * 2. Extracts their data.json files
 * 3. Creates corresponding resume directories in the new subpage system
 * 4. Copies the required CSS files
 * 5. Adds migration logs for troubleshooting
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

const execPromise = promisify(exec);
const mkdirPromise = promisify(fs.mkdir);
const copyFilePromise = promisify(fs.copyFile);
const writeFilePromise = promisify(fs.writeFile);

// Directory where resumes will be stored in the new system
const RESUMES_DIR = path.join(__dirname, 'resumes');

// CSS sources for the two templates
const MODERN_CSS_SOURCE = path.join(__dirname, 'resume-template', 'src', 'App.css');
const PROFESSIONAL_CSS_SOURCE = path.join(__dirname, 'professional-template', 'src', 'App.css');

// Ensure the resumes directory exists
if (!fs.existsSync(RESUMES_DIR)) {
    fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

// Create a migration log file
const logFile = path.join(__dirname, 'migration.log');
const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(logFile, logMessage);
};

// Start migration
log('Starting migration from Docker containers to subpages');

async function migrateContainers() {
    try {
        // Get list of all running resume containers
        log('Finding all running resume containers...');
        const { stdout } = await execPromise(
            'docker ps --filter "name=resume-" --format "{{.Names}}"'
        );

        const containerNames = stdout.trim().split('\n').filter(Boolean);
        
        if (containerNames.length === 0) {
            log('No running resume containers found.');
            return;
        }

        log(`Found ${containerNames.length} resume containers.`);

        // Process each container
        for (const containerName of containerNames) {
            await migrateContainer(containerName);
        }

        log('Migration completed successfully!');
    } catch (error) {
        log(`Migration failed: ${error.message}`);
    }
}

async function migrateContainer(containerName) {
    log(`Processing container: ${containerName}`);
    
    try {
        // Extract container ID (after "resume-" prefix)
        const containerId = containerName.replace('resume-', '');
        
        // Create a new UUID for the resume in the new system
        const resumeId = uuidv4();
        
        // Create directory for this resume
        const resumeDir = path.join(RESUMES_DIR, resumeId);
        await mkdirPromise(resumeDir, { recursive: true });
        
        // Create CSS directory for this resume
        const cssDir = path.join(resumeDir, 'css');
        await mkdirPromise(cssDir, { recursive: true });
        
        // Copy data.json from container to local filesystem
        log(`Extracting data.json from container ${containerName}...`);
        const tempDataJsonPath = path.join(__dirname, `temp-${containerId}.json`);
        
        await execPromise(
            `docker cp ${containerName}:/usr/share/nginx/html/data.json ${tempDataJsonPath}`
        );
        
        // Read the data.json content and check if it's valid
        const dataJsonContent = fs.readFileSync(tempDataJsonPath, 'utf8');
        
        try {
            // Validate JSON by parsing it
            const resumeData = JSON.parse(dataJsonContent);
            
            // Save data.json to the resume directory
            await writeFilePromise(
                path.join(resumeDir, 'data.json'),
                JSON.stringify(resumeData, null, 2)
            );
            
            // Determine template type based on container image
            const { stdout: imageInfo } = await execPromise(
                `docker inspect --format='{{.Config.Image}}' ${containerName}`
            );
            
            const isProfessional = imageInfo.includes('professional');
            const templateType = isProfessional ? 'professional' : 'modern';
            
            // Save template type
            await writeFilePromise(
                path.join(resumeDir, 'template-type.txt'),
                templateType
            );
            
            // Copy appropriate CSS file
            const cssSource = templateType === 'professional' 
                ? PROFESSIONAL_CSS_SOURCE 
                : MODERN_CSS_SOURCE;
                
            await copyFilePromise(
                cssSource,
                path.join(cssDir, 'style.css')
            );
            
            log(`Successfully migrated container ${containerName} to resume ID ${resumeId}`);
            log(`Template type: ${templateType}`);
            log(`New resume URL: /resume/${resumeId}`);
            
            // Create a mapping file to help with redirections
            const mappingData = {
                oldContainerId: containerId,
                newResumeId: resumeId,
                template: templateType,
                migratedAt: new Date().toISOString()
            };
            
            await writeFilePromise(
                path.join(resumeDir, 'migration-info.json'),
                JSON.stringify(mappingData, null, 2)
            );
            
            // Also add to a central mapping file
            const centralMappingPath = path.join(__dirname, 'container-to-subpage-mapping.json');
            let mappings = {};
            
            if (fs.existsSync(centralMappingPath)) {
                mappings = JSON.parse(fs.readFileSync(centralMappingPath, 'utf8'));
            }
            
            mappings[containerId] = {
                resumeId,
                template: templateType,
                migratedAt: new Date().toISOString()
            };
            
            await writeFilePromise(
                centralMappingPath,
                JSON.stringify(mappings, null, 2)
            );
            
            // Clean up temporary file
            fs.unlinkSync(tempDataJsonPath);
        } catch (jsonError) {
            log(`Error parsing data.json from container ${containerName}: ${jsonError.message}`);
            return false;
        }
        
        return true;
    } catch (error) {
        log(`Failed to migrate container ${containerName}: ${error.message}`);
        return false;
    }
}

// Run the migration
migrateContainers().then(() => {
    log('Migration script completed');
}).catch(error => {
    log(`Fatal error in migration script: ${error.message}`);
});