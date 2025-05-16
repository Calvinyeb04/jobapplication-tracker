# JobTracker - Job Application Tracking System

JobTracker is a modern web application that helps job seekers organize their job search process. Keep track of job applications, interviews, and progress all in one place with a beautiful, intuitive interface.


## Features

- **User Authentication**: Secure sign-up and login functionality
- **Dashboard Overview**: Get a quick glimpse of your job search journey with recent applications and upcoming interviews
- **Application Tracking**: Log and monitor all your job applications in one place
- **Interview Management**: Keep track of scheduled interviews and their details
- **Status Updates**: Update application statuses as you progress through the hiring process
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth implementation with Supabase
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account for database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jobapplication-tracker.git
   cd jobapplication-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Sign Up**: Create a new account using your email
2. **Sign In**: Log in with your credentials
3. **Dashboard**: View your recent applications and upcoming interviews
4. **Add Application**: Track a new job application
5. **Manage Interviews**: Add and update interview information
6. **Update Status**: Change application status as you progress through the hiring process

## Database Schema

The application uses the following main tables:

- **users**: User authentication and profile information
- **applications**: Job application details
- **interviews**: Interview scheduling and information

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any other service that supports Next.js applications.

```bash
# Build for production
npm run build

# Start the production server
npm start
```

## Roadmap

- [ ] Email notifications for upcoming interviews
- [ ] Customizable application statuses
- [ ] Job search analytics and insights
- [ ] Resume/CV management
- [ ] Integration with job boards
- [ ] Dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the libraries and frameworks used in this project
- Inspiration from other job tracking applications
- Feedback from users and contributors

---

Made with ❤️ for job seekers everywhere
