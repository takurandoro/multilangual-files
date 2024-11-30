# Multilingual File Manager Application

## Project Description

Develop a multi-user file manager application using Node.js, Redis, and MySQL. The application should:

- User Management: Allow user registration and login with secure password storage.
- File Management: CRUD operations on files (create, read, update, delete) within a user's designated directory structure.
- Multilingual Support (i18n): Display user interface elements (labels, messages) in different languages based on user preferences.
- Queuing System: Implement a queue using Redis to handle asynchronous tasks like file uploads or conversions (optional: add progress tracking).
- Unit Testing: Write unit tests for core functionalities, covering user registration, file management operations, and possibly the queuing system.

## Technical Considerations

Databases:

- MySQL: Store user data, file metadata (name, size, type etc.) and directory structure.
- Redis: Implement a queue for asynchronous tasks. Consider libraries like Bull or Agenda.js

- Node.js Framework: Encourage using a lightweight framework like Express.js to structure the application.
- Authentication: Use a secure hashing algorithm (e.g., bcrypt) for password storage. Consider libraries like Passport.js for user authentication.
- i18n Libraries: Explore libraries like i18next for managing and implementing multilingual functionalities.
- Testing Framework: Use a popular testing framework like Jest or Mocha for unit testing

## How to Run

```bash
# Install dependencies
npm install
# Run docker-compose
# !!!Make sure you have docker-compose installed
docker-compose up -d
# Run the application
npm run dev
```
