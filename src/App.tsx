import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MeetingMinutesGenerator from './components/MeetingMinutesGenerator';
import './styles/global.css';

function App() {
  return (
    <div className="app" style={{
      backgroundImage: 'url(/src/assets/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Hero />
      <MeetingMinutesGenerator />
    </div>
  );
}

export default App;
