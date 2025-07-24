import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// List of colors to choose from
const colors = [
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

// Randomly select a color
const randomColor = colors[Math.floor(Math.random() * colors.length)];

// Set the CSS variable on the document root
document.documentElement.style.setProperty('--dynamic-secondary-color', randomColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
