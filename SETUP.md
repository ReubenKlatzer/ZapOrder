# OrderWorder – Local Setup Guide

This guide will walk you through running the OrderWorder project on a brand new laptop step by step. No experience required.

---

## What You Need to Install First

### 1. Node.js

Node.js is the engine that runs the project.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Run the installer and keep clicking **Next** until it finishes
4. Verify it worked — open **Command Prompt** (press `Win + R`, type `cmd`, press Enter) and run:
   ```
   node -v
   ```
   You should see something like `v20.x.x`

---

### 2. Git

Git is used to download the project code.

1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer — keep all default settings
3. Verify:
   ```
   git --version
   ```

---

### 3. PostgreSQL

PostgreSQL is the database that stores all the restaurant data.

1. Go to [https://www.postgresql.org/download/windows](https://www.postgresql.org/download/windows)
2. Click **Download the installer**
3. Run the installer:
   - Set a **password** you will remember (e.g. `admin123`) — this is your database superuser password
   - Leave the port as **5432**
   - Keep everything else as default
4. After installation, **pgAdmin** will also be installed — this is a visual tool to manage your database

---

## Setting Up the Database

### Create the Database

1. Open **pgAdmin** from your Start Menu
2. In the left panel expand **Servers → PostgreSQL**
3. Right-click **Databases** → **Create → Database**
4. Name it `ZapOrder` and click **Save**

### Create a Database User

1. Right-click **Login/Group Roles** → **Create → Login/Group Role**
2. **General** tab → set Name to `zapuser`
3. **Definition** tab → set Password to `zappass123`
4. **Privileges** tab → turn on **Can login** and **Superuser**
5. Click **Save**

---

## Downloading the Project

1. Open **Command Prompt**
2. Navigate to where you want to save the project:
   ```
   cd Desktop
   ```
3. Download the project:
   ```
   git clone https://github.com/YOUR_REPO_URL/OrderWorder.git
   ```
   > Replace `YOUR_REPO_URL` with the actual link given to you
4. Go into the project folder:
   ```
   cd OrderWorder
   ```

---

## Installing Project Dependencies

Run this inside the project folder:

```
npm install
```

This downloads all the packages the project needs. It may take a few minutes.

---

## Creating the Environment File

The project needs a `.env.local` file to connect to the database.

1. Inside the project folder, create a new file called `.env.local`
2. Open it with Notepad and paste the following:

```
DATABASE_URL=postgresql://zapuser:zappass123@localhost:5432/ZapOrder

NEXTAUTH_SECRET=anylongrandomstringofcharacters123456
NEXTAUTH_URL=http://localhost:3000

AI_GROQ_KEY=
AI_CEREBRAS_KEY=
AI_GOOGLE_KEY=
AI_SILICONFLOW_KEY=
```

> Replace `zapuser` and `zappass123` with the username and password you created earlier.
> For `NEXTAUTH_SECRET` type any long random string of letters and numbers.

---

## Setting Up the Database Tables

Run these two commands one at a time inside the project folder:

```
npx prisma migrate deploy
```

```
npx prisma generate
```

---

## Creating a Demo Restaurant (Optional)

To have sample data ready to test with, run:

```
node setup.mjs
```

This creates a restaurant called **Nova Kitchen** with:

| Field | Value |
|---|---|
| Email | admin@nova.com |
| Password | nova123 |

---

## Running the Project

Start the development server:

```
npm run play
```

You will see:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

---

## Accessing the App

Open your browser and go to:

| Page | URL |
|---|---|
| Homepage / Login | http://localhost:3000 |
| Customer Menu | http://localhost:3000/nova?table=table1 |
| Admin Dashboard | http://localhost:3000/dashboard |
| Kitchen Dashboard | http://localhost:3000/kitchen |

---

## Registering a New Restaurant

1. Go to [http://localhost:3000](http://localhost:3000)
2. Scroll down to the login section
3. Click **New restaurant?**
4. Fill in your restaurant name, username, email and password
5. Click **Register** then log in

---

## Accessing from Your Phone

If you want to open the app on your phone while on the same WiFi:

1. Find your laptop's IP address — open Command Prompt and run:
   ```
   ipconfig
   ```
   Look for **IPv4 Address** (e.g. `192.168.1.103`)

2. Update `NEXTAUTH_URL` in your `.env.local` file:
   ```
   NEXTAUTH_URL=http://192.168.1.103:3000
   ```

3. Restart the server with `npm run play`

4. On your phone open:
   ```
   http://192.168.1.103:3000
   ```

> Note: Camera/QR features require HTTPS. For HTTPS access run `npx ngrok http 3000` in a separate terminal and use the `https://` URL it gives you.

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Troubleshooting

**"Cannot connect to database"**
Press `Win + R`, type `services.msc`, find **postgresql** in the list and make sure it is **Running**.

**"Module not found" or Prisma errors**
Run these again:
```
npm install
npx prisma generate
```

**Port 3000 already in use**
Change `3000` to `3001` in the `play` script inside `package.json`.

**Page not loading after changing NEXTAUTH_URL**
Always restart the server after editing `.env.local`.
