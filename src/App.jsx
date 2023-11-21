import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from "react-redux";
import store from "./store";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/login" element={<AuthPage />}></Route>
            <Route path="*" element={<AuthPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
}
