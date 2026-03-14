import axios from "axios";

// default to local backend if NEXT_PUBLIC_API_BASE is not provided
// Server listens on PORT or 9000 by default (see Server/server.ts)
const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9000/api";

const API = axios.create({
	baseURL,
	withCredentials: true, // include cookies for auth flows
});

export default API;
