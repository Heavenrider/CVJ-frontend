# Sri Chakra Veeralakshmi Jewellery Works - Deployment Guide

This guide describes how to deploy the upgraded e-commerce jewellery website to **Vercel** with a cloud **PostgreSQL** database.

---

## 📦 Cloud Database Setup (Prerequisite)

Since Vercel is serverless, you need a cloud-hosted PostgreSQL database. You can set one up for free in less than 2 minutes using **Supabase** or **Neon**:

### Option A: Setup using Supabase (Recommended)
1. Go to [Supabase](https://supabase.com) and sign up.
2. Create a new project named `daddywebsite`.
3. Go to **Project Settings** > **Database** and copy the **Transaction Connection String** (under URI format). It will look similar to this:
   ```env
   postgresql://postgres.xxxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public
   ```
4. Save this URL for the Vercel deployment step below.

---

## 🚀 Deploying to Vercel

Follow these steps to connect your repository and deploy the project:

### Step 1: Push your code to GitHub
If you haven't already, push this codebase to a private/public repository on your GitHub account.

### Step 2: Import the Project in Vercel
1. Go to [Vercel](https://vercel.com) and log in.
2. Click the **Add New** button on your dashboard and select **Project**.
3. Import your GitHub repository.

### Step 3: Configure Environment Variables
Before clicking "Deploy", expand the **Environment Variables** section and add the following keys from your `.env` file:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.xxxxxx...` | Your Supabase/Neon PostgreSQL connection string |
| `JWT_SECRET` | `your_super_secret_signing_key_here` | Run `openssl rand -base64 32` or type a secure password |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxx` | Your Razorpay API Key ID (from Razorpay settings) |
| `RAZORPAY_KEY_SECRET`| `xxxxxxxxxxxxxxx` | Your Razorpay API Key Secret |

### Step 4: Click Deploy!
Vercel will automatically:
1. Detect that it is a Next.js application.
2. Run `npm run postinstall` to generate the Prisma Client schemas.
3. Build and optimize all routing pages.
4. Provide you with a live secure HTTPS URL (e.g. `srichakrajewellers.vercel.app`).

---

## 🗄️ Database Initialization & Seeding (Run Once)

Once the app is deployed to Vercel, you need to initialize the database tables and seed the initial products, categories, and administrator accounts on your new cloud database.

On your local development machine:
1. Open your terminal in the project folder.
2. Temporarily update the `DATABASE_URL` in your local `.env` to point to your new cloud database connection string.
3. Run the following command to push the tables to the cloud database:
   ```bash
   npx prisma db push
   ```
4. Run the seed script to populate the admin account, categories, and initial products:
   ```bash
   npx prisma db seed
   ```

*You can now log in at your Vercel URL's `/admin/login` page using the default credentials: `admin@srichakrajewellers.com` / `AdminPassword123`.*
