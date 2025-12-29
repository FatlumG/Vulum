<div align="center">
  <h1>🛒 Vulum</h1>
  <p><strong>The Modern Digital Product Marketplace</strong></p>
  <p>A full-stack platform for creators to sell digital products, manage customers, and grow their business.</p>
  
  <br />
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Vulum** is an all-in-one digital product marketplace that empowers creators to sell their digital products with ease. Whether you're selling e-books, templates, courses, software, or any other digital goods, Vulum provides the tools you need to succeed.

### Why Vulum?

- 🔒 **Secure Transactions** - Bank-level security for all payments
- ⚡ **Instant Delivery** - Automated digital product delivery
- 🌍 **Global Marketplace** - Reach customers worldwide
- 📊 **Analytics Dashboard** - Track sales, revenue, and insights
- 💳 **Stripe Integration** - Seamless payment processing

---

## ✨ Features

### For Sellers
- 📦 **Product Management** - Create, update, and manage digital products
- 💰 **Pricing Control** - Set your own prices and discounts
- 📧 **Invoice Generation** - Automatic PDF invoice creation
- 📈 **Sales Analytics** - Track revenue and customer metrics
- ☁️ **Cloud Storage** - Cloudinary integration for media files

### For Buyers
- 🛍️ **Easy Browsing** - Discover products with intuitive UI
- ❤️ **Favorites** - Save products for later
- 🧾 **Invoice History** - Access all purchase records
- 🔔 **Real-time Updates** - Socket.io powered notifications

### Platform Features
- 🔐 **Authentication** - JWT-based secure authentication
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI
- 🔄 **State Management** - Redux Toolkit for predictable state
- 📝 **Form Validation** - React Hook Form with Zod schemas

---

## 🛠️ Tech Stack

### Frontend (`vulum-app-front`)

| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Redux Toolkit | State Management |
| React Router v7 | Routing |
| React Hook Form | Form Handling |
| Zod | Schema Validation |
| Axios | HTTP Client |
| Recharts | Data Visualization |
| Radix UI | Accessible Components |
| Lucide React | Icons |

### Backend (`vulum-app-back`)

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| TypeScript | Type Safety |
| TypeORM | ORM |
| MySQL | Database |
| GraphQL | API Query Language |
| Type-GraphQL | GraphQL Schema |
| JWT | Authentication |
| Socket.io | Real-time Communication |
| Stripe | Payment Processing |
| Cloudinary | Media Storage |
| Nodemailer | Email Service |
| BullMQ | Job Queues |
| PDFKit | Invoice Generation |

---

## 📁 Project Structure

```
Vulum/
├── vulum-app-front/          # Frontend React Application
│   ├── src/
│   │   ├── app/              # Redux store configuration
│   │   ├── assets/           # Static assets (images, icons)
│   │   ├── auth/             # Authentication utilities
│   │   ├── components/       # Reusable UI components
│   │   │   ├── landing/      # Landing page components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   └── ...
│   │   ├── features/         # Redux slices & features
│   │   ├── hooks-apiCalls/   # Custom API hooks
│   │   ├── interfaces/       # TypeScript interfaces
│   │   ├── layouts/          # Page layouts
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Helper utilities
│   │   └── validation/       # Zod schemas
│   ├── public/               # Public assets
│   └── package.json
│
├── vulum-app-back/           # Backend Express Application
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── models/       # TypeORM entities
│   │   │   ├── repositories/ # Data access layer
│   │   │   ├── services/     # Business logic
│   │   │   ├── resolvers/    # GraphQL resolvers
│   │   │   ├── requests/     # Request DTOs
│   │   │   ├── interfaces/   # TypeScript interfaces
│   │   │   ├── events/       # Event handlers
│   │   │   ├── queue-jobs/   # Background jobs
│   │   │   └── cron-jobs/    # Scheduled tasks
│   │   ├── config/           # Configuration files
│   │   ├── database/
│   │   │   ├── migrations/   # Database migrations
│   │   │   ├── seeds/        # Database seeders
│   │   │   └── factories/    # Data factories
│   │   ├── decorators/       # Custom decorators
│   │   ├── infrastructure/   # Middleware & services
│   │   ├── utils/            # Utility functions
│   │   └── views/            # Email templates
│   ├── uploads/              # File uploads directory
│   └── package.json
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/FatlumG/Vulum.git
cd Vulum
```

2. **Install Backend Dependencies**

```bash
cd vulum-app-back
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../vulum-app-front
npm install
```

### Environment Variables

#### Backend (`vulum-app-back/.env`)

Create a `.env` file in the `vulum-app-back` directory:

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=vulum

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=noreply@vulum.com
```

#### Frontend (`vulum-app-front/.env`)

Create a `.env` file in the `vulum-app-front` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🏃 Running the Application

### Development Mode

**Start the Backend Server:**

```bash
cd vulum-app-back
npm run dev
```

The backend will start at `http://localhost:3000`

**Start the Frontend Development Server:**

```bash
cd vulum-app-front
npm run dev
```

The frontend will start at `http://localhost:5173`

### Database Setup

**Run Migrations:**

```bash
cd vulum-app-back
npm run migrate
```

**Seed Database (Optional):**

```bash
npm run db:seed
```

### Production Build

**Build Frontend:**

```bash
cd vulum-app-front
npm run build
```

**Build Backend:**

```bash
cd vulum-app-back
npm run build
npm start
```

### Docker (Optional)

```bash
cd vulum-app-back
docker-compose up -d
```

---

## 📚 API Documentation

### REST API

The API documentation is available via Swagger UI at:

```
http://localhost:3000/api-docs
```

### GraphQL

GraphQL Playground is available at:

```
http://localhost:3000/graphql
```

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create a product |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/invoices` | Get user invoices |
| POST | `/api/checkout` | Process payment |

---

## 🧪 Testing

**Run Backend Tests:**

```bash
cd vulum-app-back
npm test
```

**Run Frontend Linting:**

```bash
cd vulum-app-front
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Fatlum Gërxhaliu** - [GitHub](https://github.com/FatlumG)
**Laurent Maxhuni** - [GitHub](https://github.com/LaurentMaxhuni)

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>Made with ❤️ by the Vulum Team</p>
</div>
