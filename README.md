
Refer this video : https://youtu.be/HQwn7rO1IoI


# Personalized Gift Platform 🎁

A full-stack AI-powered e-commerce platform that helps users find the perfect gifts for their loved ones using personalized recommendations.

## 🌟 Key Features

### For Customers
- **AI-Powered Gift Recommendations** 
  - Personalized suggestions based on recipient's age, gender, occasion, and relationship
  - Dynamic product descriptions tailored to each scenario
  - Smart filtering considering budget and preferences
  
- **User Experience**
  - Easy-to-use questionnaire for gift recommendations
  - Advanced product search and filtering
  - Secure checkout process
  - Order tracking and history
  - Product reviews and ratings

### For Merchants
- **Product Management**
  - Add and manage products with images
  - Track inventory levels
  - Set product pricing and categories
  - Monitor sales and analytics
  - Handle order fulfillment

### For Administrators
- **Platform Management**
  - Approve/reject merchant products
  - Manage user accounts
  - Monitor platform activity
  - Handle order status updates
  - Access analytics dashboard

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **UI Library**: React Bootstrap
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Forms**: React Bootstrap Forms

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API
- **Email Service**: Nodemailer

### Security Features
- JWT-based authentication
- Role-based access control
- Password hashing
- Rate limiting
- Input validation
- CORS protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Cloud account (for Gemini API)
- npm or yarn package manager

## 🚀 Getting Started

1. **Clone the Repository**
   \`\`\`bash
   git clone <repository-url>
   cd personalized-gift-platform
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   \`\`\`

3. **Environment Setup**
   Create a \`.env\` file in the server directory:
   \`\`\`env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   \`\`\`

4. **Start the Application**
   \`\`\`bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm start
   \`\`\`

## 📱 Application Structure

### User Roles

1. **Customer**
   - Browse products
   - Get personalized recommendations
   - Place orders
   - Track order status
   - Write reviews

2. **Merchant**
   - Manage product catalog
   - Process orders
   - View sales analytics
   - Update inventory
   - Contact support

3. **Administrator**
   - Manage users and merchants
   - Approve products
   - Monitor platform activity
   - Handle support requests

### Key Workflows

1. **Gift Recommendation Process**
   - User fills out questionnaire
   - AI processes preferences
   - System generates personalized suggestions
   - User can filter and sort recommendations
   - Add to cart and checkout

2. **Order Processing**
   - User places order
   - Merchant receives notification
   - Order status updates
   - Delivery tracking
   - Order completion

3. **Product Management**
   - Merchant adds product
   - Admin reviews and approves
   - Product goes live
   - Inventory tracking
   - Sales monitoring

## 🔒 Security Measures

- Secure password hashing
- JWT token expiration
- Rate limiting on API endpoints
- Input sanitization
- CORS configuration
- Error handling and logging

## 🎯 API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp

### User Routes
- POST /api/user/questionnaire
- GET /api/user/suggestions
- POST /api/user/checkout
- GET /api/user/orders

### Merchant Routes
- POST /api/merchant/products
- GET /api/merchant/orders
- PATCH /api/merchant/orders/:id
- GET /api/merchant/dashboard

### Admin Routes
- GET /api/admin/dashboard
- PUT /api/admin/products/:id/approve
- GET /api/admin/orders
- GET /api/admin/merchants

## 📈 Future Enhancements

1. **AI Features**
   - Enhanced recommendation algorithm
   - Image recognition for products
   - Chatbot support

2. **Platform Features**
   - Multiple payment gateways
   - Advanced analytics
   - Mobile application
   - Social sharing

3. **User Experience**
   - Wishlist functionality
   - Gift wrapping options
   - Gift cards
   - Loyalty program


## 🚀 Deployment on Vercel

### Frontend Deployment

1. **Prepare Your Frontend**
   ```bash
   # Navigate to client directory
   cd client
   
   # Build the project
   npm run build
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI globally:
     ```bash
     npm install -g vercel
     ```
   - Login to Vercel:
     ```bash
     vercel login
     ```
   - Deploy the application:
     ```bash
     vercel
     ```
   - Follow the prompts to configure your deployment
   - For production deployment:
     ```bash
     vercel --prod
     ```

### Backend Deployment

1. **Prepare Your Backend**
   - Ensure all environment variables are properly set in Vercel dashboard
   - Create a `vercel.json` in the server directory:
     ```json
     {
       "version": 2,
       "builds": [
         {
           "src": "index.js",
           "use": "@vercel/node"
         }
       ],
       "routes": [
         {
           "src": "/(.*)",
           "dest": "index.js"
         }
       ]
     }
     ```

2. **Deploy Backend**
   ```bash
   # Navigate to server directory
   cd server
   
   # Deploy to Vercel
   vercel
   ```

### Environment Variables Setup

1. **Configure Environment Variables in Vercel Dashboard**
   - MONGODB_URI
   - JWT_SECRET
   - GEMINI_API_KEY
   - EMAIL_USER
   - EMAIL_PASS
   - Other necessary environment variables

2. **Update Frontend API Configuration**
   - Update the API base URL in frontend to point to your deployed backend URL

### Post-Deployment

1. **Verify Deployment**
   - Test all major functionalities
   - Check API connections
   - Verify database connections

2. **Monitor Application**
   - Use Vercel dashboard for monitoring
   - Check logs for any errors
   - Monitor performance metrics


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please email [udaykumargurrapu483@gmail.com]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by Uday Kumar Gurrapu

