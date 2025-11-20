# Agentic CV Architect

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2?logo=google)
![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-38B2AC?logo=tailwindcss)

> **A multi-agent simulation powered by Google's Gemini 2.5 Flash to deconstruct, analyze, and optimize resumes against complex job descriptions.**

---

## Overview

**Agentic CV Architect** is not just another resume checker. It is a sophisticated analysis tool that simulates a team of specialized recruiting agents. By leveraging the multimodal capabilities of the **Gemini API**, it parses complex documents (PDF/DOCX), understands semantic nuance, and provides strategic, actionable advice to maximize interview conversion rates.

The application features a high-fidelity "Glassmorphism" UI, real-time agent visualization, and a local persistence layer for managing multiple job applications.

---

## Key Features

### The Agentic Workflow
Watch the analysis happen in real-time via the **Agent Visualizer**:
1.  **Validation Agent**: Checks content density and file integrity.
2.  **Extraction Agent**: Parses semantic layers and maps skill vectors.
3.  **Analyst Agent**: Performs gap analysis and calculates fit scores.

### Deep Analysis Engine
*   **Score Decomposition**: Breaks down fit into Technical, Soft Skills, and Experience sub-scores.
*   **Critical Adjustments**: Identifies "Must Fix" red flags that trigger ATS rejection.
*   **Noise Reduction**: Specific advice on what to *remove* or shorten.
*   **Keyword Injection**: Context-aware suggestions for Summary, Project, or Vocabulary upgrades.

### Strategic Tools
*   **Interview Prep**: Generates difficult questions based on *your specific weaknesses* and provides STAR-method answers.
*   **Summary Rewriter**: AI-generated professional summary tailored exactly to the Job Description.
*   **History Management**: Save versions of your CV in job-specific folders (e.g., "Google Frontend Role", "Netflix Backend Role").
*   **PDF & DOCX Support**: Native browser-based parsing using `pdf.js` and `mammoth.js`.

---

## Tech Stack

*   **Core**: React 19, TypeScript, Vite
*   **AI Model**: Google Gemini 2.5 Flash (`@google/genai`)
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **Document Processing**:
    *   `pdfjs-dist` (PDF Text Extraction)
    *   `mammoth` (DOCX Text Extraction)
*   **Persistence**: LocalStorage with JSON serialization

---

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/agentic-cv-architect.git
    cd agentic-cv-architect
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

---

## Usage Guide

1.  **Input Phase**:
    *   Drag & Drop your Resume (PDF/DOCX) into the left panel.
    *   Paste the Job Description into the right panel.
2.  **Orchestration**:
    *   Click **"Run Architect"**.
    *   Observe the agents processing data in the visualizer.
3.  **Review & Optimize**:
    *   Check your **Match Score**.
    *   Review **Critical Adjustments** (High Priority).
    *   Copy the **Improved Summary**.
    *   Use the **Keyword Recommendations** to update your CV file.
4.  **Archive**:
    *   Click **Save Analysis**.
    *   Assign a Job Title (Folder) and Version Name.
    *   Access previous scans via the **History** button in the navbar.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with Generative AI</sub>
</div>