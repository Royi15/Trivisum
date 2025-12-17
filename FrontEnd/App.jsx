import { useState } from "react";
import HomePage from "./HomePage";
import LoggedInPage from "./LoggedInPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? (
        <LoggedInPage onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <HomePage onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
