import anthropic
from docxparser import parse_docx
import ast
import json
import os
import sys

# Better error handling
try:
    docx_path = "docx_handler/doc.docx"
    if not os.path.exists(docx_path):
        print(f"Error: File not found at {docx_path}")
        sys.exit(1)
        
    resume_text = parse_docx(docx_path)
    if not resume_text:
        print("Error: Failed to parse DOCX file")
        sys.exit(1)
    
    # Initialize Claude client with API key
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)
        
    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1000,
        temperature=0.2,  # Lower temperature for more consistent formatting
        system="You are a perfect program converting natural language into json; Do not include any formatting including newlines or text other than json",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Please convert this doc into json, separating the resume into parts such as {experience: [experience], education: [education], skills: {languages: [], tools: []}, projects: [], contact: {}, name: ''}: " + resume_text
                    }
                ]
            }
        ]
    )
    
    text_blocks = message.content 
    string_content = ''
    for block in text_blocks:
        string_content += block.text

    # Validate JSON before saving
    try:
        actual_dict = json.loads(string_content)
        
        # Ensure required fields exist
        required_fields = ["experience", "education", "skills", "contact", "name"]
        for field in required_fields:
            if field not in actual_dict:
                actual_dict[field] = [] if field in ["experience", "education"] else {}
                
        # Add empty projects array if missing
        if "projects" not in actual_dict:
            actual_dict["projects"] = []
            
        # Ensure skills has necessary subfields
        if "skills" in actual_dict and isinstance(actual_dict["skills"], dict):
            if "languages" not in actual_dict["skills"]:
                actual_dict["skills"]["languages"] = []
            if "tools" not in actual_dict["skills"]:
                actual_dict["skills"]["tools"] = []
                
        # Save the structured JSON
        with open("data.json", "w") as json_file:
            json.dump(actual_dict, json_file, indent=2)
            
        print("Successfully converted resume to JSON")
        
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON response from Claude: {e}")
        print(f"Raw response: {string_content}")
        sys.exit(1)
        
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)