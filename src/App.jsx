import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/navbar";
import Home from "./pages/home";
import Group from "./pages/group";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group" element={<Group />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
