import axios from 'axios'

// Use explicit localhost API to avoid DNS issues in development.
// In production set VITE_API_URL to your deployed API.
const baseURL = (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost')
	? (import.meta.env.VITE_API_URL || '/api')
	: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

export default axios.create({ baseURL })
