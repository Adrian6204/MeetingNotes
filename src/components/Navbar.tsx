import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        zIndex: 1000,
        background: 'rgba(8, 8, 8, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
        <div style={{ background: 'var(--accent-color)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layers size={18} color="white" />
        </div>
        <span>MeetingNotes</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <a href="#" style={{ color: 'var(--secondary-fg)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Platform</a>
        <a href="#" style={{ color: 'var(--secondary-fg)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Solutions</a>
        <a href="#" style={{ color: 'var(--secondary-fg)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Resources</a>
        <a href="#" style={{ color: 'var(--secondary-fg)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Pricing</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--secondary-fg)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Sign in</button>
        <button style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Get started</button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
