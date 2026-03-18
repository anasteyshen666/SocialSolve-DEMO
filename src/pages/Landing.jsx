import "./Landing.css";

export default function Landing({ goLogin, goRegister }) {
  return (
    <div className="landing-page">
      <div className="landing-container">

        <div className="landing-header">
          <h1 className="logo">
            Social<span>Solve</span>
          </h1>

          <div className="landing-buttons">
            <button className="btn-outline" onClick={goLogin}>
              Login
            </button>

            <button className="btn-main" onClick={goRegister}>
              Get Started
            </button>
          </div>
        </div>

        <div className="landing-hero">
          <div className="hero-text">
            <h2>Improve your social skills with an AI friend.</h2>

            <p>
              SocialSolve is a platform where you practice real-life conversations
              with an AI agent. Learn how to introduce yourself, make small talk,
              handle conflict, and gain confidence.
            </p>

            <p>
              The AI adapts to your personality, understands your struggles, and generates realistic
              dialogue lessons in real time.
            </p>

            <button className="btn-big" onClick={goRegister}>
              Start Training Now
            </button>
          </div>

          <div className="hero-card">
            <h3>Example lesson</h3>

            <div className="bubble assistant">
              Hi! I'm Leo. Want to practice greeting people? 
            </div>

            <div className="bubble user">
              Sure... I'm kinda nervous.
            </div>

            <div className="bubble assistant">
              No worries. Imagine we meet at school. What would you say first?
            </div>

            <p className="hero-note">
              Real-time roleplay · Personalized lessons · Confidence training
            </p>
          </div>
        </div>

        <div className="landing-footer">
          <p>© 2026 SocialSolve · Built by Danila Stavich for RAF Challenge</p>
        </div>

      </div>
    </div>
  );
}
