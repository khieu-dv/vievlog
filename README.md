
# VieVlog 🧠🇰🇷  
A modern, open-source web project built with **Next.js**, **PocketBase**, and **TailwindCSS** to support learning IT (VIEVLOG).

<p align="center">
  <img src="./public/screenshot10.png" width="400" />
  <img src="./public/screenshot11.png" width="400" />
</p>

<p align="center">
  <img src="./public/screenshot12.png" width="400" />
  <img src="./public/screenshot13.png" width="400" />

</p>

📹 Watch the full lecture here: [👉 [YouTube video link](https://www.youtube.com/watch?v=bLqeFoANuTg)]

💬 Don’t forget to subscribe and leave a comment if you enjoyed it — I’ll be working hard to complete the full series soon! ❤️


## 🚀 Features
- ✅ Generate videos from images and audio – Perfect for sending sweet messages to someone special!
- ✅ Built with **Next.js App Router**
- ✅ Backend powered by **PocketBase** (lightweight, easy to self-host)
- ✅ Styled using **TailwindCSS**
- ✅ Clean and modular code structure
- ✅ Ready-to-use template for personal or educational projects

---

## 🛠️ Tech Stack

- **Next.js** - Full-stack React framework
- **PocketBase** - Backend-as-a-Service (auth, DB, file storage)
- **TailwindCSS** - Utility-first CSS framework

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/khieu-dv/vievlog.git
cd vievlog
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run PocketBase (local)

1. **Navigate to the pocketbase-docker directory**:

   Open your terminal and navigate to the directory containing the docker-compose.yml file:

   ```bash
   cd ./vievlog/pocketbase-docker
   ```

2. **Start the Docker container**:

   Run the following command to start the PocketBase service:

   ```bash
   docker-compose up -d
   ```

   - The `-d` flag runs the container in detached mode (in the background).

3. **Verify the service is running**:

   Check the status of the PocketBase container:

   ```bash
   docker ps
   ```

   You should see a container named `pocketbase` running.

4. **Access PocketBase**:

   Open your browser and navigate to:

   ```
   http://localhost:8090/_/
   ```

   This will take you to the PocketBase admin interface.

---


### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📁 Folder Structure

```
vievlog/
├── app/                            # Next.js App Router pages and components
│   ├── favicon.ico                 # Favicon for the app
│   ├── globals.css                 # Global CSS styles
│   ├── i18n.ts                     # Internationalization setup
│   ├── layout.tsx                  # Root layout for the app
│   ├── page.tsx                    # Home page
│   ├── api/                        # API routes
│   │   ├── auth/                   # Authentication-related API routes
│   │   └── chat/                   # Chat-related API routes
│   ├── auth/                       # Authentication pages
│   │   ├── layout.tsx              # Layout for authentication pages
│   │   ├── sign-in/                # Sign-in page
│   │   ├── sign-up/                # Sign-up page
│   ├── chat/                       # Chat-related pages
│   ├── components/                 # Reusable components
│   │   ├── contact-button.tsx      # Contact button component
│   │   ├── DevToolsDetector.tsx    # DevTools detection component
│   │   └── ...                     # Other components
│   ├── posts/                      # Blog post pages
│   │   ├── [id]/                   # Dynamic post detail pages
│   │   └── page.tsx                # Posts listing page
│   ├── profile/                    # User profile pages
│   └── videos/                     # Video-related pages
├── lib/                            # Utility libraries and services
│   ├── auth-client.ts              # Authentication client
│   ├── utils.ts                    # General utility functions
│   └── hooks/                      # Custom React hooks
├── ui/                             # UI primitives and components
│   ├── components/                 # Reusable UI components
│   ├── primitives/                 # Low-level UI primitives (e.g., buttons, modals)
│   └── layouts/                    # Layout components
│       ├── auth-layout.tsx         # Layout for authentication pages
│       └── dashboard-layout.tsx    # Layout for dashboard pages
├── utils/                          # Server-side utilities
│   └── serverI18n.ts               # Server-side internationalization utilities
```




### Key Highlights:
- **`app/`**: Contains all Next.js pages and components, organized by feature (e.g., `auth`, `posts`, `grammars`).
- **`lib/`**: Includes reusable libraries for authentication, API services, and utilities.
- **`ui/`**: Houses reusable UI components and primitives for consistent styling.
- **`utils/`**: Contains server-side utilities, such as internationalization helpers.

This structure ensures modularity, scalability, and maintainability for the project.

---

## 💡 Why VieVlog?

This project was created to help learners of IT (especially VIEVLOG) with a clean, modern learning platform. It’s also a great starting point for developers looking to work with PocketBase and Next.js.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and share!

---

## ❤️ Support

If you like this project, please consider:

- ⭐ Giving it a star on [GitHub](https://github.com/khieu-dv/vievlog)
- 📣 Sharing with your friends or community

---

## 📬 Contact

Feel free to reach out via GitHub issues or discussions if you have any questions or feedback!

```

