# 🎫 Ticket System

A simple ticket management system built with React and TypeScript. It includes support for managing users and todos (tickets), along with interactive charts to visualize completed and uncompleted tickets.

## 🚀 Features

- ✅ **Users** – View user data
- 📝 **Todos (Tickets)** – Track the status of tickets
- 📊 **Charts** – Visual insights into completed and uncompleted tickets
- ⚡ Built with **React**, **Vite**, and **TanStack Query**
- 🎨 Styled using **Material UI (MUI)**

## 📂 Project Structure

src/
│
├── assets/ # Static files (e.g., logos)
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── pages/ # Main views like Users, Todos, Dashboard
├── services/ # API logic and query functions
├── types/ # TypeScript type definitions
├── utils/ # Helper functions
├── contexts/ # Contexts
├── providers/ # App providers
├── routes/ # App routes
└── main.tsx # Main file

## 🛠️ Installation

1. Clone the repo:

```bash
git clone https://github.com/BS-FE-Amr/tickets.git
cd tickets
```

2. Install dependencies:

```npm
npm install
```

3. Start the development server:

```npm
npm run dev
```

## 📊 Charts

The dashboard features dynamic charts that display:

- Number of **completed** tickets
- Number of **uncompleted** tickets

These charts update in real-time based on the data in the system.

## 🔧 Tech Stack

- **React 18**
- **Vite**
- **TypeScript**
- **TanStack Query**
- **Material UI**
- **Chart.js** or **Recharts** (depending on your setup)

## 📦 Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production

## 📌 Notes

- This project is meant for learning and internal use.
- You can easily integrate authentication, pagination, and more features in future iterations.

