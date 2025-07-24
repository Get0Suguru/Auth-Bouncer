import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthBouncer from "./AuthBouncer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthBouncer isLogin={true} />} />
        <Route path="/register" element={<AuthBouncer isLogin={false} />} />
        <Route path="/" element={<AuthBouncer isLogin={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
