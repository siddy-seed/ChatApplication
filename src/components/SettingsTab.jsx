import React from "react";
import { useChatContext } from "../contexts/ChatContext";
import { supabase } from "../supabaseClient";
import "./SettingsTab.css";

const SettingsTab = () => {
  const { currentUser } = useChatContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="settings-tab">
      {currentUser ? (
        <div className="settings-card">
          <h2>
            Welcome,
            <br />
            {currentUser.email}
          </h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="settings-card">
          <h2>Loading user info...</h2>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
