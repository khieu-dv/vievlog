# VieVlog 🧠 - Interactive Programming Education Platform

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/khieu-dv/vievlog?style=for-the-badge)](https://github.com/khieu-dv/vievlog/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/khieu-dv/vievlog?style=for-the-badge)](https://github.com/khieu-dv/vievlog/network/members)
[![GitHub issues](https://img.shields.io/github/issues/khieu-dv/vievlog?style=for-the-badge)](https://github.com/khieu-dv/vievlog/issues)
[![GitHub license](https://img.shields.io/github/license/khieu-dv/vievlog?style=for-the-badge)](https://github.com/khieu-dv/vievlog/blob/main/LICENSE)
[![YouTube Video Views](https://img.shields.io/youtube/views/bLqeFoANuTg?style=for-the-badge)](https://www.youtube.com/watch?v=bLqeFoANuTg)

</div>

## 🌟 Overview

VieVlog is a comprehensive, multi-modal programming education platform that combines interactive documentation, video learning, live code execution, and educational games into one seamless experience. Built for developers at all levels - from beginners learning their first programming language to professionals expanding their tech stack.

**🎯 What makes VieVlog unique:**
- **Interactive Learning**: Live code execution with Monaco Editor integration
- **Multi-Format Content**: Documentation, TikTok-style videos, and educational games
- **Community-Driven**: Real-time comments and discussions on all content
- **Global Accessibility**: Multi-language support (EN/VI/KO/ZH) with responsive design

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



## 🎯 Core Learning Experiences

### 📚 Interactive Documentation System
- **Structured Learning Paths**: Languages • Frameworks • DSA • Soft Skills
- **Live Code Examples**: Embedded Monaco Editor with syntax highlighting
- **Community Engagement**: Real-time comments and discussions
- **Multi-language Support**: Content available in Vietnamese, English, Korean, Chinese

### 📱 TikTok-Style Video Learning
- **Short-form Educational Videos**: Mobile-optimized vertical feed
- **Auto-play on Scroll**: Seamless browsing experience
- **Progress Tracking**: Continue where you left off
- **Curated Content**: Programming tutorials and tech insights

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

- 🔥 **Multi-Modal Learning**: Text, video, interactive code, and games in one platform
- 🚀 **Production-Ready**: Enterprise-grade Next.js architecture with PocketBase backend
- 📱 **Mobile-First Design**: Optimized for learning on-the-go
- 🌍 **Global Community**: Multi-language support with active user discussions
- ⚡ **Live Code Execution**: Practice coding with instant feedback
- 🎯 **Structured Curriculum**: From beginner basics to advanced topics

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
- **Community Features**: Comments and user interactions  
- **Code Execution**: Secure server-side JavaScript runtime via Judge0 API
- **Internationalization**: i18n support for 4+ languages
- **Performance**: Vercel deployment with edge optimization

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
- **Video Feed**: http://localhost:3000/videos  
- **Code Playground**: http://localhost:3000/run-js
- **Games**: http://localhost:3000/games

**🎯 Quick Start Features**:
- Browse programming tutorials by category
- Watch short-form coding videos
- Try the interactive JavaScript code editor
- Play educational games to learn programming concepts

## 📚 Documentation

### Project Structure

```
vievlog/
├── src/app/                    # Next.js App Router
│   ├── api/                    # Backend API routes
│   │   ├── run-code/          # Code execution endpoint
│   │   └── auth/              # Authentication APIs
│   ├── posts/                  # Interactive documentation system
│   │   ├── [id]/              # Individual tutorial pages
│   │   └── roadmap/           # Structured learning paths
│   ├── videos/                 # TikTok-style video feed
│   ├── run-js/                 # Live code playground
│   ├── games/                  # Educational gaming platform
│   ├── auth/                   # User authentication flows
│   └── profile/                # User dashboard
├── src/components/
│   ├── features/               # Feature-specific components
│   │   ├── posts/             # Documentation components
│   │   └── videos/            # Video player components
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

**🎥 Video Content**: Short-form educational videos optimized for mobile consumption

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
- **Career Changers**: Transitioning into tech with structured learning paths
- **Professionals**: Expanding skillset with new technologies and frameworks
- **Educators**: Teaching programming with engaging, multi-modal content

**💡 Primary Use Cases**:
- **Self-paced Learning**: Individual study with comprehensive resources
- **Interview Preparation**: DSA practice and coding challenges  
- **Technology Exploration**: Hands-on experience with new tools
- **Community Learning**: Peer discussions and knowledge sharing
- **Mobile Learning**: Study programming concepts on-the-go

## 📊 Project Status

🚀 **Production Ready** - VieVlog is actively serving learners with a full-featured platform including live code execution, video streaming, and interactive content management.

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