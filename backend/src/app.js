import express from 'express';
import dotenv from 'dotenv';
import { setupSecurityMiddleware } from './config/security.js';
import authRoutes from './routes/auth.js';
import path from 'path';

// Initialize environment variables
dotenv.config();

// Initialize express app
const app = express();
const __dirname = path.resolve()
// Body parser
app.use(express.json());

// Setup security middleware
setupSecurityMiddleware(app);

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}
// Start server
const PORT = process.env.PORT || 9876;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 