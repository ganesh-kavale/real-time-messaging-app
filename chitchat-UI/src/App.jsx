import "./App.css";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";
import JoinCreateChat from "./components/JoinCreateChat";

function App() {
  return (
    <div className="app-shell" id="home">
      <header className="app-navbar">
        <div className="app-navbar__inner">
          <a className="app-brand" href="#home" aria-label="Meetin home">
            <span className="app-brand__icon" aria-hidden="true">
              <FiMessageCircle />
            </span>
            <span className="app-brand__name">MEETIN</span>
          </a>
          <nav aria-label="Main navigation">
            <a className="app-nav-link" href="#join">
              Start a chat
              <FiArrowRight aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <img
            className="welcome-panel__image"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85"
            alt="Friends spending time together outdoors"
          />
          <div className="welcome-panel__shade" aria-hidden="true" />
          <div className="welcome-panel__content">
            <p className="welcome-panel__eyebrow">A LITTLE CLOSER, EVERY DAY</p>
            <h1 id="welcome-title">Good friends.<br />Great conversations.</h1>
            <p className="welcome-panel__copy">
              Make a space for your favorite people and keep the conversation going.
            </p>
          </div>
        </section>
        <section className="join-panel" id="join" aria-label="Join or create a group">
          <JoinCreateChat />
        </section>
      </main>
    </div>
  );
}

export default App;
