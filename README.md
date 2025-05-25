# Aesthetic Palettes

<div align="center">
  <img src="public/android-chrome-192x192.png" alt="Aesthetic Palettes Logo" width="120" />
  <h3>Create, Save, and Share Beautiful Color Palettes</h3>
  <p>A modern, accessible color palette generator inspired by Coolors.co</p>
  
  [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.49-green)](https://supabase.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC)](https://tailwindcss.com/)
  ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/ar27111994/Aesthetic-Palettes?utm_source=oss&utm_medium=github&utm_campaign=ar27111994%2FAesthetic-Palettes&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
</div>

## ✨ Features

- **Intuitive Palette Generator**: Create random color palettes with a single keystroke
- **Advanced Color Manipulation**: Fine-tune colors with HSL, RGB, and other controls
- **Color Theory Tools**: Generate palettes based on color theory rules (complementary, analogous, etc.)
- **Accessibility Checker**: Verify color contrast and simulate color blindness
- **User Accounts**: Save, organize, and manage your palettes
- **Collections**: Group related palettes into collections
- **Export Options**: Export palettes in various formats (PNG, SVG, CSS, etc.)
- **Community Features**: Discover trending palettes and share your creations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Internationalization**: Supports multiple languages
- **Dark/Light Mode**: Choose your preferred theme

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

### Installation

1. Clone the repository

```bash
git clone https://github.com/ar27111994/Aesthetic-Palettes.git
cd Aesthetic-Palettes
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Architecture

Aesthetic Palettes follows a JAMstack architecture with serverless functions:

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS
- **State Management**: Redux Toolkit
- **API Layer**: GraphQL and REST endpoints via Next.js API routes
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Hosting**: Vercel (zero-cost deployment)

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- `users`: User profiles and preferences
- `palettes`: Color palettes created by users
- `palette_colors`: Individual colors within palettes
- `collections`: User-created collections to organize palettes
- `tags`: Tags for categorizing palettes

Row-level security policies ensure data protection and proper access control.

## 🧩 Key Components

- **Palette Generator**: Core functionality for creating and manipulating color palettes
- **Color Manipulation Tools**: Utilities for adjusting and analyzing colors
- **User Dashboard**: Interface for managing saved palettes and collections
- **Community Explorer**: Browse and discover palettes created by others
- **Export System**: Tools for exporting palettes in various formats

## 🌐 API Endpoints

### REST API

- `/api/palettes`: CRUD operations for palettes
- `/api/palettes/search`: Search palettes by name, tag, or color
- `/api/palettes/collections`: Manage palette collections

### GraphQL API

The GraphQL API provides flexible data fetching with resolvers for:

- Palettes and collections
- User profiles
- Search functionality
- Community features

## 🧪 Testing

Run tests with:

```bash
npm test
```

The project uses Jest for unit tests and Testing Library for component tests.

## 🤝 Contributing

Contributions are welcome! Please check out our [Contribution Guidelines](docs/contribution.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [dev-setup.md](docs/dev-setup.md) for more details on the development environment and workflow.

## 📝 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the LICENSE file for details.

The AGPL-3.0 is a copyleft license that requires anyone who distributes your code or a derivative work to make the source available under the same terms. This is particularly important for web applications, as it requires making the source code available to users who interact with the application over a network.

Key points of the AGPL-3.0 license:

- You can use the software for commercial purposes
- You can modify the software and create derivative works
- You must disclose the source code when you distribute the software
- You must state changes made to the code
- You must license your modifications under the same license
- You must provide the complete source code to users who interact with the software over a network

For more details, see the [full license text](https://www.gnu.org/licenses/agpl-3.0.en.html).

## 🙏 Acknowledgements

- [Coolors.co](https://coolors.co/) for inspiration
- [Chroma.js](https://gka.github.io/chroma.js/) for color manipulation
- [Supabase](https://supabase.io/) for backend services
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Headless UI](https://headlessui.dev/) for accessible UI components
