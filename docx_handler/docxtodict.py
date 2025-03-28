import sys
import json
import os
import ast
import anthropic
from docxparser import parse_docx
client = anthropic.Anthropic(api_key="")

resume_text = parse_docx("doc.docx")

format_json = {
  "name": "",
  "contact": {
    "location": "",
    "phone": "",
    "email": ""
  },
  "education": [
    {
      "institution": "",
      "degree": "",
      "graduation_date": "",
      "gpa": "",
      "relevant_coursework": []
    }
  ],
  "experience": [
    {
      "position": "",
      "company": "",
      "location": "",
      "duration": "",
      "responsibilities": [
        ""
      ]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [
        ""
      ]
    }
  ],
  "skills": {
    "languages": [
      ""
    ],
    "tools": [
      ""
    ]
  }
}

message = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1000,
    temperature=1,
    system="You are a perfect program converting natural language into json; Do not include any formatting including newlines or text other than json",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please convert this doc into json, seperating the resume into parts such as {experience : [experience], education : [education], etc}: " + resume_text
                    + "please make sure to fill out these fields exactly; If you are missing information leave it blank but still include the field:\n\n"
                    + str(format_json)
                }
            ]
        }
    ]
)
text_blocks = message.content 
string_content = ''
for block in text_blocks:
    string_content += block.text

print(string_content)

try:
    actual_dict = ast.literal_eval(string_content)
except Exception as e:
    print(f"Error parsing JSON with ast: {e}")
    try:
        actual_dict = json.loads(string_content)
    except Exception as e2:
        print(f"Error with json.loads: {e2}")
        try:
            fixed_string = string_content.replace("'", '"')
            actual_dict = json.loads(fixed_string)
        except Exception as e3:
            print(f"All parsing attempts failed: {e3}")
            actual_dict = {}

print("Actual dictionary keys:", actual_dict.keys())
for key in actual_dict.keys():
    print(f"Type of {key}: {type(actual_dict[key])}")
    if isinstance(actual_dict[key], dict):
        print(f"  Subkeys of {key}: {actual_dict[key].keys()}")
    elif isinstance(actual_dict[key], list) and len(actual_dict[key]) > 0:
        print(f"  First item keys in {key}: {actual_dict[key][0].keys() if isinstance(actual_dict[key][0], dict) else 'Not a dict'}")

def transform_to_react_format(input_dict):
    result = {
        "name": "",
        "contact": {
            "email": "",
            "phone": "",
            "location": ""
        },
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {
            "languages": [],
            "tools": []
        }
    }
    
    if "personalInfo" in input_dict:
        personal = input_dict["personalInfo"]
        result["name"] = personal.get("name", "")
        result["contact"]["email"] = personal.get("email", "")
        result["contact"]["phone"] = personal.get("phone", "")
        result["contact"]["location"] = personal.get("location", "")
    else:
        result["name"] = input_dict.get("name", "")
        if "contact" in input_dict:
            result["contact"] = input_dict["contact"]
        else:
            result["contact"]["email"] = input_dict.get("email", "")
            result["contact"]["phone"] = input_dict.get("phone", "")
            result["contact"]["location"] = input_dict.get("location", "")
    
    education_data = input_dict.get("education", [])
    for edu in education_data:
        relevant_courses = edu.get("relevantCoursework", [])
        if isinstance(relevant_courses, str):
            relevant_courses = [course.strip() for course in relevant_courses.split(",")]
        
        education_item = {
            "institution": edu.get("institution", ""),
            "degree": edu.get("degree", ""),
            "graduation_date": edu.get("graduationDate", edu.get("graduation_date", "")),
            "gpa": str(edu.get("gpa", "")),
            "relevant_coursework": relevant_courses
        }
        result["education"].append(education_item)
    
    experience_data = input_dict.get("workExperience", input_dict.get("experience", []))
    for exp in experience_data:
        experience_item = {
            "position": exp.get("position", ""),
            "company": exp.get("company", ""),
            "location": exp.get("location", ""),
            "duration": exp.get("duration", ""),
            "responsibilities": exp.get("responsibilities", [])
        }
        result["experience"].append(experience_item)
    
    projects_data = input_dict.get("projects", input_dict.get("software_projects", []))
    for proj in projects_data:
        project_item = {
            "name": proj.get("name", ""),
            "description": proj.get("description", ""),
            "technologies": proj.get("technologies", [])
        }
        result["projects"].append(project_item)
    
    if "skills" in input_dict:
        result["skills"]["languages"] = input_dict["skills"].get("languages", [])
        result["skills"]["tools"] = input_dict["skills"].get("tools", [])
    
    return result

transformed_dict = transform_to_react_format(actual_dict)

print("\nOriginal data structure:")
print(json.dumps(actual_dict, indent=2)[:500] + "...")
print("\nTransformed data structure:")
print(json.dumps(transformed_dict, indent=2)[:500] + "...")

locations = [
    "data.json",            
    "/app/data.json",        
    "../data.json",
    "/data.json",           
]

print(f"Writing JSON to file at multiple locations")
for location in locations:
    try:
        parent_dir = os.path.dirname(location)
        if parent_dir and not os.path.exists(parent_dir):
            os.makedirs(parent_dir, exist_ok=True)
            
        with open(location, "w") as json_file:
            json.dump(transformed_dict, json_file, indent=2)
        print(f"Successfully wrote JSON to: {location}")
    except Exception as e:
        print(f"Error writing to {location}: {e}")

print("Successfully created resume JSON")