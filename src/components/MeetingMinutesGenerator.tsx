import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, HelpCircle, ArrowUpRight } from 'lucide-react';
import { generateDocx, parseChatGPTContent } from '../utils/docxUtils';

const MeetingMinutesGenerator: React.FC = () => {
  const [template, setTemplate] = useState<File | null>(null);
  const [pasteContent, setPasteContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

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

  const handleGenerate = async () => {
    if (!template || !pasteContent) return;

    setStatus('processing');
    try {
      const data = parseChatGPTContent(pasteContent);
      await generateDocx(template, data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Failed to generate document');
    }
  };

  return (
    <section id="generator" style={{ padding: '8rem 2rem', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                {['{date}', '{time}', '{venue}', '{attendees}', '{recorded_by}', '{agenda}', '{#notes}', '{/notes}'].map(tag => (
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
                onClick={handleGenerate}
                disabled={status === 'processing' || !template || !pasteContent}
                style={{
                  background: status === 'success' ? '#22c55e' : 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: (status === 'processing' || !template || !pasteContent) ? 'not-allowed' : 'pointer',
                  opacity: (status === 'processing' || !template || !pasteContent) ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'processing' ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Processing...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Generated!</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Generate Documents</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default MeetingMinutesGenerator;
