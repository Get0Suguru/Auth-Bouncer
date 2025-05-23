import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// List of secondary colors to choose from
const secondaryColors = [
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
];

// Use a random number generator to select a color
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const randomSecondaryColor = secondaryColors[getRandomInt(secondaryColors.length)];

document.documentElement.style.setProperty('--dynamic-secondary-color', randomSecondaryColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
