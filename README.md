# ZapOrder – Contactless Restaurant Ordering System

![Made with ❤️](https://img.shields.io/badge/Made_with-%E2%9D%A4-red?style=flat-square)
[![Next JS](https://img.shields.io/badge/Next-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)

---

## 🚀 Overview
ZapOrder is a full-stack, AI-powered contactless dining platform designed to digitize restaurant operations. From scanning a QR code to placing an order, chatting with an intelligent AI assistant, and managing kitchen workflows — everything runs on a clean, modern web app built with **Next.js**, **PostgreSQL**, and **SCSS**.

---

## ✨ Features
- 📱 **QR Code-Based Access**: Every table gets a unique QR code for instant menu access.
- 🤖 **AI-Powered Assistant**: Chat with ZapOder, your intelligent restaurant assistant for personalized menu recommendations.
- 🍽️ **Smart Ordering**: Customers can browse menus, add items, and place orders — no app download required.
- 🧑‍🍳 **Live Kitchen Dashboard**: Real-time order updates for chefs to prep efficiently.
- 🧑‍💼 **Admin Panel**: Manage tables, orders, menu items, categories, and more.
- ⚡ **Real-Time UI**: Fast, responsive, and optimized for mobile/tablet/desktop.
- 🌗 **Dark Theme Support**: Modern design with animation and smooth transitions.
- 🌍 **ZAR Currency**: Built for South African restaurants.

---

## 🧠 AI Integration (ZapOder)
Built on **Google Gemini** via **Vercel AI SDK**, ZapOder uses advanced prompt engineering to act as a virtual waiter.
- **Context-Aware**: Dynamically injects real-time menu data into system prompts for accurate allergen/ingredient answers.
- **Structured Output**: Uses custom tokens to return direct item recommendations adjacent to natural language responses.
- **No Vectors Required**: Efficient, real-time context injection without complex vector databases.

---

## 🛠️ Tech Stack
- **Frontend**: React + Next.js
- **Styling**: SCSS (SASS)
- **Backend**: API Routes in Next.js
- **Database**: PostgreSQL + Prisma ORM
- **Hosting**: Vercel
- **Authentication**: NextAuth.js
- **State Management**: React Context + SWR
- **AI & Chatbot**: Vercel AI SDK + Google Gemini

---

## 🔍 Try it out
ZapOrder has two interfaces — one for **customers** and one for the **restaurant admin**.

### 🧑 Customer Login:
1. Scan the table QR code or go to `/{restaurant}?table=1`
2. Click the order button
3. Enter name and phone number
4. Browse menu, add items, and place order

### 👨‍💼 Admin Login:
1. Go to the homepage and scroll to the login section
2. Enter your admin email and password
3. Visit `/dashboard` or `/kitchen`

---

## 📌 Tags
`nextjs` `react` `javascript` `postgresql` `prisma` `sass` `typescript` `ai` `chatbot` `ai-assistant` `admin-panel` `dashboard` `qr-code` `realtime` `restaurant` `responsive` `dark-theme` `ui` `animation` `zar` `south-africa`

---

## ⭐ Support the Project
If you find ZapOrder useful, please give it a ⭐ on GitHub!
Have ideas or improvements? Contributions via issues or pull requests are warmly welcome!
