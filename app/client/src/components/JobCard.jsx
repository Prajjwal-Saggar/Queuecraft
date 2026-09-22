import { CalendarDays, CheckCircle2, CircleAlert, Clock3, FileImage, LoaderCircle, UploadCloud } from 'lucide-react'

const statusDetails = {
  UPLOADED: { label: 'Uploaded', icon: UploadCloud },
  QUEUED: { label: 'Queued', icon: Clock3 },
  PROCESSING: { label: 'Processing', icon: LoaderCircle },
  DONE: { label: 'Done', icon: CheckCircle2 },
  FAILED: { label: 'Failed', icon: CircleAlert },
}

function JobCard({ job }) {
  const date = job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'
  const status = statusDetails[job.status] || statusDetails.UPLOADED
  const StatusIcon = status.icon
  return <article className="job-card"><div className="job-preview"><FileImage size={27} /></div><div className="job-details"><h3>{job.originalFilename || 'Untitled image'}</h3><span className="job-meta"><CalendarDays size={13} /> {date}</span></div><span className={`job-status status-${job.status?.toLowerCase() || 'uploaded'}`}><StatusIcon size={14} className={job.status === 'PROCESSING' ? 'spin' : ''} /> {status.label}</span></article>
}

export default JobCard