import axios from 'axios';

// Configuração do axios para se comunicar com o backend
const api = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default api;
