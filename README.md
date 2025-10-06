# ExoPlanet AI - Advanced Exoplanet Classification System

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

ExoPlanet AI is a sophisticated web application that leverages advanced artificial intelligence to classify and analyze exoplanets using NASA's Kepler mission data. The platform provides comprehensive visualization tools, detailed analysis reports, and real-time data from NASA's exoplanet archive.

## 🌟 Features

### 🚀 Core Functionality
- **AI-Powered Classification**: Advanced machine learning models for exoplanet identification and validation
- **Real-time NASA Data Integration**: Direct connection to NASA's ADQL service and exoplanet archive
- **Interactive Dashboard**: Comprehensive statistics and visualizations of exoplanet discoveries
- **Detailed Exoplanet Profiles**: In-depth analysis of individual exoplanets with comparative data

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS and shadcn/ui components
- **Dark/Light Theme**: Automatic theme switching with user preference persistence
- **Multi-language Support**: English and French localization with seamless switching
- **Mobile Responsive**: Optimized for all device sizes and screen orientations

### 📊 Data Visualization
- **Interactive Charts**: Recharts-powered visualizations for data exploration
- **3D Visualizations**: Integration with NASA's Eyes on Exoplanets and custom 3D viewer
- **PDF Reports**: Professional, styled PDF exports of exoplanet analysis
- **Comparative Analysis**: Side-by-side comparisons with Earth parameters

### 🔬 Advanced Features
- **Habitability Analysis**: Automated assessment of exoplanet habitability potential
- **Transit Photometry**: Analysis of transit duration, depth, and orbital parameters
- **Stellar Parameters**: Comprehensive host star characterization
- **Confidence Scoring**: AI-generated confidence scores for classifications

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15.5.4**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Framer Motion**: Smooth animations and transitions

### Key Dependencies
```json
{
  "jspdf": "^3.0.3",           // PDF generation
  "html2canvas": "^1.4.1",     // HTML to canvas conversion
  "recharts": "^2.15.4",       // Data visualization
  "lucide-react": "^0.544.0",  // Icon library
  "framer-motion": "^12.23.22" // Animations
}
```

### Project Structure
```
src/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Main dashboard
│   ├── data/               # Data exploration page
│   ├── exoplanet/[id]/     # Individual exoplanet details
│   ├── model/              # AI model information
│   └── api/                # API routes
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── charts/            # Chart components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # External API services
└── types/                 # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NyxAIfront
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   NEXT_PUBLIC_EDUCATIONAL_VISUALIZER_BASE_URL=https://visualize3-d.vercel.app
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Usage

### Dashboard Navigation
- **Statistics Overview**: View real-time NASA KOI statistics and trends
- **Quick Actions**: Access model information, data exploration, and external resources
- **Visual Analytics**: Interactive charts showing exoplanet distributions and classifications

### Exoplanet Analysis
- **Search & Filter**: Find exoplanets by name, type, or characteristics
- **Detailed Profiles**: Access comprehensive analysis including:
  - Orbital parameters (period, transit duration, depth)
  - Physical properties (radius, temperature, stellar parameters)
  - Habitability assessment
  - 3D visualization links
  - Professional PDF reports

### AI Model Integration
- **Classification Results**: View AI-generated exoplanet classifications
- **Confidence Scores**: Understand model certainty levels
- **Performance Metrics**: Access model accuracy and validation statistics

## 🛠️ Configuration

### Theme Configuration
The application supports automatic theme detection with manual override:
```typescript
// Default: light theme with automatic detection
const theme = useTheme(); // 'light' | 'dark' | 'system'
```

### Internationalization
Language settings persist across sessions:
```typescript
// Supported languages: 'en' (English), 'fr' (French)
const { locale, switchLocale } = useI18n();
```

### External Integrations
- **NASA ADQL Service**: Real-time exoplanet data queries
- **NASA Eyes on Exoplanets**: 3D visualization integration
- **Educational Visualizer**: Custom 3D planetary system viewer

## 📡 API Integration

### NASA Data Sources
- **Kepler Object of Interest (KOI) Catalog**
- **NASA Exoplanet Archive**
- **ADQL (Astronomical Data Query Language) Service**

### Internal APIs
- `/api/exoplanets`: Exoplanet data management
- `/api/classify`: AI classification endpoints
- `/api/nasa-koi`: NASA data proxy services

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom components:
```css
/* Custom CSS variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}
```

### Component Library
Built on shadcn/ui with customizations for:
- Data tables with sorting and filtering
- Interactive charts and visualizations
- Modal dialogs for detailed views
- Form controls with validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to [Vercel](https://vercel.com)
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically on every push to main branch

### Alternative Platforms
- **Netlify**: Configure build settings for Next.js
- **AWS Amplify**: Use the Next.js build preset
- **Docker**: Build container with `next build` and `next start`

### Environment Variables
```env
# Production environment variables
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_EDUCATIONAL_VISUALIZER_BASE_URL=https://your-visualizer-url.com
```

## 📊 Performance

### Optimization Features
- **Server-Side Rendering**: Improved SEO and initial load times
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching Strategy**: Service worker and API response caching

### Metrics
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized LCP, FID, and CLS scores
- **Bundle Size**: Optimized with tree shaking and compression

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled with comprehensive type definitions
- **ESLint**: Configured for Next.js and React best practices
- **Prettier**: Automatic code formatting on save
- **Husky**: Pre-commit hooks for code quality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing open access to exoplanet data and visualization tools
- **Kepler Mission**: For revolutionary exoplanet discovery data
- **Next.js Team**: For the excellent React framework
- **Vercel**: For hosting and deployment platform
- **shadcn**: For the beautiful component library

## 📞 Contact

- **Website**: [https://nyx-a-ifront-q25a.vercel.app](https://nyx-a-ifront-q25a.vercel.app)
- **Email**: sannicharbel@gmail.com

---

Made with ❤️ for the exploration of exoplanets and the search for life beyond Earth.
