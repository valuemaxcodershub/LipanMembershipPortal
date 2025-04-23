# Literacy Promotion Association of Nigeria (LiPAN)

This is the frontend application for the Literacy Promotion Association of Nigeria (LiPAN), built using React, TypeScript, and Vite.

## Overview

LiPAN is dedicated to promoting literacy and sustainable development in Nigeria. This application serves as a portal for members to access resources, manage memberships, and participate in events.

## Environment Variables

The application requires the following environment variables to be set up for both development and production:

- `VITE_API_URL`: The base URL for the API.
- `VITE_FLUTTERWAVE_PUBLIC_KEY`: The public key for Flutterwave integration.

### Example `.env.development` File for Development

```
VITE_API_URL=http://localhost:3000
VITE_FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-public-key
```

### Example `.env.production` File for Production

```
VITE_API_URL=https://api.lipanonline.org
VITE_FLUTTERWAVE_PUBLIC_KEY=your-flutterwave-public-key
```

## Getting Started

Follow these steps to set up and run the application:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd lipan_frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the required variables as shown above.

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## Features

- Member registration and login
- Access to literacy resources
- Event management and participation
- Membership management
- Secure payment integration using Flutterwave

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Vite**: For fast development and build tooling.
- **Flowbite**: For UI components.
- **React Router**: For routing.
- **React Hook Form**: For form handling.
- **Yup**: For schema validation.
- **Tailwind CSS**: For styling.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License.
