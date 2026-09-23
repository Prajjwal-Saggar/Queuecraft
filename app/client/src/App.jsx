import { useEffect, useState } from 'react'
import { AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'
import UploadPanel from './components/UploadPanel'
import JobList from './components/JobList'
import { getJobs, uploadJob } from './services/api'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const loadJobs = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      setJobs(await getJobs())
      setError('')
    } catch {
      setError('Could not reach the API. Check that the server is running.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }
  useEffect(() => {
    let active = true
    const refreshJobs = async () => {
      try {
        const items = await getJobs()
        if (active) {
          setJobs(items)
          setError('')
        }
      } catch {
        if (active) setError('Could not reach the API. Check that the server is running.')
      } finally {
        if (active) setLoading(false)
      }
    }

    refreshJobs()
    const pollingId = window.setInterval(refreshJobs, 2000)

    return () => {
      active = false
      window.clearInterval(pollingId)
    }
  }, [])
  const handleUpload = async (file) => { setUploading(true); setError(''); setProgress(0); try { const job = await uploadJob(file, (event) => setProgress(event.total ? Math.round((event.loaded * 100) / event.total) : 0)); setJobs((current) => [job, ...current]) } catch { setError('Upload failed. Make sure the file is a valid image and try again.') } finally { setUploading(false) } }

  return <main className="app-shell"><Navbar connected={!error} /><div className="page-content"><section className="hero-copy"><div className="hero-kicker"><Sparkles size={14} /> A calmer way to process media</div><h1>Move images from<br /><em>idea to action.</em></h1><p>Queuecraft keeps every visual task organized, visible, and ready for what comes next.</p></section><UploadPanel onUpload={handleUpload} uploading={uploading} progress={progress} />{error && <div className="error-banner"><AlertCircle size={17} /><span>{error}</span><button type="button" onClick={() => loadJobs(true)}>Retry <ArrowUpRight size={14} /></button></div>}<JobList jobs={jobs} loading={loading} /></div><footer><span>QUEUECRAFT / 01</span><span>Built for focused flow</span></footer></main>
}

export default App
