import "./App.css";
import {
  Routes,
  Route,
} from "react-router-dom";
import AuthProvider from "./provider/AuthProvider";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Settlement from "./pages/Settlement";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route path="/" element={<Home />} />
          <Route path="/settlement" element={<Settlement />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
