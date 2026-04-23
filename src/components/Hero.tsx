import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '4rem 2rem 0 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ textAlign: 'center', maxWidth: '1000px' }}
      >
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
          fontWeight: 700, 
          lineHeight: 1.05, 
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          color: 'white'
        }}>
          Automate your meeting <br /> 
          <span style={{ color: 'var(--secondary-fg)' }}>intelligence workflow.</span>
        </h1>

        <p style={{ 
          fontSize: '1.15rem', 
          color: 'var(--secondary-fg)', 
          maxWidth: '650px', 
          margin: '0 auto 3.5rem auto',
          lineHeight: 1.6
        }}>
          The modern platform for high-performance teams to capture, synthesize, and automate meeting outcomes with precision.
        </p>
      </motion.div>

      {/* Platform preview removed */}
    </section>
  );
};

export default Hero;
