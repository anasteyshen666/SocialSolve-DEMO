import "./Profile.css";

export default function Profile({ user, goToChat, onLogout, completedLessons }) {
  const lessons = [
    { id: 1, title: "Greeting people" },
    { id: 2, title: "Small talk" },
    { id: 3, title: "Expressing opinion" },
    { id: 4, title: "Handling conflict" },
    { id: 5, title: "Confidence practice" },
  ];

  const totalLessons = lessons.length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  const level = Math.floor(completedLessons / 2) + 1;

  return (
    <div className="profile-page">
      <div className="hint-box">
        <h4>⚠ Important Setup</h4>
        <p>
          Before using SocialSolve, you must install <b>Ollama</b> and download the AI model.
        </p>
        <p>
          Open your terminal and run:
          <br />
          <code>ollama run llama3</code>
        </p>
        <p>
          Keep Ollama running while using this website.
        </p>
      </div>

      <div className="profile-section">
        <div className="profile-avatar">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>

        <div>
          <h2>{user?.name}</h2>
          <p className="profile-level">Level {level}</p>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Sign out
        </button>
      </div>

      <div className="progress-wrapper">
        <div className="progress-info">
          <span>Progress</span>
          <span>
            {completedLessons}/{totalLessons}
          </span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="lesson-path">
        {lessons.map((lesson, index) => {
          const isCompleted = lesson.id <= completedLessons;
          const isLocked = lesson.id > completedLessons + 1;
          const isActive = lesson.id === completedLessons + 1;

          return (
            <div className="lesson-item" key={lesson.id}>
              <div
                className={`circle 
                  ${isCompleted ? "completed" : ""} 
                  ${isLocked ? "locked" : ""} 
                  ${isActive ? "active" : ""}
                `}
                onClick={() => {
                  if (!isLocked && !isCompleted) {
                    goToChat(lesson.id, lesson.title);
                  }
                }}
                style={{
                  cursor: isLocked || isCompleted ? "not-allowed" : "pointer",
                }}
              >
                {lesson.id}
              </div>

              {index !== lessons.length - 1 && <div className="line"></div>}

              <div className="lesson-title">{lesson.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
