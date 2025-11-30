# InsightX

A feedback collection platform that helps organizations gather customer insights and measure Net Promoter Score (NPS). Build forms, share them with customers, and get actionable analytics in real-time.

## Live Demo

- **App:** [https://insightx.vercel.app](https://insightx.vercel.app)
- **API Docs:** [Postman Documentation](https://documenter.getpostman.com/view/36998674/2sAXxV5pbd)

## Features

- Create custom feedback forms with multiple question types
- Real-time NPS calculation and analytics
- Beautiful dashboards with interactive charts
- Export responses as CSV
- REST API for programmatic access
- Secure user authentication with email verification
- Fully responsive design

## Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS, Recharts

**Backend:** Node.js, Express.js, MongoDB

**Hosting:** Vercel (frontend), Render (backend)

## Getting Started

### Clone the Repository

```
git clone https://github.com/luchiiii/InsightX.git
cd InsightX
```

### Frontend Setup

```
cd client
npm install
npm start
```

The app will run at `http://localhost:3000`

### Backend Setup

```
cd server
npm install
npm start
```

The API will run at `http://localhost:3001`

## How It Works

1. Create a feedback form with custom questions
2. Share the form link with your customers
3. Collect responses in real-time
4. View NPS analytics and insights
5. Export data or integrate via API

## API Integration

Get your API token from the dashboard and use it to submit feedback programmatically. See the [full API documentation](./docs/API.md) for details.

## GitHub

[github.com/luchiiii](https://github.com/luchiiii)

---

Built with React, Node.js, and MongoDB