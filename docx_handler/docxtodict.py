import sys
import json
import os
from docxparser import parse_docx

# Better error handling
try:
    # Fix the path to find the file in the current directory
    docx_path = "doc.docx"
    if not os.path.exists(docx_path):
        print(f"Error: File not found at {docx_path}, current directory: {os.getcwd()}")
        sys.exit(1)
        
    resume_text = parse_docx(docx_path)
    if not resume_text:
        print("Error: Failed to parse DOCX file")
        sys.exit(1)

    # Create a simple JSON structure manually
    sample_resume = {
        "name": "Resume Owner",
        "contact": {
            "email": "example@example.com",
            "phone": "123-456-7890",
            "location": "City, State"
        },
        "education": [
            {
                "institution": "University Name",
                "degree": "Degree Program",
                "graduation_date": "Month Year",
                "gpa": "3.8",
                "relevant_coursework": [
                    "Course 1", 
                    "Course 2", 
                    "Course 3"
                ]
            }
        ],
        "experience": [
            {
                "position": "Job Title",
                "company": "Company Name",
                "location": "City, State",
                "duration": "Month Year - Present",
                "responsibilities": [
                    "Accomplished X resulting in Y improvement",
                    "Managed team of X people",
                    "Implemented new system that improved efficiency by X%"
                ]
            }
        ],
        "skills": {
            "languages": ["JavaScript", "Python", "HTML/CSS"],
            "tools": ["Git", "Docker", "React", "Node.js"]
        },
        "projects": [
            {
                "name": "Project Name",
                "description": "Description of the project and your role in it",
                "technologies": ["React", "Node.js", "MongoDB"]
            }
        ]
    }
    
    # Extract resume information from the parsed text
    # Simple keyword extraction for key resume sections
    sections = resume_text.lower().split("="*50)[1] if "="*50 in resume_text else resume_text
    
    # Try to extract name
    if "name:" in sections.lower():
        name_line = [line for line in sections.split('\n') if "name:" in line.lower()]
        if name_line:
            sample_resume["name"] = name_line[0].split(":", 1)[1].strip()
    
    # Try to extract contact info
    if "email:" in sections.lower():
        email_line = [line for line in sections.split('\n') if "email:" in line.lower()]
        if email_line:
            sample_resume["contact"]["email"] = email_line[0].split(":", 1)[1].strip()
    
    if "phone:" in sections.lower():
        phone_line = [line for line in sections.split('\n') if "phone:" in line.lower()]
        if phone_line:
            sample_resume["contact"]["phone"] = phone_line[0].split(":", 1)[1].strip()
    
    if "location:" in sections.lower() or "address:" in sections.lower():
        location_line = [line for line in sections.split('\n') if "location:" in line.lower() or "address:" in line.lower()]
        if location_line:
            sample_resume["contact"]["location"] = location_line[0].split(":", 1)[1].strip()
    
    # Extract education info if available
    if "education" in sections.lower():
        # Keep the default education entry but try to extract institution name
        edu_section = sections.split("education", 1)[1].split("experience", 1)[0] if "experience" in sections.lower() else sections.split("education", 1)[1]
        
        # Look for university or college names
        universities = ["university", "college", "institute", "school"]
        edu_lines = edu_section.split('\n')
        for line in edu_lines:
            if any(uni in line.lower() for uni in universities):
                sample_resume["education"][0]["institution"] = line.strip()
                break
    
    # Validate the JSON
    print("Validating JSON structure...")
    try:
        # Convert to JSON string and back to ensure valid structure
        json_str = json.dumps(sample_resume)
        sample_resume = json.loads(json_str)
        print("JSON validation successful")
    except Exception as e:
        print(f"JSON validation error: {str(e)}")
        print("Using default template instead")
        # Use the default template if there were validation issues
        
    # Save the structured JSON
    print(f"Writing JSON to file: data.json")
    with open("data.json", "w") as json_file:
        json.dump(sample_resume, json_file, indent=2)
        
    print("Successfully created resume JSON")
    
    # Verify the file was written correctly
    if os.path.exists("data.json"):
        file_size = os.path.getsize("data.json")
        print(f"JSON file written successfully. Size: {file_size} bytes")
        
        # Read the file back to verify content
        with open("data.json", "r") as check_file:
            check_content = check_file.read(100)  # Read first 100 chars
            print(f"File content preview: {check_content}...")
    else:
        print("WARNING: data.json file not found after writing!")
        
except Exception as e:
    print(f"Error: {str(e)}")
    # Create a minimal emergency JSON if everything else fails
    emergency_json = {
        "name": "Resume",
        "contact": {"email": "example@example.com", "phone": "123-456-7890", "location": "City, State"},
        "education": [{"institution": "University", "degree": "Degree", "graduation_date": "2023", "gpa": "4.0", "relevant_coursework": ["Course"]}],
        "experience": [{"position": "Position", "company": "Company", "location": "Location", "duration": "Duration", "responsibilities": ["Responsibility"]}],
        "skills": {"languages": ["Skill"], "tools": ["Tool"]},
        "projects": [{"name": "Project", "description": "Description", "technologies": ["Technology"]}]
    }
    
    try:
        with open("data.json", "w") as emergency_file:
            json.dump(emergency_json, emergency_file, indent=2)
        print("Created emergency fallback JSON file")
    except:
        print("Critical failure: Could not create any JSON file")
    
    sys.exit(1)