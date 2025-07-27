
# UTChinese Network

This repository contains the source code for the UTChinese Network website, a platform for the University of Toronto's Chinese student organization. The project is designed to serve as a central hub for cultural events, career services, and community engagement, reflecting the organization's mission and activities through a modern web interface.

## Features

The platform includes a range of features for community members, staff, and administrators.

### General Features

- **Event Calendar**: A system for browsing and registering for cultural, social, and professional events.
- **Team Showcase**: A public-facing page displaying profiles of current staff members.
- **Bilingual Support**: The interface is available in both English and Chinese (Simplified).
- **Responsive Design**: The layout is optimized for a consistent experience across desktop and mobile devices.

### Staff Features

- **Profile Management**: Staff members can log in to a dedicated portal to update their personal information, job titles, and profile pictures.
- **Digital Business Card**: A unique, shareable URL is generated for each staff member's profile.

### Administrative Features

- **Admin Dashboard**: A secure backend interface for website management.
- **Profile Approval System**: All changes to staff profiles are subject to administrator approval to ensure data integrity.
- **Event Management**: A dedicated interface for creating, updating, and managing events.

## Technology Stack

### Frontend

- **Framework**: React
- **Language**: JavaScript
- **Styling**: Styled-components
- **Animations**: GSAP, Framer Motion
- **Internationalization**: React-i18next
- **Performance**: Utilizes lazy loading and code splitting.
- **Accessibility**: Developed in accordance with WCAG 2.1 guidelines.

### Backend

- **Framework**: Node.js, Express
- **Language**: JavaScript
- **Database**: PostgreSQL (Production/Staging) and SQLite (Development) with Prisma as the ORM.
- **Authentication**: Implements a JWT-based authentication system.

### Deployment and Version Control

- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Railway.
- **Version Control**: Git and GitHub.

## Design Principles

The design aims for a clean, intuitive, and accessible user experience. It uses a consistent color palette derived from the organization's logo and maintains a clear visual hierarchy to guide user interaction. The interface is designed to be functional and professional, with subtle animations to enhance usability without being distracting.

## Contributing

Contributions to the project are welcome. Please refer to the contribution guidelines (to be added) for more information on how to participate.

## License

© 2025 UTChinese Network. All rights reserved.

This project is licensed under the GNU Affero General Public License, version 3. See the [LICENSE](LICENSE) file for details.
