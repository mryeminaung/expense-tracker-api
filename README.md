# Expense Tracker API

A RESTful Expense Tracker API built with Node.js, Express, MongoDB, and Mongoose.

This project is created for learning and practicing:

- MongoDB & Mongoose
- Express.js backend architecture
- Authentication with JWT
- REST API development
- Aggregation & analytics
- Real-world backend workflows

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

## Status

Currently in early development phase.
