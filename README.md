# TierListMaker

A modern, interactive web application for creating and managing tier lists with drag-and-drop functionality. Easily organize and rank items by uploading images and sorting them into customizable tiers.

## Features

- **Custom Tier Creation**: Create and configure custom tiers with names and colors
- **Image Import**:
  - Upload images from your device via file upload
  - Import images from URLs
  - Drag and drop support
- **Interactive Management**:
  - Drag and drop items between tiers
  - Click items to assign or reassign them to different tiers
  - Delete items with automatic cleanup of uploaded files
- **Data Persistence**: Automatically saves your tier list to browser localStorage
- **Responsive Design**: Built with Bootstrap 5 for a mobile-friendly interface
- **Real-time Updates**: Immediate visual feedback for all actions
- **Backend API**: Express server handles image uploads and file management

## Technologies Used

- **Frontend**:
  - React 19
  - Bootstrap 5
  - React Testing Library
  - LocalStorage API for persistence
- **Backend**:
  - Express 4
  - Multer (file upload handling)
  - CORS enabled
  - Node.js
- **Development Tools**:
  - Create React App
  - Nodemon (for development server)
  - PostCSS & Autoprefixer

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TierListMaker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional):
```bash
cp .env.example .env
```

## Usage

### Development Mode

1. Start the backend server (for image uploads):
```bash
npm run server
```

The backend server will run on `http://localhost:5000`

2. In a separate terminal, start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Development with Auto-reload

For backend development with automatic restart on file changes:
```bash
npm run dev:server
```

### Production Build

Build the application for production:
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
TierListMaker/
├── public/              # Static files
│   ├── index.html      # HTML template
│   └── ...
├── src/
│   ├── components/     # React components
│   │   ├── ErrorBoundary.jsx    # Error handling wrapper
│   │   ├── Header.jsx           # Application header
│   │   ├── ItemImporter.jsx     # Image import interface
│   │   ├── ItemModal.jsx        # Item assignment modal
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   ├── TierBuilder.jsx      # Tier creation interface
│   │   ├── TierListMaker.jsx    # Main application component
│   │   ├── TierManager.jsx      # Tier management utilities
│   │   └── TierTable.jsx        # Tier list display
│   ├── styles/         # CSS stylesheets
│   ├── utils/          # Utility functions
│   │   ├── storage.js       # LocalStorage helpers
│   │   └── apiConfig.js     # API configuration
│   ├── App.jsx         # Root component
│   └── index.js        # Application entry point
├── server.js           # Express backend server
├── uploads/            # Uploaded images directory (created on server start)
├── package.json        # Project dependencies and scripts
└── README.md          # This file
```

## API Endpoints

The backend server provides the following REST API endpoints:

### POST `/api/upload`
Upload an image file to the server.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with a `file` field
- File size limit: 5MB

**Response:**
```json
{
  "id": "1738507200000-123456789.jpg",
  "imageUrl": "http://localhost:5000/uploads/1738507200000-123456789.jpg"
}
```

### DELETE `/api/upload/:filename`
Delete an uploaded image file.

**Request:**
- Method: `DELETE`
- URL Parameter: `filename` (the name of the file to delete)

**Response:**
```json
{
  "deleted": true
}
```

### GET `/api/health`
Health check endpoint to verify server status.

**Response:**
```json
{
  "status": "ok"
}
```

### GET `/uploads/:filename`
Serve uploaded images as static files.

**Request:**
- Method: `GET`
- URL Parameter: `filename` (the name of the file to retrieve)

**Response:**
- The requested image file

## Development

### Running Tests

Launch the test runner in interactive watch mode:
```bash
npm test
```

### Available Scripts

- `npm start` - Start the frontend development server
- `npm run build` - Create production build
- `npm test` - Run tests in watch mode
- `npm run server` - Start the backend API server
- `npm run dev:server` - Start backend with auto-reload (requires nodemon)

### Environment Variables

The application supports the following environment variables:

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:5000`)
- `PORT` - Backend server port (default: `5000`)
- `BASE_URL` - Base URL for constructing image URLs (optional)

## Data Storage

The application uses browser localStorage to persist:
- Tier configurations (names, colors, order)
- Item data (images, assignments)
- UI state (importer visibility)

Data is automatically saved on every change and loaded when the application starts.

## Browser Compatibility

This application works best in modern browsers that support:
- ES6+ JavaScript features
- LocalStorage API
- Drag and Drop API
- File API

Supported browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
