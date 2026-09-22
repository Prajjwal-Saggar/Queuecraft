import { ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

function UploadPanel({ onUpload, uploading, progress }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const selectFile = (file) => { if (file?.type.startsWith('image/')) onUpload(file) }

  return <section className={`upload-panel ${dragging ? 'is-dragging' : ''}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]) }}>
    <div className="upload-icon"><ImagePlus size={25} /></div><div className="upload-copy"><h2>Queue a new image</h2><p>Drop an image here or choose a file to send it into the queue.</p></div>
    <button className="primary-button" type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle className="spin" size={17} /> : <UploadCloud size={17} />}{uploading ? `Uploading ${progress}%` : 'Choose image'}</button>
    <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => selectFile(event.target.files[0])} />
  </section>
}

export default UploadPanel