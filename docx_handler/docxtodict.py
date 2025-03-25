import anthropic
from docxparser import parse_docx
import ast
client = anthropic.Anthropic()

resume_text = parse_docx("docx_handler/doc.docx")

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


actual_dict = ast.literal_eval(string_content)


import json
with open("data.json", "w") as json_file:
    json.dump(actual_dict, json_file)