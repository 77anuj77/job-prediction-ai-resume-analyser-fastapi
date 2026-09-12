from typing import Dict, List


SKILL_ROADMAP = {
    "docker": {
        "category": "devops",
        "why": "Docker helps package and deploy applications consistently across different environments.",
        "learn": [
            "Learn containers, images, Dockerfile, volumes, and ports.",
            "Containerize one FastAPI or Streamlit project.",
            "Push the Docker image to Docker Hub.",
            "Deploy the Dockerized app on Render, Railway, or a VPS.",
        ],
        "project": "Dockerize your AI Resume-to-Job Analyzer backend.",
    },
    "kubernetes": {
        "category": "devops",
        "why": "Kubernetes is used to manage and scale containerized applications.",
        "learn": [
            "Learn pods, deployments, services, and namespaces.",
            "Run a simple app locally using Minikube.",
            "Deploy a Dockerized FastAPI app on Kubernetes.",
        ],
        "project": "Deploy your Dockerized resume analyzer using Kubernetes locally.",
    },
    "fastapi": {
        "category": "backend",
        "why": "FastAPI is used to build fast, production-ready Python APIs.",
        "learn": [
            "Learn routes, request body, response models, and status codes.",
            "Learn file upload and form handling.",
            "Add validation, error handling, and API documentation.",
        ],
        "project": "Create a FastAPI backend for resume PDF upload and JD analysis.",
    },
    "flask": {
        "category": "backend",
        "why": "Flask is a lightweight Python web framework for APIs and web apps.",
        "learn": [
            "Learn routes, request handling, templates, and JSON responses.",
            "Build a simple REST API.",
            "Connect Flask with a machine learning model.",
        ],
        "project": "Build a Flask API for ML prediction.",
    },
    "django": {
        "category": "backend",
        "why": "Django is used to build full-stack web applications quickly.",
        "learn": [
            "Learn models, views, templates, and URLs.",
            "Learn Django ORM and admin panel.",
            "Build authentication and CRUD features.",
        ],
        "project": "Build a job application tracker using Django.",
    },
    "sql": {
        "category": "database",
        "why": "SQL is important for querying and managing structured data.",
        "learn": [
            "Learn SELECT, WHERE, GROUP BY, ORDER BY, and JOIN.",
            "Practice subqueries and window functions.",
            "Connect SQL database with a backend API.",
        ],
        "project": "Store resume analysis history in a SQL database.",
    },
    "mysql": {
        "category": "database",
        "why": "MySQL is widely used for storing structured application data.",
        "learn": [
            "Learn database creation, tables, primary keys, and foreign keys.",
            "Practice joins and aggregations.",
            "Connect MySQL with FastAPI using SQLAlchemy.",
        ],
        "project": "Save resume analysis results in MySQL.",
    },
    "postgresql": {
        "category": "database",
        "why": "PostgreSQL is a powerful production-grade relational database.",
        "learn": [
            "Learn tables, joins, indexes, and constraints.",
            "Use PostgreSQL with SQLAlchemy.",
            "Deploy PostgreSQL on Render or Supabase.",
        ],
        "project": "Store user resume analysis history in PostgreSQL.",
    },
    "machine learning": {
        "category": "ai_ml",
        "why": "Machine learning helps improve matching beyond simple keyword comparison.",
        "learn": [
            "Learn supervised learning, model training, and evaluation.",
            "Understand classification, regression, and similarity models.",
            "Build a baseline model with scikit-learn.",
        ],
        "project": "Train a model to predict resume-job fit.",
    },
    "deep learning": {
        "category": "ai_ml",
        "why": "Deep learning is useful for complex NLP, vision, and representation learning tasks.",
        "learn": [
            "Learn neural networks, activation functions, and backpropagation basics.",
            "Learn embeddings and transformer basics.",
            "Use pretrained models for text similarity.",
        ],
        "project": "Use sentence-transformers for resume-JD semantic similarity.",
    },
    "nlp": {
        "category": "ai_ml",
        "why": "NLP is essential for understanding resume and job description text.",
        "learn": [
            "Learn tokenization, stopwords, stemming, and lemmatization.",
            "Learn TF-IDF and embeddings.",
            "Apply NLP to extract skills from resumes.",
        ],
        "project": "Build a skill extractor from resume text.",
    },
    "scikit-learn": {
        "category": "ai_ml",
        "why": "Scikit-learn is useful for TF-IDF, similarity, and ML baselines.",
        "learn": [
            "Learn TF-IDF vectorization.",
            "Learn cosine similarity.",
            "Train simple classification models.",
        ],
        "project": "Build a TF-IDF based resume-JD similarity engine.",
    },
    "pandas": {
        "category": "data",
        "why": "Pandas is required for dataset cleaning and analysis.",
        "learn": [
            "Learn dataframe operations, filtering, grouping, and missing value handling.",
            "Clean resume and job datasets.",
            "Create final processed CSV files.",
        ],
        "project": "Clean and analyze the Indian Naukri job dataset.",
    },
    "numpy": {
        "category": "data",
        "why": "NumPy supports numerical operations used in machine learning pipelines.",
        "learn": [
            "Learn arrays, indexing, broadcasting, and vector operations.",
            "Use NumPy for numerical calculations.",
            "Use NumPy with scikit-learn outputs.",
        ],
        "project": "Use NumPy to calculate weighted resume match scores.",
    },
    "power bi": {
        "category": "data",
        "why": "Power BI is used for business intelligence dashboards and reporting.",
        "learn": [
            "Learn data import, data cleaning, and relationships.",
            "Learn DAX basics.",
            "Build dashboards from job market data.",
        ],
        "project": "Create an Indian tech job market dashboard.",
    },
    "tableau": {
        "category": "data",
        "why": "Tableau is used for interactive data visualization and dashboards.",
        "learn": [
            "Learn charts, filters, calculated fields, and dashboards.",
            "Create role-wise and location-wise job analysis.",
        ],
        "project": "Build a dashboard showing skill demand across Indian cities.",
    },
    "aws": {
        "category": "cloud",
        "why": "AWS is useful for cloud deployment and production infrastructure.",
        "learn": [
            "Learn EC2, S3, IAM, and basic networking.",
            "Deploy a simple backend API on EC2.",
            "Store files in S3.",
        ],
        "project": "Deploy your resume analyzer backend on AWS EC2.",
    },
    "azure": {
        "category": "cloud",
        "why": "Azure is widely used by enterprises for cloud services and deployment.",
        "learn": [
            "Learn Azure App Service, Blob Storage, and basic cloud concepts.",
            "Deploy a Python API on Azure App Service.",
        ],
        "project": "Deploy your FastAPI resume analyzer on Azure.",
    },
    "gcp": {
        "category": "cloud",
        "why": "Google Cloud is useful for deploying ML and data applications.",
        "learn": [
            "Learn Cloud Run, Cloud Storage, and IAM basics.",
            "Deploy a containerized API on Cloud Run.",
        ],
        "project": "Deploy your Dockerized resume analyzer on Google Cloud Run.",
    },
    "streamlit": {
        "category": "frontend",
        "why": "Streamlit helps build quick interactive ML web apps.",
        "learn": [
            "Learn file uploader, text area, buttons, columns, and metrics.",
            "Connect Streamlit with FastAPI using requests.",
        ],
        "project": "Build the frontend for your resume analyzer.",
    },
    "react": {
        "category": "frontend",
        "why": "React is used to build modern frontend applications.",
        "learn": [
            "Learn components, props, state, and hooks.",
            "Build forms and API integration.",
            "Connect React frontend with FastAPI backend.",
        ],
        "project": "Build a React frontend for your resume analyzer.",
    },
    "git": {
        "category": "tools",
        "why": "Git is important for version control and collaboration.",
        "learn": [
            "Learn add, commit, push, pull, branch, and merge.",
            "Use meaningful commits for each project milestone.",
        ],
        "project": "Maintain clean version control for your resume analyzer.",
    },
    "github": {
        "category": "tools",
        "why": "GitHub is important for showcasing your project to recruiters.",
        "learn": [
            "Learn README writing, repository structure, and project documentation.",
            "Add screenshots, demo video, and deployment link.",
        ],
        "project": "Publish the complete AI Resume-to-Job Analyzer on GitHub.",
    },
}


CATEGORY_ROADMAPS = {
    "programming": {
        "why": "Programming skills are required to build software, scripts, APIs, and automation systems.",
        "learn": [
            "Learn syntax, functions, loops, and data structures.",
            "Practice problem-solving and build small projects.",
            "Use the language in one real project and add it to your resume.",
        ],
        "project": "Build a small CLI tool or web API using this programming language.",
    },
    "backend": {
        "why": "Backend skills help you build APIs, business logic, and server-side applications.",
        "learn": [
            "Learn routing, request/response handling, and validation.",
            "Connect backend with a database.",
            "Add authentication, logging, and error handling.",
        ],
        "project": "Build a REST API for a real use case.",
    },
    "frontend": {
        "why": "Frontend skills help you build user-facing interfaces.",
        "learn": [
            "Learn components, layout, forms, and API calls.",
            "Build a clean UI for a backend project.",
            "Deploy the frontend online.",
        ],
        "project": "Create a frontend for your AI Resume-to-Job Analyzer.",
    },
    "database": {
        "why": "Database skills help you store, query, and manage application data.",
        "learn": [
            "Learn schema design and CRUD operations.",
            "Practice joins, filtering, indexing, and aggregation.",
            "Connect the database with a backend API.",
        ],
        "project": "Store resume analysis results and user history in a database.",
    },
    "ai_ml": {
        "why": "AI/ML skills help you build intelligent systems and prediction models.",
        "learn": [
            "Learn data preprocessing, model training, and evaluation.",
            "Build a baseline ML model.",
            "Deploy the model using FastAPI or Streamlit.",
        ],
        "project": "Build and deploy a machine learning project end-to-end.",
    },
    "data": {
        "why": "Data skills help you clean, analyze, and visualize real datasets.",
        "learn": [
            "Learn data cleaning, EDA, grouping, and visualization.",
            "Work with a real-world dataset.",
            "Create insights and visual reports.",
        ],
        "project": "Analyze Indian job market data and create a dashboard.",
    },
    "cloud": {
        "why": "Cloud skills help you deploy and scale applications.",
        "learn": [
            "Learn compute, storage, IAM, and deployment basics.",
            "Deploy one backend project.",
            "Monitor logs and manage environment variables.",
        ],
        "project": "Deploy your resume analyzer on a cloud platform.",
    },
    "devops": {
        "why": "DevOps skills help automate deployment and manage production workflows.",
        "learn": [
            "Learn Git, Docker, CI/CD, and deployment basics.",
            "Containerize one project.",
            "Create a simple GitHub Actions workflow.",
        ],
        "project": "Dockerize and automate deployment of your resume analyzer.",
    },
    "tools": {
        "why": "Tooling skills improve collaboration, productivity, and professional workflow.",
        "learn": [
            "Learn the core workflow of the tool.",
            "Use it in one real project.",
            "Document how you used it in your README.",
        ],
        "project": "Use this tool inside your current project workflow.",
    },
    "general": {
        "why": "This skill is mentioned in the job description and may improve your job fit.",
        "learn": [
            "Understand what the skill means in the target role.",
            "Learn the basics from documentation or tutorials.",
            "Apply it in a small project or case study.",
        ],
        "project": "Create a mini project or resume bullet showing this skill.",
    },
}


SKILL_CATEGORY_MAP = {
    "python": "programming",
    "java": "programming",
    "c++": "programming",
    "c#": "programming",
    "javascript": "programming",
    "typescript": "programming",
    "html": "frontend",
    "css": "frontend",
    "react": "frontend",
    "next.js": "frontend",
    "streamlit": "frontend",
    "fastapi": "backend",
    "flask": "backend",
    "django": "backend",
    "node.js": "backend",
    "rest api": "backend",
    "sql": "database",
    "mysql": "database",
    "postgresql": "database",
    "mongodb": "database",
    "machine learning": "ai_ml",
    "deep learning": "ai_ml",
    "nlp": "ai_ml",
    "computer vision": "ai_ml",
    "pandas": "data",
    "numpy": "data",
    "matplotlib": "data",
    "seaborn": "data",
    "power bi": "data",
    "tableau": "data",
    "aws": "cloud",
    "azure": "cloud",
    "gcp": "cloud",
    "docker": "devops",
    "kubernetes": "devops",
    "git": "tools",
    "github": "tools",
    "linux": "tools",
}


def get_skill_category(skill: str) -> str:
    skill = skill.lower().strip()

    if skill in SKILL_CATEGORY_MAP:
        return SKILL_CATEGORY_MAP[skill]

    if any(word in skill for word in ["python", "java", "javascript", "programming"]):
        return "programming"

    if any(word in skill for word in ["api", "backend", "server"]):
        return "backend"

    if any(word in skill for word in ["react", "frontend", "ui", "html", "css"]):
        return "frontend"

    if any(word in skill for word in ["sql", "database", "mongodb", "postgres"]):
        return "database"

    if any(word in skill for word in ["machine learning", "deep learning", "ai", "nlp", "vision"]):
        return "ai_ml"

    if any(word in skill for word in ["data", "analytics", "pandas", "excel", "power bi", "tableau"]):
        return "data"

    if any(word in skill for word in ["aws", "azure", "gcp", "cloud"]):
        return "cloud"

    if any(word in skill for word in ["docker", "kubernetes", "ci cd", "devops"]):
        return "devops"

    return "general"


def generate_skill_roadmap(missing_skills: List[str]) -> List[Dict]:
    roadmap = []

    for skill in missing_skills:
        skill_lower = skill.lower().strip()

        if not skill_lower:
            continue

        if skill_lower in SKILL_ROADMAP:
            roadmap.append(
                {
                    "skill": skill_lower,
                    "category": SKILL_ROADMAP[skill_lower]["category"],
                    "why": SKILL_ROADMAP[skill_lower]["why"],
                    "learn": SKILL_ROADMAP[skill_lower]["learn"],
                    "project": SKILL_ROADMAP[skill_lower]["project"],
                }
            )
            continue

        category = get_skill_category(skill_lower)
        category_template = CATEGORY_ROADMAPS.get(category, CATEGORY_ROADMAPS["general"])

        roadmap.append(
            {
                "skill": skill_lower,
                "category": category,
                "why": category_template["why"],
                "learn": [
                    step.replace("this skill", skill_lower)
                    for step in category_template["learn"]
                ],
                "project": category_template["project"],
            }
        )

    return roadmap


if __name__ == "__main__":
    missing = [
        "docker",
        "aws",
        "fastapi",
        "tensorflow",
        "power bi",
        "unknown skill example",
    ]

    roadmap = generate_skill_roadmap(missing)

    for item in roadmap:
        print("\nSkill:", item["skill"])
        print("Category:", item["category"])
        print("Why:", item["why"])
        print("Learn:")
        for step in item["learn"]:
            print("-", step)
        print("Project:", item["project"])