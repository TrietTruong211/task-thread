# Task-Thread: Micro-Step Task Breaker

Turn overwhelming tasks into manageable micro-steps that build momentum.

## Project Overview

**Task-Thread** is a productivity application designed for professional writers, researchers, students, and knowledge workers struggling with large projects. It helps you break down big tasks into manageable micro-steps, track your progress, and build consistent momentum.

## Features

- **Thread Setup**: Create main task threads representing large projects or goals
- **Micro-Step Breakdown**: Click any step to break it into 3-5 micro-steps for single-session completion
- **Momentum Tracker**: Visual progress indicators showing streak days where you made progress
- **Step History View**: Timeline view showing completed steps and remaining tasks

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + PostCSS + Sass (@apply directives)
- **Backend**: Frontend-only (localStorage; PocketBase ready for v2 sync)
- **Database**: LocalStorage (v1); PostgreSQL migration path (v2)
- **Testing**: Vitest + React Testing Library + Playwright

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the result.

### Build for Production

```bash
npm run build
```

### Lint and Typecheck

```bash
npm run lint
npm run typecheck
```

### Test

```bash
npm run test
npm run test:e2e
```

## Project Structure

```
task-thread/
├── public/           # Static assets
├── src/              # Source code
│   ├── assets/       # Icons, images, fonts
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API and data services
│   ├── stores/       # State management
│   ├── routes/       # Route definitions
│   └── types/        # TypeScript type definitions
├── package.json
└── vite.config.ts
```

## Roadmap

### v1.0 (Current)
- [x] Project scaffold
- [x] LocalStorage data persistence
- [ ] Thread CRUD operations
- [ ] Micro-step breakdown functionality
- [ ] Momentum tracking
- [ ] History view
- [ ] Testing suite

### v2.0 Planned
- PocketBase backend integration
- Cloud sync
- Real-time collaboration features
- PostgreSQL database migration
- Mobile-responsive enhancements

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## Acknowledgments

This project is open-source and built for productivity enthusiasts worldwide.
