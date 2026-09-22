import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v0',
  timeout: 10000,
})

export const getJobs = async () => {
  const { data } = await api.get('/job')
  return data.jobs || []
}

export const uploadJob = async (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await api.post('/job', formData, { onUploadProgress })
  return data.savedJob
}