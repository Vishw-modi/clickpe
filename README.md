🚀 Loan Recommendation Dashboard with AI Assistant

A responsive Next.js + Supabase application that displays loan products and allows users to chat with an AI assistant for loan-specific questions.

This project was built as part of the ClickPe Engineering Assignment.

✨ Features
🔎 Loan Product Explorer

Browse all loan products pulled directly from Supabase.

View top recommended loans on the dashboard.

Filter & explore loans (APR, income, credit score, etc.).

🤖 AI Assistant — “Ask About This Loan”

Each loan includes an Ask AI button that opens a chat drawer where the user can ask questions such as:

Interest rate (APR)

Minimum income requirement

Minimum credit score

Loan tenure (min & max months)

Processing fees

Prepayment rules

Disbursal speed

Documentation level

Summary of the loan

FAQs provided in the database

Terms & conditions

The AI only answers using actual product data from Supabase (no hallucinations).

⚡ Tech Stack

Next.js 14 / App Router

Supabase (PostgreSQL + RLS)

shadcn/ui for modern UI components

Google Gemini 1.5 API for AI responses

TypeScript

Fully responsive & optimized UI

📂 Project Structure
app/
  dashboard/page.tsx       → Top recommendations + loan cards
  all-products/page.tsx    → All loan products
  api/ai/ask/route.ts      → AI route w/ Gemini integration
components/
  ProductCard.tsx
  ChatDrawer.tsx
  ChatMessage.tsx
lib/
  supabase.ts
  badgeUtils.ts
supabase/
  schema.sql               → Provided schema + seeded loans

🧠 How the AI Works

Frontend sends:

productId

user's latest question

chat history

Backend:

Fetches product details from Supabase

Builds a structured prompt with all loan metadata

Starts a Gemini chat session

Responds only using DB-backed facts

Returns AI response to UI.

🛠️ Getting Started
1️⃣ Install dependencies
npm install

2️⃣ Add environment variables

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

GEMINI_API_KEY=xxxx

3️⃣ Start development server
npm run dev


Your app runs at:
👉 http://localhost:3000

🗄️ Database Schema (Supabase)

The project uses the provided schema:

products — loan products

ai_chat_messages — (optional, not required for assignment)

Seed data includes 10 example loans.

🎯 Assignment Goals Completed

✔ Displayed recommended loans
✔ Displayed all loans
✔ Built "Ask AI" chat drawer for each loan
✔ Integrated AI using Gemini API
✔ Ensured AI answers only with database-backed information
✔ Clean UI with shadcn components
✔ Fully functional application