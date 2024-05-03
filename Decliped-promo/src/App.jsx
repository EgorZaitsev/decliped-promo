//import Groups from "./components/Groups";
//import LoggedUser from "./components/LoggedUser";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UserLogin from "./components/UserLogin";
import Main from "./components/Main";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </>
  );
}
export default App;
