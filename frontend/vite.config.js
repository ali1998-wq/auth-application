import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    globals: true, 
    environment: 'jsdom', // needed for DOM manipulation tests
    setupFiles: './src/setupTest.js', // Path to setup file
  },
})
