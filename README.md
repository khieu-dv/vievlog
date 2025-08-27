# VieVlog 🧠 - Interactive Programming Education Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-0.25.2-B8DBE4?style=for-the-badge&logo=pocketbase&logoColor=black)](https://pocketbase.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0.9-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🌟 Overview

VieVlog is a comprehensive programming education platform that combines interactive documentation, company reviews, live code execution, and educational games into one seamless experience. Built for developers at all levels - from beginners learning their first programming language to professionals looking to advance their careers.

**🎯 What makes VieVlog unique:**
- **Interactive Learning**: Live code execution with Monaco Editor integration
- **Company Reviews**: Comprehensive database of Vietnamese tech companies with employee reviews
- **Educational Games**: Interactive gaming experiences to learn programming concepts
- **Multi-language Support**: Available in Vietnamese, English, Korean, and Chinese

<p align="center">
  <img src="./public/screenshot20.png" width="400" alt="VieVlog Dashboard" />
  <img src="./public/screenshot21.png" width="400" alt="VieVlog Content Creation" />
</p>

<p align="center">
  <img src="./public/screenshot22.png" width="400" alt="VieVlog Learning Interface" />
  <img src="./public/screenshot23.png" width="400" alt="VieVlog Mobile View" />
</p>

## 🎓 Learning Resources

📹 **Watch our comprehensive tutorial**: [Create a Modern Web App with Next.js & PocketBase](https://www.youtube.com/watch?v=bLqeFoANuTg)



## 🎯 Core Features

### 📚 Interactive Documentation System
- **Structured Learning Paths**: Languages • Frameworks • DSA • Soft Skills
- **Live Code Examples**: Embedded Monaco Editor with syntax highlighting
- **Community Engagement**: Real-time comments and discussions
- **Multi-language Support**: Content available in Vietnamese, English, Korean, Chinese

### 🏢 Company Review System
- **Comprehensive Database**: 1000+ Vietnamese tech companies
- **Employee Reviews**: Real insights about work environment, salary, and culture
- **Company Profiles**: Detailed information about each company
- **Rating System**: Standardized ratings for different aspects

### 💻 Live Code Playground
- **Server-side Execution**: Run JavaScript code safely in sandboxed environment
- **Professional Editor**: Monaco Editor with IntelliSense and syntax highlighting
- **Real-time Output**: Instant feedback and error handling
- **Code Sharing**: Save and share your code snippets

### 🎮 Educational Gaming
- **Interactive Learning**: VieHero game built with Godot engine
- **WebAssembly Performance**: Smooth browser-based gaming experience
- **Gamified Progress**: Learn programming concepts through play

## ✨ Why Choose VieVlog?

- 🔥 **Multi-Modal Learning**: Documentation, company reviews, interactive code, and games in one platform
- 🚀 **Production-Ready**: Enterprise-grade Next.js architecture with PocketBase backend
- 📱 **Mobile-First Design**: Optimized for learning and browsing on-the-go
- 🌍 **Multi-language Support**: Available in Vietnamese, English, Korean, and Chinese
- ⚡ **Live Code Execution**: Practice coding with instant feedback
- 🏢 **Career Development**: Comprehensive company insights to help with career decisions

## 🛠️ Technology Stack

<div align="center">
  
| Frontend | Backend | Editor & Gaming |
|----------|---------|-----------------|
| [Next.js 15](https://nextjs.org/) | [PocketBase](https://pocketbase.io/) | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| [React 19](https://react.dev/) | [Docker](https://www.docker.com/) | [Godot Engine](https://godotengine.org/) |
| [TypeScript](https://www.typescriptlang.org/) | RESTful APIs | [WebAssembly](https://webassembly.org/) |
| [TailwindCSS](https://tailwindcss.com/) | Judge0 API | Phaser.js |

</div>

**🔧 Key Integrations:**
- **Authentication**: PocketBase user management with social auth
- **Company Data**: Comprehensive database of Vietnamese tech companies
- **Code Execution**: Secure server-side JavaScript runtime
- **Internationalization**: i18n support for 4+ languages
- **Performance**: Modern deployment with optimization

## 🚀 Getting Started in 4 Simple Steps

### 1. Clone the Repository

```bash
git clone https://github.com/khieu-dv/vievlog.git
cd vievlog
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start PocketBase (Backend)

```bash
cd pocketbase-docker
docker-compose up -d
```

**🔗 PocketBase Admin**: http://localhost:8090/_/
- Set up your admin account and configure collections
- The database will be automatically seeded with demo content

### 4. Launch Development Server

```bash
npm run dev
# or  
yarn dev
```

**🌐 Access the Platform**:
- **Main App**: http://localhost:3000
- **Documentation**: http://localhost:3000/posts
- **Company Reviews**: http://localhost:3000/companies
- **Code Playground**: Integrated floating editor
- **Games**: http://localhost:3000/games

**🎯 Quick Start Features**:
- Browse programming tutorials by category
- Explore company reviews and ratings
- Try the interactive JavaScript code editor
- Play educational games to learn programming concepts

## 📚 Documentation

### Project Structure

```
vievlog/
├── src/app/                    # Next.js App Router
│   ├── api/                    # Backend API routes
│   │   └── run-code/          # Code execution endpoint
│   ├── posts/                  # Interactive documentation system
│   │   └── [id]/              # Individual tutorial pages
│   ├── companies/              # Company review system
│   │   ├── [slug]/            # Individual company pages
│   │   └── page.tsx           # Company listings
│   ├── games/                  # Educational gaming platform
│   ├── auth/                   # User authentication flows
│   └── profile/                # User dashboard
├── src/components/
│   ├── features/               # Feature-specific components
│   │   ├── posts/             # Documentation components
│   │   ├── companies/         # Company review components
│   │   └── home/              # Homepage components
│   ├── common/                 # Shared UI components
│   └── ui/                     # Design system primitives
├── src/lib/                    # Core utilities and services
│   ├── services/              # API clients
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript definitions
└── pocketbase-docker/          # Backend infrastructure
```

### Learning Content Structure

**📚 Documentation Categories**:
- **Languages**: Go, Rust, JavaScript, Python, etc.
- **Frameworks**: React, Next.js, FastAPI, Gin, etc.
- **DSA**: Data Structures & Algorithms fundamentals
- **Soft Skills**: Career development and professional skills

**🏢 Company Reviews**: Comprehensive database of Vietnamese tech companies with ratings and reviews

**🎮 Interactive Games**: Browser-based educational games using Godot/WebAssembly


## 🤝 Contributing

We welcome contributions of all sizes! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Check out our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 🎯 Target Audience & Use Cases

**👥 Who Benefits from VieVlog**:
- **Beginner Programmers**: Learning fundamentals with interactive examples
- **Students**: Computer science and software engineering curriculum support  
- **Career Changers**: Transitioning into tech with structured learning paths and company insights
- **Job Seekers**: Researching companies and making informed career decisions
- **Professionals**: Expanding skillset with new technologies and company reviews
- **Educators**: Teaching programming with engaging, multi-modal content

**💡 Primary Use Cases**:
- **Self-paced Learning**: Individual study with comprehensive resources
- **Company Research**: In-depth reviews and insights about Vietnamese tech companies
- **Interview Preparation**: DSA practice and coding challenges  
- **Technology Exploration**: Hands-on experience with new tools
- **Career Planning**: Making informed decisions about job opportunities

## 📊 Project Status

🚀 **Production Ready** - VieVlog is actively serving learners and job seekers with a full-featured platform including live code execution, company reviews, and interactive content management.

<div align="center">

[![Development Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)](https://github.com/khieu-dv/vievlog)
[![Last Commit](https://img.shields.io/github/last-commit/khieu-dv/vievlog?style=for-the-badge)](https://github.com/khieu-dv/vievlog/commits/main)

</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Khieu DV** - [GitHub Profile](https://github.com/khieu-dv)

## 🙏 Support the Project

If you find VieVlog helpful, please consider:

- ⭐ Star this repository
- 🔄 Fork it and contribute
- 📢 Share with your network
- 📝 Create issues for bugs or feature requests

## 📬 Contact & Community

- 💬 [Join our Youtube Community](https://www.youtube.com/@vie-vlogs)

---

<div align="center">
  <img src="https://visitor-badge.laobi.icu/badge?page_id=khieu-dv.vievlog" alt="visitors" />
  <p>Made with ❤️ for the open-source community</p>
</div>