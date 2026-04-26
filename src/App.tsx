import Hero from './components/Hero';
import MeetingMinutesGenerator from './components/MeetingMinutesGenerator';
import ShadersBackground from './components/ui/background-shades';
import SmoothScroll from './components/ui/SmoothScroll';
import './styles/global.css';

function App() {
  return (
    <SmoothScroll>
      <div className="app" style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        background: '#080808' 
      }}>
        <ShadersBackground />
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <MeetingMinutesGenerator />
      </div>
    </SmoothScroll>
  );
}

export default App;
