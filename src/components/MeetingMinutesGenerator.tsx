import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, HelpCircle, ArrowUpRight } from 'lucide-react';
import { generateDocx, parseChatGPTContent } from '../utils/docxUtils';

const MeetingMinutesGenerator: React.FC = () => {
  const [template, setTemplate] = useState<File | null>(null);
  const [pasteContent, setPasteContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.docx')) {
        setTemplate(file);
        setError('');
      } else {
        setError('Please upload a .docx file.');
      }
    }
  };

  const handlePreview = () => {
    if (!template) {
      setError('Please upload a template first.');
      return;
    }
    if (!pasteContent) {
      setError('Please paste the meeting transcript.');
      return;
    }
    
    try {
      const data = parseChatGPTContent(pasteContent);
      setPreviewData(data);
      setShowPreview(true);
      setError('');
    } catch (err: any) {
      setError('Failed to parse transcript. Please check the format.');
    }
  };

  const handleExport = async () => {
    if (!template || !previewData) return;

    setStatus('processing');
    try {
      await generateDocx(template, previewData);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setShowPreview(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Failed to generate document');
    }
  };

  return (
    <section id="generator" style={{ padding: '8rem 2rem', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!showPreview ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div style={{ marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Generator Center</h2>
                <p style={{ color: 'var(--secondary-fg)', maxWidth: '500px' }}>Upload your enterprise template and automate document creation with precision.</p>
                
                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '3rem', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <HelpCircle size={20} color="var(--accent-color)" />
                      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Implementation Guide</h4>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {['{title}', '{date}', '{time}', '{venue}', '{attendees}', '{recorded_by}', '{summary}', '{agenda}', '{#notes}', '{/notes}', '{#task}', '{/task}'].map(tag => (
                        <li key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-fg)', fontSize: '0.85rem' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-color)' }} />
                          <code style={{ background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#fff' }}>{tag}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ width: '1px', background: 'var(--border-color)' }} />
                  <div style={{ width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--secondary-fg)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Ensure your document contains the correct tags within brackets to allow for seamless data injection.
                    </p>
                    <a href="/sample_template.docx" download style={{ 
                      color: 'white', 
                      fontSize: '0.9rem', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontWeight: 500
                    }}>
                      <Download size={18} />
                      Download Sample Template
                      <ArrowUpRight size={14} style={{ opacity: 0.4 }} />
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Left: Upload */}
                <div className="pro-card" style={{ padding: '3rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    {template ? <CheckCircle2 color="#10b981" size={32} /> : <Upload color="var(--accent-color)" size={32} />}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>1. Upload Template</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-fg)', marginBottom: '2rem' }}>Drop your .docx file here or click to browse.</p>
                  
                  <input 
                    type="file" 
                    accept=".docx" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" style={{
                    background: 'white',
                    color: 'black',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}>
                    {template ? template.name : 'Select File'}
                  </label>
                </div>

                {/* Right: Paste */}
                <div className="pro-card" style={{ padding: '3rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <FileText size={20} color="var(--accent-color)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>2. Meeting Transcript</h3>
                  </div>
                  <textarea 
                    placeholder="Paste your ChatGPT summary or transcript here..."
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    style={{
                      flex: 1,
                      minHeight: '200px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      color: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'none',
                      marginBottom: '2rem'
                    }}
                  />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                          <AlertCircle size={14} />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handlePreview}
                      disabled={!template || !pasteContent}
                      style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: (!template || !pasteContent) ? 'not-allowed' : 'pointer',
                        opacity: (!template || !pasteContent) ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ArrowUpRight size={20} />
                      <span>Review & Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="preview-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Document Preview</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--secondary-fg)' }}>Review how your meeting minutes will appear in Word.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setShowPreview(false)}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--border-color)', 
                      color: 'white', 
                      padding: '0.6rem 1.2rem', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Edit Data
                  </button>
                  <button 
                    onClick={handleExport}
                    disabled={status === 'processing'}
                    style={{
                      background: status === 'success' ? '#22c55e' : 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: status === 'processing' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {status === 'processing' ? (
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : status === 'success' ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Download size={18} />
                    )}
                    <span>{status === 'success' ? 'Exported!' : 'Export to Word'}</span>
                  </button>
                </div>
              </div>

              {/* Word Document Simulation */}
              <div style={{ 
                background: '#1a1a1a', 
                padding: '4rem 2rem', 
                borderRadius: '16px', 
                display: 'flex', 
                justifyContent: 'center',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '100%',
                  maxWidth: '800px',
                  minHeight: '1000px',
                  background: 'white',
                  color: '#333',
                  padding: '4rem 5rem',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  fontFamily: '"Arial", sans-serif',
                  lineHeight: '1.4',
                  textAlign: 'left'
                }}>
                  {/* Title Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <tbody>
                      <tr>
                        <td colSpan={4} style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', background: '#f8f9fa' }}>
                          <strong style={{ fontSize: '16pt' }}>Minutes of the Meeting</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px', width: '15%' }}><strong>Date:</strong></td>
                        <td style={{ border: '1px solid #000', padding: '8px', width: '35%' }}>{previewData?.date}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', width: '15%' }}><strong>TIME:</strong></td>
                        <td style={{ border: '1px solid #000', padding: '8px', width: '35%' }}>{previewData?.time || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Venue:</strong></td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '8px' }}>{previewData?.venue || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Participant:</strong></td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '8px' }}>{previewData?.attendees}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Record by:</strong></td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '8px' }}>{previewData?.['recorded by'] || previewData?.recorded_by || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px' }}><strong>Prepared by:</strong></td>
                        <td colSpan={3} style={{ border: '1px solid #000', padding: '8px' }}>{previewData?.['prepared by'] || previewData?.prepared_by || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p style={{ marginTop: '2rem', marginBottom: '0.5rem' }}><strong>Agenda</strong></p>
                  <div style={{ fontSize: '11pt', marginBottom: '2rem', color: '#444', whiteSpace: 'pre-wrap' }}>
                    {previewData?.agenda || 'No agenda items provided.'}
                  </div>

                  <p style={{ marginTop: '2rem', marginBottom: '0.5rem' }}><strong>Meeting Notes</strong></p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '10pt' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Agenda Item</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Discussion Points</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Point Person</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Action Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData?.notes?.length > 0 ? (
                        previewData.notes.map((note: any, i: number) => (
                          <tr key={i}>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{note.item}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{note.discussion}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{note.person}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{note.action}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ border: '1px solid #000', padding: '20px', textAlign: 'center', color: '#888' }}>
                            No meeting notes detected in transcript.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <p style={{ marginTop: '2rem', marginBottom: '0.5rem' }}><strong>Follow-Up Task</strong></p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '10pt' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Follow-Up Task</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Point Person</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', background: '#f8f9fa' }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData?.task?.length > 0 ? (
                        previewData.task.map((t: any, i: number) => (
                          <tr key={i}>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{t.task}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{t.person}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{t.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ border: '1px solid #000', padding: '20px', textAlign: 'center', color: '#888' }}>
                            No follow-up tasks detected in transcript.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default MeetingMinutesGenerator;
