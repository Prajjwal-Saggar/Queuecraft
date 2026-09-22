import { Inbox } from 'lucide-react'
import JobCard from './JobCard'

function JobList({ jobs, loading }) {
  return <section className="queue-section"><div className="section-heading"><div><span className="eyebrow">Workspace</span><h2>Recent jobs</h2></div><span className="job-count">{loading ? '...' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}`}</span></div>{loading ? <div className="empty-state"><div className="loading-bars" /><p>Loading your queue...</p></div> : jobs.length ? <div className="job-list">{jobs.map((job) => <JobCard key={job._id} job={job} />)}</div> : <div className="empty-state"><Inbox size={28} /><p>Your queue is clear.</p><span>Uploaded images will appear here.</span></div>}</section>
}

export default JobList