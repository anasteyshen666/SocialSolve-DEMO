import { useState, useEffect } from "react";
import { supabase } from "./supabase";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonId, setLessonId] = useState(null);

  const [completedLessons, setCompletedLessons] = useState(0);

  
  useEffect(() => {
    async function loadProgress() {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from("user_progress")
        .select("completed_lessons")
        .eq("user_email", user.email)
        .single();

      if (!error && data) {
        setCompletedLessons(data.completed_lessons);
      } else {
        setCompletedLessons(0);
      }
    }

    loadProgress();
  }, [user]);

  async function handleRegister(userData) {
    setUser(userData);

    
    await supabase.from("user_progress").upsert([
      {
        user_email: userData.email,
        completed_lessons: 0,
      },
    ]);

    setCompletedLessons(0);
    setPage("profile");
  }

  async function handleLogin(userData) {
    setUser(userData);

    
    const { data, error } = await supabase
      .from("user_progress")
      .select("completed_lessons")
      .eq("user_email", userData.email)
      .single();

    if (!error && data) {
      setCompletedLessons(data.completed_lessons);
    } else {
      
      await supabase.from("user_progress").upsert([
        {
          user_email: userData.email,
          completed_lessons: 0,
        },
      ]);

      setCompletedLessons(0);
    }

    setPage("profile");
  }

  function handleLogout() {
    setUser(null);
    setCompletedLessons(0);
    setLessonId(null);
    setLessonTitle("");
    setPage("login");
  }

  async function handleLessonComplete(id) {
    if (!user?.email) return;

    
    const { error } = await supabase
      .from("user_progress")
      .upsert([
        {
          user_email: user.email,
          completed_lessons: id,
        },
      ]);

    if (error) {
      console.log("Supabase save progress error:", error);
      return;
    }

    setCompletedLessons(id);
    setPage("profile");
  }

  return (
    <div>
      {page === "landing" && (
        <Landing
          goLogin={() => setPage("login")}
          goRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register
          onRegister={handleRegister}
          goLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login
          onLogin={handleLogin}
          goRegister={() => setPage("register")}
        />
      )}

      {page === "profile" && (
        <Profile
          user={user}
          completedLessons={completedLessons}
          goToChat={(id, title) => {
            setLessonId(id);
            setLessonTitle(title);
            setPage("chat");
          }}
          onLogout={handleLogout}
        />
      )}

      {page === "chat" && (
        <Chat
          user={user}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          goBack={() => setPage("profile")}
          onLessonComplete={() => handleLessonComplete(lessonId)}
        />
      )}
    </div>
  );
}
