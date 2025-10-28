
// This file is intended to be a shell script to run the Python backend.
// A typical command would be: uvicorn backend.main:app --reload --port 3000
const scriptContent = 'uvicorn backend.main:app --reload --port 3000';
console.log(`To run the backend, execute: ${scriptContent}`);
export {};
