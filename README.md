# Expense Tracker API

A RESTful Expense Tracker API built with Node.js, Express, MongoDB, and Mongoose.

This project is created for learning and practicing:

- MongoDB & Mongoose
- Express.js backend architecture
- Authentication with JWT
- REST API development
- Aggregation & analytics
- Real-world backend workflows

## Status

Currently in early development phase.

## Features (MVP)

### Authentication

- User registration
- User login
- JWT authentication
- Protected routes
- Password hashing with bcrypt

### Transactions

- Create income & expense transactions
- Update transactions
- Delete transactions
- Transaction categories
- Transaction notes
- Transaction history

### Dashboard & Analytics

- Total income
- Total expense
- Current balance
- Monthly summaries
- Expense by category

### Filtering & Sorting

- Filter by category
- Filter by transaction type
- Filter by date range
- Sort by latest or amount

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Goals

This project focuses on:

- Understanding MongoDB document modeling
- Learning backend architecture
- Practicing authentication flow
- Building production-style REST APIs

## Planned Folder Structure

```bash
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── app.js
```

## Example Transaction Document

```json
{
	"title": "KFC",
	"amount": 12000,
	"type": "expense",
	"category": "Food",
	"note": "Dinner",
	"date": "2026-05-22",
	"userId": "mongodb_object_id"
}
```

## Future Improvements

- Budget planning
- Recurring transactions
- Email notifications
- Charts & reports
- Frontend dashboard
- Docker support
- Unit testing

## Local Setup (Run locally)

Follow these steps to run the API locally for development.

Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

0. Clone the repository

```bash
git clone https://github.com/mryeminaung/expense-tracker-api.git
cd expense-tracker-api
```

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with these values:

```
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

3. (Optional) Seed example data

You can run the project's seeder script which populates example data (categories, etc.):

```bash
# via npm script
npm run seed

# or run the seeder directly
node seed/database.seed.js
```

4. Start the dev server

```bash
npm run dev
```

## Response format

All endpoints use a consistent JSON structure:

Success example:

```json
{
	"success": true,
	"message": "Registered successful!",
	"data": {
		/* object or array */
	}
}
```

Error example:

```json
{
	"success": false,
	"message": "Validation failed",
	"errors": [{ "field": "name", "message": "Name is required" }]
}
```

Notes

- If you use MongoDB Atlas, set `MONGO_URI` to the connection string.
- Keep `JWT_SECRET` safe — it's used to sign authentication tokens.
