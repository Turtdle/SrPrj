#!/bin/bash
set -e

echo "Setting up resume templates..."

# Create necessary directories
mkdir -p mini_website/templates
mkdir -p mini_website/static/css
mkdir -p public/img

# Create professional template HTML
echo "Creating professional template HTML..."
cat > mini_website/templates/professional.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ resume.name }} - Professional Resume</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/professional.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-content">
                <div class="profile-info">
                    <h1>{{ resume.name }}</h1>
                    <p class="title">{{ resume.education[0].degree }}</p>
                </div>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>{{ resume.contact.location }}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:{{ resume.contact.email }}">{{ resume.contact.email }}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <a href="tel:{{ resume.contact.phone }}">{{ resume.contact.phone }}</a>
                    </div>
                </div>
            </div>
        </header>

        <nav>
            <ul>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
            </ul>
        </nav>

        <main>
            <section id="experience" class="section-container">
                <h2 class="section-title">Professional Experience</h2>
                {% for exp in resume.experience %}
                <div class="experience-item">
                    <div class="experience-header">
                        <div class="position-company">
                            <h3>{{ exp.position }}</h3>
                            <h4>{{ exp.company }}</h4>
                        </div>
                        <div class="duration-location">
                            <span class="duration">{{ exp.duration }}</span>
                            <span class="location">{{ exp.location }}</span>
                        </div>
                    </div>
                    <ul class="responsibilities">
                        {% for resp in exp.responsibilities %}
                        <li>{{ resp }}</li>
                        {% endfor %}
                    </ul>
                </div>
                {% endfor %}
            </section>

            <section id="education" class="section-container">
                <h2 class="section-title">Education</h2>
                {% for edu in resume.education %}
                <div class="education-item">
                    <div class="education-header">
                        <div class="institution-degree">
                            <h3>{{ edu.institution }}</h3>
                            <h4>{{ edu.degree }}</h4>
                        </div>
                        <div class="graduation-gpa">
                            <span class="graduation">{{ edu.graduation_date }}</span>
                            {% if edu.gpa %}
                            <span class="gpa">GPA: {{ edu.gpa }}</span>
                            {% endif %}
                        </div>
                    </div>
                    {% if edu.relevant_coursework and edu.relevant_coursework|length > 0 %}
                    <div class="coursework">
                        <h5>Relevant Coursework</h5>
                        <div class="course-list">
                            {% for course in edu.relevant_coursework %}
                            <span class="course">{{ course }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </section>

            <section id="skills" class="section-container">
                <h2 class="section-title">Skills</h2>
                <div class="skills-container">
                    <div class="skill-category">
                        <h3>Languages</h3>
                        <div class="skill-list">
                            {% for lang in resume.skills.languages %}
                            <span class="skill">{{ lang }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    <div class="skill-category">
                        <h3>Tools & Technologies</h3>
                        <div class="skill-list">
                            {% for tool in resume.skills.tools %}
                            <span class="skill">{{ tool }}</span>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" class="section-container">
                <h2 class="section-title">Projects</h2>
                {% for project in resume.projects %}
                <div class="project-item">
                    <h3>{{ project.name }}</h3>
                    <p>{{ project.description }}</p>
                    {% if project.technologies and project.technologies|length > 0 %}
                    <div class="technologies">
                        <h5>Technologies Used</h5>
                        <div class="tech-list">
                            {% for tech in project.technologies %}
                            <span class="technology">{{ tech }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </section>
        </main>

        <footer>
            <p>&copy; {{ now.year }} {{ resume.name }} | Professional Resume</p>
            <p>Generated with Resume Website Generator</p>
        </footer>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Smooth scrolling for navigation
            document.querySelectorAll('nav a').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Active navigation on scroll
            const sections = document.querySelectorAll('section');
            const navItems = document.querySelectorAll('nav ul li a');
            
            function highlightNavItem() {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                        current = section.getAttribute('id');
                    }
                });
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', highlightNavItem);
            highlightNavItem();
        });
    </script>
</body>
</html>
EOL

# Create professional CSS
echo "Creating professional CSS..."
cat > mini_website/static/css/professional.css << 'EOL'
/* professional.css */
:root {
    --primary-color: #283747;
    --secondary-color: #5d6d7e;
    --accent-color: #2c83cb;
    --light-color: #f5f5f5;
    --text-color: #333333;
    --text-light: #777777;
    --border-color: #e1e1e1;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-color);
    font-size: 16px;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0;
    background-color: #ffffff;
    box-shadow: var(--shadow);
}

a {
    color: var(--accent-color);
    text-decoration: none;
    transition: var(--transition);
}

a:hover {
    color: var(--primary-color);
}

ul {
    list-style-type: none;
}

/* Header Styles */
header {
    background-color: var(--primary-color);
    color: #ffffff;
    padding: 50px 40px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 30px;
}

.profile-info h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
}

.profile-info .title {
    font-size: 1.2rem;
    color: #b3c6d1;
    font-weight: 300;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.contact-item i {
    width: 20px;
    text-align: center;
    color: #b3c6d1;
}

.contact-item a {
    color: #ffffff;
}

.contact-item a:hover {
    color: #b3c6d1;
}

/* Navigation Styles */
nav {
    background-color: var(--secondary-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

nav ul {
    display: flex;
    justify-content: center;
    padding: 0;
}

nav ul li {
    padding: 0;
}

nav ul li a {
    display: block;
    padding: 15px 30px;
    color: #ffffff;
    font-weight: 500;
    position: relative;
}

nav ul li a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 3px;
    bottom: 0;
    left: 0;
    background-color: #ffffff;
    transition: var(--transition);
}

nav ul li a:hover::after,
nav ul li a.active::after {
    width: 100%;
}

/* Main Content Styles */
main {
    padding: 50px 40px;
}

.section-container {
    margin-bottom: 50px;
}

.section-title {
    color: var(--primary-color);
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--border-color);
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    width: 70px;
    height: 2px;
    background-color: var(--accent-color);
    bottom: -2px;
    left: 0;
}

/* Experience Section */
.experience-item {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--border-color);
}

.experience-item:last-child {
    border-bottom: none;
}

.experience-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 15px;
}

.position-company h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--accent-color);
    margin-bottom: 5px;
}

.position-company h4 {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--secondary-color);
}

.duration-location {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--text-light);
}

.responsibilities {
    padding-left: 20px;
}

.responsibilities li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 15px;
}

.responsibilities li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--accent-color);
}

/* Education Section */
.education-item {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--border-color);
}

.education-item:last-child {
    border-bottom: none;
}

.education-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 15px;
}

.institution-degree h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--accent-color);
    margin-bottom: 5px;
}

.institution-degree h4 {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--secondary-color);
}

.graduation-gpa {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--text-light);
}

.coursework h5 {
    font-size: 1.1rem;
    color: var(--secondary-color);
    margin: 15px 0 10px;
}

.course-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.course {
    background-color: var(--light-color);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: var(--secondary-color);
}

/* Skills Section */
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
}

.skill-category {
    flex: 1;
    min-width: 250px;
}

.skill-category h3 {
    font-size: 1.2rem;
    color: var(--secondary-color);
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}

.skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.skill {
    background-color: var(--light-color);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: var(--text-color);
    transition: var(--transition);
}

.skill:hover {
    background-color: var(--accent-color);
    color: #ffffff;
    transform: translateY(-3px);
}

/* Projects Section */
.project-item {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--border-color);
}

.project-item:last-child {
    border-bottom: none;
}

.project-item h3 {
    font-size: 1.3rem;
    color: var(--accent-color);
    margin-bottom: 10px;
}

.project-item p {
    margin-bottom: 15px;
    color: var(--text-color);
}

.technologies h5 {
    font-size: 1rem;
    color: var(--secondary-color);
    margin: 15px 0 10px;
}

.tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.technology {
    background-color: var(--light-color);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: var(--secondary-color);
}

/* Footer Styles */
footer {
    background-color: var(--primary-color);
    color: #ffffff;
    text-align: center;
    padding: 25px 0;
    margin-top: 50px;
}

footer p {
    margin: 5px 0;
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .contact-info {
        width: 100%;
    }
    
    nav ul {
        overflow-x: auto;
    }
    
    nav ul li a {
        padding: 15px 20px;
    }
    
    .experience-header, .education-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .duration-location, .graduation-gpa {
        align-items: flex-start;
        margin-top: 5px;
    }
}

@media (max-width: 576px) {
    header {
        padding: 30px 20px;
    }
    
    main {
        padding: 30px 20px;
    }
    
    .section-title {
        font-size: 1.6rem;
    }
    
    .position-company h3, .institution-degree h3 {
        font-size: 1.3rem;
    }
    
    .position-company h4, .institution-degree h4 {
        font-size: 1.1rem;
    }
}
EOL

# Create Dockerfile for the professional template
echo "Creating Dockerfile for the professional template..."
cat > resume-template/Dockerfile.professional << 'EOL'
FROM nginx:alpine

# Install Python and Flask for template rendering
RUN apk add --update python3 py3-pip
RUN pip3 install flask Werkzeug

WORKDIR /app

# Create directory structure
RUN mkdir -p /app/templates /app/static/css /app/static/js /var/log

# Copy the professional template files
COPY mini_website/templates/professional.html /app/templates/
COPY mini_website/static/css/professional.css /app/static/css/

# Create startup script
RUN echo '#!/bin/sh \n\
python3 /app/app.py &\n\
nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

# Create Flask app for template rendering
RUN echo "from flask import Flask, render_template, jsonify\n\
import json\n\
import datetime\n\
\n\
app = Flask(__name__)\n\
\n\
@app.route('/')\n\
def index():\n\
    try:\n\
        with open('/usr/share/nginx/html/data.json', 'r') as f:\n\
            resume_data = json.load(f)\n\
        return render_template('professional.html', resume=resume_data, now=datetime.datetime.now())\n\
    except Exception as e:\n\
        return jsonify({'error': str(e)}), 500\n\
\n\
if __name__ == '__main__':\n\
    app.run(host='0.0.0.0', port=5000)" > /app/app.py

# Configure nginx to proxy requests to Flask
RUN echo 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    \n\
    location / {\n\
        proxy_pass http://localhost:5000;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
    }\n\
    \n\
    location /static/ {\n\
        alias /app/static/;\n\
    }\n\
    \n\
    location /data.json {\n\
        root /usr/share/nginx/html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Set up log files
RUN touch /var/log/container-startup.log /var/log/container-debug.log && \
    chmod 666 /var/log/container-startup.log /var/log/container-debug.log

EXPOSE 80

CMD ["/start.sh"]
EOL

# Create simple template preview images
echo "Creating template preview images..."
mkdir -p public/img
cat > public/img/template-standard.png << 'EOL'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==
EOL

cat > public/img/template-professional.png << 'EOL'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==
EOL

# Build Docker images
#echo "Building Docker images..."
#docker build -t resume-viewer -f resume-template/Dockerfile.build .
#docker build -t resume-viewer-professional -f resume-template/Dockerfile.professional .

echo "Setup complete! Both templates are now ready to use."