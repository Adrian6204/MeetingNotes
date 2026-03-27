import Hero from './components/Hero';
import MeetingMinutesGenerator from './components/MeetingMinutesGenerator';
import LiquidChrome from './components/LiquidChrome';
import './styles/global.css';

function App() {
  return (
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
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.3}
          amplitude={0.6}
          interactive={true}
        />
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <MeetingMinutesGenerator />
      </div>
    </div>
  );
}

export default App;
