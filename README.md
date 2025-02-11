# Nimbus Prompter 2000 for Marketers

This is a ChatGPT clone built with **Next.js** and **MongoDB**, designed specifically for marketers to learn prompt engineering. It includes **built-in prompts and personalities** to help marketers craft effective AI-driven content.

<p align="center">
  <img src="/images/nimbus-prompter.png" />
</p>

## 🚀 Features

- **Predefined Prompts** – Jumpstart conversations with built-in prompts tailored for marketing tasks.
- **Customizable Personalities** – Interact with AI personas like a grumpy engineer, social media influencer, or data-driven analyst.
- **Chat History Storage** – Conversations are stored in **MongoDB** for future reference.
- **Next.js API Routes** – Server-side processing for efficient AI interactions.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) – A React framework for building server-rendered applications.
- **Database:** [MongoDB](https://www.mongodb.com/) – Stores chat histories for persistent conversations.
- **AI Model:** Uses OpenAI's API (or a local LLM, depending on configuration).

## 📦 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/thefalc/llm-prompt-tester.git
   cd llm-prompt-tester
1. Create a .env file with the following:
```bash
OPENAI_API_KEY='REPLACE_ME'
MONGODB_URI='REPLACE_ME'
SESSION_PASSWORD='REPLACE_ME'
```
1. Run the development server:
```bash
npm install
npm run dev
```
1. Open http://localhost:3000 in your browser.

# 📚 Usage

* Select a predefined prompt or enter your own.
* Choose a persona (e.g., Overworked Manager, Pirate Captain) for AI responses.
* Interact with AI and refine prompts to improve prompt engineering skills.
* View chat history stored in MongoDB.


