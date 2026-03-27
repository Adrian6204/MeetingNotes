import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Clipboard, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
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
    <section id="generator" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>Generator</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Upload your format, paste your text, and get your professional minutes instantly.</p>
          
          <div style={{ marginTop: '2rem', display: 'inline-flex', gap: '2rem', padding: '1.5rem', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', textAlign: 'left' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>How to use your own format:</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.5 }}>
                Add these "tags" anywhere in your Word file: <br />
                <code>{'{title}'}</code>, <code>{'{date}'}</code>, <code>{'{attendees}'}</code>, <br />
                <code>{'{summary}'}</code>, <code>{'{actions}'}</code>, <code>{'{decisions}'}</code>
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem', display: 'flex', alignItems: 'center' }}>
              <a href="/sample_template.docx" download style={{ color: 'white', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} color="var(--accent-color)" />
                Download Sample Template
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Step 1: Upload */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass" 
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={20} color="var(--accent-color)" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>1. Upload Template</h3>
            </div>

            <label style={{ 
              border: '2px dashed var(--glass-border)', 
              borderRadius: '16px', 
              height: '240px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }} className="upload-zone">
              <input type="file" hidden accept=".docx" onChange={handleFileUpload} />
              
              {template ? (
                <div style={{ textAlign: 'center' }}>
                  <FileText size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 600 }}>{template.name}</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Click to change</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Upload size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Drop your .docx template here</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>or click to browse</p>
                </div>
              )}
            </label>
          </motion.div>

          {/* Step 2: Paste */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass" 
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clipboard size={20} color="var(--accent-color)" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>2. Paste Content</h3>
            </div>

            <textarea 
              placeholder="Paste the generated content from ChatGPT here..."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              style={{
                width: '100%',
                height: '240px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </motion.div>
        </div>

        {/* Action Bar */}
        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={!template || !pasteContent || status === 'processing'}
            onClick={handleGenerate}
            style={{
              background: status === 'success' ? '#22c55e' : 'var(--accent-color)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: (template && pasteContent && status !== 'processing') ? 'pointer' : 'not-allowed',
              opacity: (template && pasteContent && status !== 'processing') ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: status === 'idle' ? '0 10px 30px -10px var(--accent-glow)' : 'none'
            }}
          >
            {status === 'idle' && (
              <>
                <span>Generate Minutes</span>
                <Download size={20} />
              </>
            )}
            {status === 'processing' && (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Processing...</span>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 size={20} />
                <span>Minutes Generated!</span>
              </>
            )}
          </button>
          
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            .upload-zone:hover { border-color: var(--accent-color) !important; background: rgba(255,255,255,0.02); }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default MeetingMinutesGenerator;
