from flask import Flask, request, send_from_directory
import os
import subprocess

app = Flask(__name__, static_folder='.')

@app.route('/blank.html')
def blank_page():
    return send_from_directory('.', 'blank.html')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'docxFile' not in request.files:
        return 'No file part', 400
    
    file = request.files['docxFile']
    
    if file.filename == '':
        return 'No selected file', 400
    
    if not file.filename.endswith('.docx'):
        return 'Please upload a .docx file', 400
    
    # Save the file
    docx_path = os.path.join('docx_handler', 'doc.docx')
    file.save(docx_path)
    
    try:
        # Run the Python script
        result = subprocess.run(['.venv/Scripts/python.exe', 'docx_handler/docxtodict.py'], 
                               capture_output=True, text=True)
        
        if result.returncode != 0:
            return f'Error processing file: {result.stderr}', 500
        
        return 'Success', 200
    except Exception as e:
        return f'Error: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)