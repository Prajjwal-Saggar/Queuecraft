import { CircleHelp } from 'lucide-react'
import BrandMark from './BrandMark'

function Navbar({ connected }) {
  return <header className="navbar"><BrandMark /><div className="nav-status"><span className={`status-dot ${connected ? 'is-live' : ''}`} /><span>{connected ? 'API connected' : 'API offline'}</span><button className="icon-button" type="button" aria-label="Help"><CircleHelp size={18} /></button></div></header>
}

export default Navbar