# Personal Brand Positioning Quiz Application

A comprehensive Personal Brand Positioning Quiz application that guides users through strategic questions to generate personalized brand positioning results using AI-powered analysis with deep market intelligence capabilities.

## 🚀 Features

### Core Functionality
- **4-Step Progressive Quiz System** - Comprehensive assessment covering personal foundation and market intelligence
- **AI-Powered Analysis** - OpenAI GPT-4 integration for generating personalized brand strategies
- **Regional Market Intelligence** - Deep analysis of local market dynamics and cultural factors
- **User Rating System** - 5-star rating with detailed feedback for AI-generated content
- **Professional UI/UX** - Mobile-first responsive design with TailwindCSS

### Advanced Features
- **Real-time Progress Tracking** - Visual progress indicators and step navigation
- **Comprehensive Results** - 12+ sections including brand positioning, competitive analysis, and implementation roadmap
- **Rating Analytics** - User feedback collection and analysis for continuous improvement
- **Admin Dashboard** - Content management and analytics (coming soon)
- **GDPR Compliance** - Privacy-first data handling and user consent management

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Forms**: React Hook Form with Yup validation
- **State Management**: React Context for quiz state
- **Routing**: React Router for navigation
- **HTTP Client**: Axios with interceptors

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens for admin access
- **AI Integration**: OpenAI API for content generation
- **Validation**: Joi schemas for request validation
- **Security**: Helmet, rate limiting, CORS protection

### Database Schema
- **QuizResponse**: User quiz data and AI results
- **Rating**: User feedback and rating analytics
- **Admin**: Admin user management
- **Content**: CMS for quiz questions and AI prompts

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB 4.4+
- OpenAI API key

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-brand-positioning-quiz
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Required: MONGODB_URI, OPENAI_API_KEY
# Optional: JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
```

### 4. Database Setup
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod

# The application will create collections automatically
```

### 5. Start the Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or start individually:
# Server only
npm run server

# Client only (in separate terminal)
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/personal-brand-quiz` |
| `OPENAI_API_KEY` | OpenAI API key for AI generation | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | No | Auto-generated |
| `PORT` | Server port | No | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | No | `development` |

### OpenAI Configuration
```bash
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo for lower costs
```

## 🎯 Usage

### Taking the Quiz
1. Visit the homepage at http://localhost:3000
2. Click "Start Your Free Quiz"
3. Complete Step 1: Personal Foundation (3 sections)
4. Complete Step 2: Market Intelligence & Research
5. View your comprehensive brand positioning results

### API Endpoints

#### Quiz API
- `POST /api/quiz/start` - Start new quiz session
- `POST /api/quiz/step1` - Submit Step 1 data
- `POST /api/quiz/step2` - Submit Step 2 data
- `POST /api/quiz/generate-final-results` - Generate final results
- `GET /api/quiz/results/:sessionId` - Get quiz results

#### Rating API
- `POST /api/ratings` - Submit user rating
- `GET /api/ratings/session/:sessionId` - Get session ratings
- `GET /api/ratings/analytics` - Get rating analytics

#### Analytics API
- `GET /api/analytics/overview` - Public analytics overview
- `GET /api/analytics/funnel` - Completion funnel data
- `GET /api/analytics/demographics` - User demographics

## 🧪 Testing

### API Health Check
```bash
# Test server health
curl http://localhost:5000/api/health

# Test AI service
curl -X GET http://localhost:5000/api/ai/health
```

### Sample Quiz Flow
```bash
# Start quiz
curl -X POST http://localhost:5000/api/quiz/start

# Submit Step 1 (use returned sessionId)
curl -X POST http://localhost:5000/api/quiz/step1 \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"your-session-id","jobStatus":"Freelancer",...}'
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Quiz completion rates and funnel analysis
- User demographics and geographic distribution
- AI performance metrics and success rates
- Rating analytics and user feedback trends

### Rating System
- 5-star ratings for each AI-generated section
- Category ratings: Accuracy, Relevance, Actionability, Creativity, Market Fit
- Detailed feedback collection for continuous improvement

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Joi schemas for all endpoints
- **Data Sanitization**: MongoDB injection protection
- **JWT Authentication**: Secure admin access
- **Helmet Security**: Security headers and XSS protection

## 🚀 Deployment

### Production Environment
```bash
# Build the client
cd client && npm run build

# Set production environment
export NODE_ENV=production

# Start the server
npm start
```

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
OPENAI_API_KEY=your-production-key
JWT_SECRET=your-secure-secret
CLIENT_URL=https://yourdomain.com
```

### Deployment Platforms
- **Heroku**: Supports Node.js with MongoDB Atlas
- **Vercel**: For frontend with separate backend
- **DigitalOcean**: Full-stack deployment
- **AWS**: EC2 with RDS/DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **OpenAI API Errors**
   - Verify API key is valid
   - Check account billing and limits
   - Monitor rate limiting

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

### Getting Help
- Create an issue on GitHub
- Check the documentation
- Review error logs in console

## 🔮 Roadmap

### Upcoming Features
- [ ] Admin panel with full CMS capabilities
- [ ] A/B testing for quiz questions
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email integration for results delivery
- [ ] Premium service marketplace integration
- [ ] Social sharing capabilities
- [ ] API rate limiting per user
- [ ] Real-time collaboration features

### Technical Improvements
- [ ] Redis caching for performance
- [ ] Microservices architecture
- [ ] GraphQL API option
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] End-to-end testing
- [ ] Performance monitoring

---

Built with ❤️ for personal brand development and market positioning analysis.