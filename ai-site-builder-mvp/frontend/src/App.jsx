import React, { useState } from 'react'
import axios from 'axios'

export default function App(){
  const [prompt, setPrompt] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:4000');

  async function generate(){
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/generate`, { prompt, styleHints: '' }, { timeout: 120000 });
      setHtml(res.data.html || '');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  function downloadHtml(){
    const blob = new Blob([html], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'generated-site.html'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'system-ui,Arial,Helvetica',gap:12}}>
      <div style={{width:420,padding:16,borderRight:'1px solid #eee',boxSizing:'border-box',overflow:'auto'}}>
        <h2>AI Website Builder — MVP</h2>
        <label>Backend URL</label>
        <input value={backendUrl} onChange={e=>setBackendUrl(e.target.value)} style={{width:'100%'}} />
        <p>Describe the website you want (e.g. "A personal portfolio with hero, projects grid, contact form")</p>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={8} style={{width:'100%'}} />
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <button onClick={generate} disabled={loading || !prompt}>{loading ? 'Generating...' : 'Generate'}</button>
          <button onClick={downloadHtml} disabled={!html}>Download HTML</button>
        </div>
        <hr />
        <h4>Tips</h4>
        <ul>
          <li>Be explicit: sections, color palette, fonts.</li>
          <li>Add "include contact form" if you want a form.</li>
        </ul>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{padding:8,borderBottom:'1px solid #eee'}}>
          <strong>Live preview</strong>
        </div>
        <div style={{flex:1}}>
          {html ? (
            <iframe title="preview" srcDoc={html} style={{width:'100%',height:'100%',border:0}} />
          ) : (
            <div style={{padding:24,color:'#666'}}>No generated HTML yet — enter a prompt and press Generate.</div>
          )}
        </div>
      </div>
    </div>
  )
}
