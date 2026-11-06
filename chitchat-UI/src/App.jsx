import { useState } from "react";
import "./App.css";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";
import JoinCreateChat from "./components/JoinCreateChat";
import SignupView from "./components/SignupView";

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="app-shell" id="home">
      <header className="app-navbar">
        <div className="app-navbar__inner">
          <a className="app-brand" href="#home" aria-label="Meetin home">
            <span className="app-brand__icon" aria-hidden="true">
              <FiMessageCircle />
            </span>
            <span className="app-brand__name">meet.in</span>
          </a>
          <nav aria-label="Main navigation">
            <button className="app-nav-link" type="button" onClick={() => setShowSignup(true)}>
              Create account
              <FiArrowRight aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <img
            className="welcome-panel__image"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85"
            alt="Friends sitting together by the water and enjoying the view"
          />
          <div className="welcome-panel__shade" aria-hidden="true" />
          <div className="chat-preview" aria-hidden="true">
            <div className="chat-preview__top">
              <span className="chat-preview__avatars">
                <span className="chat-preview__avatar chat-preview__avatar--peach">J</span>
                <span className="chat-preview__avatar chat-preview__avatar--lime">M</span>
                <span className="chat-preview__avatar chat-preview__avatar--blue">A</span>
              </span>
              <span className="chat-preview__online"><i /> 3 here now</span>
            </div>
            <p className="chat-preview__name">the getaway crew</p>
            <div className="chat-preview__bubble chat-preview__bubble--left">Same spot next weekend?</div>
            <div className="chat-preview__bubble chat-preview__bubble--right">Yes. I&apos;ll bring snacks 😎</div>
            <div className="chat-preview__typing"><span /><span /><span /> Alex is already packed</div>
          </div>
          <div className="welcome-panel__content">
            <p className="welcome-panel__eyebrow">FOR THE PEOPLE WHO MAKE THE TRIP</p>
            <h1 id="welcome-title">Good views.<br />Better company.</h1>
            <p className="welcome-panel__copy">
              Beach days, snack stops, and “five minutes away” updates. Keep your favorite people in the loop wherever the plan takes you.
            </p>
            <div className="welcome-panel__actions">
              <a className="welcome-panel__cta" href="#join">
                Get your group together
                <FiArrowRight aria-hidden="true" />
              </a>
              <span className="welcome-panel__note">Two quick details. No awkward introductions.</span>
            </div>
          </div>
        </section>
        <section className="join-panel" id="join" aria-label="Join or create a group chat">
          {showSignup ? (
            <SignupView onBack={() => setShowSignup(false)} />
          ) : (
            <JoinCreateChat />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
