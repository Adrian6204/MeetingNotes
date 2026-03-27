import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '0 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'var(--accent-glow)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: -1
      }} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ textAlign: 'center', maxWidth: '900px' }}
      >
        <div className="glass" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem', 
          borderRadius: '100px',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--accent-color)',
          borderColor: 'var(--accent-color)',
          borderWidth: '0.5px',
          borderStyle: 'solid'
        }}>
          <span style={{ fontWeight: 600 }}>NEW</span>
          <span style={{ opacity: 0.6 }}>AI-Powered Transcription is here</span>
          <ArrowRight size={14} />
        </div>

        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 6rem)', 
          fontWeight: 700, 
          lineHeight: 1.1, 
          letterSpacing: '-0.04em',
          marginBottom: '1.5rem'
        }}>
          Where Meetings <br /> 
          <span style={{ 
            background: 'linear-gradient(to right, #6366f1, #a855f7)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Become Actions</span>
        </h1>

        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
          color: 'rgba(255,255,255,0.6)', 
          maxWidth: '600px', 
          margin: '0 auto 3rem auto',
          lineHeight: 1.6
        }}>
          MeetingNotes centralizes your team's collective brain. 
          Automate follow-ups, synthesize decisions, and never miss a beat.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <button style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px var(--accent-glow)'
          }}>
            Get Started Free
          </button>
          <button className="glass" style={{
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Play size={18} fill="white" />
            Watch Demo
          </button>
        </div>
      </motion.div>

      {/* Hero Image Mockup Area */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="glass"
        style={{
          width: '90%',
          maxWidth: '1000px',
          height: '400px',
          marginTop: '5rem',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em'
        }}
      >
        [ INTERACTIVE DASHBOARD PREVIEW ]
      </motion.div>
    </section>
  );
};

export default Hero;
