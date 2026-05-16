# 🏛️ County Budget Watchdog

**Empowering Citizens through Financial Transparency.**

County budgets are complex, hundreds of pages long, and filled with technical jargon. For the average citizen, understanding where their tax money goes is nearly impossible. **County Budget Watchdog** solves this by turning dense PDF documents into simple, interactive dashboards and an AI-powered conversational interface.

---

## 🧐 The Problem
Most citizens want to know: *"How much money is going to my ward?"* or *"What are the biggest projects this year?"*. However, finding these answers requires digging through massive documents. This lack of transparency leads to disengagement and mistrust. Our app bridges this gap by providing instant, plain-language summaries of county spending.

## 🤖 Agent Architecture

The application operates on a **Full-Stack AI Architecture** designed for high-speed document processing and precise extraction.

### Components:
1.  **The Extractor (Analyst Agent)**: 
    - **Tool**: `gemini-3.1-pro-preview` (via `@google/genai`).
    - **Role**: Automatically scans the uploaded PDF, identifies departmental allocations, ward-specific projects, and the top 5 major infrastructure goals.
    - **Output**: Generates a structured JSON payload that powers the visual dashboard.
2.  **The Watchdog (Interaction Agent)**:
    - **Tool**: `gemini-3-flash-preview`.
    - **Role**: Maintains the context of the specific budget document to answer user questions in "citizen-first" language.
    - **Communication**: Uses a dedicated `/api/ask` endpoint to proxy PDF data to the model for real-time Q&A.

## 🚀 How to Run Locally

1.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url>
    cd county-budget-watchdog
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## 🌐 Interacting with the App

1.  **Upload**: Select an official County Budget PDF (e.g., Annual Development Plan or Program Based Budget).
2.  **Analyze**: Wait a few seconds while the **Analyst Agent** parses the data.
3.  **Explore**: View the extracted allocations, projects per ward, and the executive summary on the dashboard.
4.  **Inquire**: Use the **Watchdog Chat** at the bottom to ask specific questions like *"How much was allocated to the Health department compared to last year?"* (if data is present) or *"What projects are planned for Mpeketoni Ward?"*.

---

## 👥 The Team
- **[Your Name/Team Name]**: Lead Developer & Designer
  - *Role*: Full-stack development, AI Prompt Engineering, and UI/UX Design.

---

*Built with ❤️ for better governance using Google AI Studio.*
