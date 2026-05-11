ZapOrder
AI-powered contactless restaurant ordering system — QR code menu access, real-time kitchen dashboard, and admin panel. Built with Next.js, PostgreSQL, Prisma, and Google Gemini.

Tech Stack: Next.js 15 · React 19 · PostgreSQL · Prisma ORM · NextAuth.js · Vercel AI SDK · Google Gemini · SCSS

✅ Prerequisites
Before you begin, make sure you install the following on your PC:

Tool	Version	Download
Node.js	v20.x (LTS)	https://nodejs.org
Git	Latest	https://git-scm.com/download/win
PostgreSQL	Latest	https://www.postgresql.org/download/windows
🛠️ Installation & Setup
1. Install Node.js
Go to https://nodejs.org and download the LTS version

Run the installer and keep clicking Next until it finishes

Verify the installation — open Command Prompt (Win + R → type cmd → press Enter):

node -v # Should output v20.x.x npm -v # Should output a version number

Copy 2. Install Git Go to https://git-scm.com/download/win

Download and run the installer with all default settings

Verify:

git --version

Install PostgreSQL Go to https://www.postgresql.org/download/windows and click Download the installer
Run the installer:

Set a password you will remember (e.g. admin123) — this is your database superuser password

Leave the port as 5432

Keep everything else as default

pgAdmin will be installed alongside PostgreSQL — this is the visual tool you'll use to manage your database

Set Up the Database Open pgAdmin from the Start Menu
In the left panel, expand Servers → PostgreSQL

Right-click Databases → Create → Database

Name it ZapOrder and click Save

Then create a dedicated database user:

Right-click Login/Group Roles → Create → Login/Group Role

General tab → Name: zapuser

Definition tab → Password: zappass123

Privileges tab → enable Can login and Superuser

Click Save

Clone the Repository
Navigate to where you want to save the project
cd Desktop

Clone the repository
git clone https://github.com/YOUR_USERNAME/ZapOrder.git

Move into the project folder
cd ZapOrder

Install Dependencies
Install all required packages (this may take a few minutes)
npm install

Set Up Environment Variables Create a file called .env.local in the root of the project folder and paste the following:
PostgreSQL connection string
DATABASE_URL=postgresql://zapuser:zappass123@localhost:5432/ZapOrder

NextAuth — replace secret with any long random string
NEXTAUTH_SECRET=anylongrandomstringofcharacters123456 NEXTAUTH_URL=http://localhost:3000

Registration secret — only you should know this
REGISTER_SECRET=your_secret_here NEXT_PUBLIC_REGISTER_SECRET=your_secret_here

AI Providers — add at least one key (Groq is free: https://console.groq.com)
AI_GROQ_KEY=your_groq_api_key AI_CEREBRAS_KEY= AI_GOOGLE_KEY= AI_SILICONFLOW_KEY=

env ⚠️ Replace zapuser and zappass123 with the credentials you created in pgAdmin. For NEXTAUTH_SECRET, type any long random string of letters and numbers. You need at least one AI provider key. Groq is free and recommended.

Set Up Database Tables
Apply all database migrations
npx prisma migrate deploy

Generate the Prisma client
npx prisma generate

Seed Demo Data (Optional) Load a sample restaurant to test the app immediately:
node setup.mjs

This creates a demo restaurant called Nova Kitchen:

Field Value Email: gemelli@gmail.com Password gemelli123

How to Run Development Mode npm run play

Copy bash You should see:

▲ Next.js 15.x.x

Local: http://localhost:3000
Copy Open your browser and visit:

Page URL Homepage / Admin Login http://localhost:3000 Customer Menu (demo) http://localhost:3000/nova?table=table1 Admin Dashboard http://localhost:3000/dashboard Kitchen Dashboard http://localhost:3000/kitchen Production Mode

Build the project
npm run build

Start the production server
npm start

Copy bash Stop the Server Press Ctrl + C in the terminal.

🧪 How to Run Tests

Lint and format check
npm run lint

Copy Automated test suite coming soon. Contributions welcome.

⚙️ Configuration Environment Variables Variable Required Description DATABASE_URL ✅ PostgreSQL connection string NEXTAUTH_SECRET ✅ Random secret string for session encryption NEXTAUTH_URL ✅ Base URL of the app (use your IP for phone access) REGISTER_SECRET ✅ Secret key required to register a new restaurant AI_GROQ_KEY ⚠️ At least one Groq API key — free at https://console.groq.com AI_GOOGLE_KEY ⚠️ At least one Google Gemini API key AI_CEREBRAS_KEY Optional Cerebras API key AI_SILICONFLOW_KEY Optional SiliconFlow API key AI Assistant ZapOrder's AI assistant (ZapOder) requires at least one AI provider key. The system automatically falls back to available providers if one is exhausted. Groq is recommended as it has a generous free tier.

Accessing from Your Phone Find your laptop's local IP — open Command Prompt and run ipconfig, look for IPv4 Address (e.g. 192.168.1.103)

Update .env.local:

NEXTAUTH_URL=http://192.168.1.103:3000

env Restart the server and open http://192.168.1.103:3000 on your phone

For QR code scanning and camera features, HTTPS is required. Run npx ngrok http 3000 in a separate terminal and use the https:// URL it provides.

🔧 Troubleshooting ❌ "Cannot connect to database"

PostgreSQL service may not be running. Press Win + R, type services.msc, find postgresql in the list and make sure its status is Running. Right-click → Start if it isn't.

❌ "Module not found" or Prisma errors

Dependencies or Prisma client may be missing or outdated. Run:

npm install npx prisma generate

❌ Port 3000 is already in use

Another process is using the port. Open package.json and change the play script:

"play": "next dev -p 3001"

json Then visit http://localhost:3001 instead.

❌ Page not loading after editing .env.local

Environment variables are loaded at startup. Always restart the server after making any changes to .env.local.

❌ AI assistant not responding

Make sure at least one AI provider key is set in .env.local and is valid. Test your Groq key at https://console.groq.com.

🤝 Contributing Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch: git checkout -b feature/your-feature-name

Make your changes and commit: git commit -m "Add: your feature description"

Push to your fork: git push origin feature/your-feature-name

Open a Pull Request against the main branch

Please keep PRs focused — one feature or fix per PR. Follow the existing code style and make sure npm run lint passes before submitting.

🙏 Acknowledgments Next.js — React framework

Prisma — Database ORM

Vercel AI SDK — AI streaming and provider abstraction

Google Gemini — AI model powering ZapOder

NextAuth.js — Authentication

pgAdmin — PostgreSQL management tool
