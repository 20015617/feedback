import Login from "./Login/Login.jsx";
import EmployeeHome from "./Home/EmployeeHome.jsx";
import ManagerHome from "./Home/ManagerHome.jsx";
import "./App.css";
import { useState } from "react";

function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);

  if (loggedIn) {
    return isManager ? <ManagerHome /> : <EmployeeHome />;
  }
  return <Login setIsLoggedIn={setIsLoggedIn} setIsManager={setIsManager} />;
}

export default App;
