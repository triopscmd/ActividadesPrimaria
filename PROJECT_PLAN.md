# Project Plan: Educational Activity Platform

This document outlines the initial project plan for developing a Vite-based React application using TypeScript, TailwindCSS, and Prisma for data persistence. The platform aims to provide an interactive educational experience for primary school students, allowing them to engage with activities based on official curriculum topics, track their progress, and visualize performance analytics.

The project will be structured into logical features, each encompassing frontend components, backend logic, and related configuration files.

## Core Technologies

*   **Frontend:** React, TypeScript, Vite, TailwindCSS
*   **Backend:** Node.js, Prisma (ORM), tRPC (for API communication)
*   **Database:** PostgreSQL (recommended with Prisma)
*   **Version Control & CI/CD:** Git, GitHub Actions

### Feature: 1. Project Setup, Core Configuration, and CI/CD

This feature covers the foundational setup of the project, including initial configurations for development tools, styling, type-checking, linting, and establishing Continuous Integration/Continuous Deployment pipelines.

*   `package.json`
*   `vite.config.ts`
*   `tsconfig.json`
*   `tailwind.config.js`
*   `postcss.config.js`
*   `.eslintrc.json`
*   `.prettierrc`
*   `.env.example`
*   `.gitignore`
*   `src/main.tsx`
*   `src/App.tsx`
*   `src/index.css`
*   `.github/workflows/ci.yml`
*   `.github/workflows/cd.yml`

### Feature: 2. Core Data Model & Persistence Layer

This feature defines the database schema and implements the persistence layer using Prisma, enabling the application to store and retrieve all necessary educational content, user data, activity configurations, and performance results.

*   `prisma/schema.prisma`
*   `prisma/seed.ts`
*   `src/server/db.ts`
*   `src/server/api/trpc.ts`
*   `src/server/api/root.ts`
*   `src/server/api/routers/content.ts`
*   `src/server/api/routers/activities.ts`
*   `src/server/api/routers/users.ts`
*   `src/types/db.ts`

### Feature: 3. Curriculum Content Management

This feature focuses on developing the administrative interface and backend logic required to manage and maintain all educational content, including primary levels, official topics, and their associated question banks.

*   `src/pages/admin/ContentManagementPage.tsx`
*   `src/components/admin/CourseEditor.tsx`
*   `src/components/admin/TopicEditor.tsx`
*   `src/components/admin/QuestionBankEditor.tsx`
*   `src/server/services/contentService.ts`
*   `src/types/content.ts`

### Feature: 4. Activity Selection & Customization

This feature implements the user interface and backend logic that allows students or educators to select specific primary levels, topics, full courses, and the desired number of questions to customize their learning activities.

*   `src/pages/ActivitySelectionPage.tsx`
*   `src/components/activity/LevelAndTopicSelector.tsx`
*   `src/components/activity/QuestionCountSelector.tsx`
*   `src/utils/activityConfigGenerator.ts`
*   `src/server/services/activityConfigService.ts`

### Feature: 5. Interactive Question Delivery

This feature is responsible for dynamically presenting test questions to the user, handling various input types (multiple-choice, numerical), validating responses, and managing the flow of an activity session.

*   `src/pages/ActivitySessionPage.tsx`
*   `src/components/activity/QuestionRenderer.tsx`
*   `src/components/activity/MultipleChoiceInput.tsx`
*   `src/components/activity/NumericInput.tsx`
*   `src/components/activity/ActivityNavigation.tsx`
*   `src/utils/answerValidation.ts`
*   `src/server/services/questionSessionService.ts`

### Feature: 6. Detailed Performance Analytics Dashboard

This feature designs and implements a comprehensive reporting system that generates detailed visual analyses of user performance, including pie and bar charts, showcasing percentages by topic and course.

*   `src/pages/AnalyticsPage.tsx`
*   `src/components/analytics/PerformanceOverview.tsx`
*   `src/components/charts/DoughnutChart.tsx`
*   `src/components/charts/BarChart.tsx`
*   `src/server/services/analyticsService.ts`
*   `src/types/analytics.ts`

### Feature: 7. User Session & Progress Tracking

This feature develops the system to manage user authentication and sessions, track progress through completed activities, and store historical results to enable personalized feedback and a comprehensive view of learning journey.

*   `src/pages/auth/LoginPage.tsx`
*   `src/pages/auth/RegisterPage.tsx`
*   `src/pages/user/ProfilePage.tsx`
*   `src/components/auth/AuthContext.tsx`
*   `src/server/auth.ts`
*   `src/server/services/userService.ts`
*   `src/server/services/userProgressService.ts`

## New Features

### Feature: 8. Robust Error Handling and Centralized Logging

This feature establishes a comprehensive system for catching, handling, and reporting errors across both the frontend and backend, along with implementing centralized, structured logging to improve application stability, maintainability, and debuggability. This foundational improvement ensures that runtime issues can be effectively identified, diagnosed, and resolved, contributing to a more reliable and professional application.

*   `src/components/common/ErrorBoundary.tsx`
*   `src/utils/errorHandler.ts`
*   `src/server/middlewares/errorHandler.ts`
*   `src/server/utils/logger.ts`
*   `src/server/api/routers/system.ts`
*   `src/types/error.ts`