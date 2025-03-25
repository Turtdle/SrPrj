from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key in production
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'json'}

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'jsonFile' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['jsonFile']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Read and validate JSON
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Store the file path in session
            session['json_filepath'] = filepath
            session['resume_data'] = data
            
            return jsonify({"success": True, "message": "File uploaded successfully"}), 200
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file"}), 400
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/preview')
def preview():
    if 'resume_data' not in session:
        return redirect(url_for('index'))
    
    resume_data = session['resume_data']
    return render_template('preview.html', resume=resume_data)

@app.route('/generate')
def generate():
    if 'resume_data' not in session:
        return redirect(url_for('index'))
    
    resume_data = session['resume_data']
    return render_template('generated.html', resume=resume_data)

if __name__ == '__main__':
    app.run(debug=True)