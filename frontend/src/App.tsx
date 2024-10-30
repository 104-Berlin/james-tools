import { RouterProvider } from "react-router"
import { createBrowserRouter } from "react-router-dom"
import AuthProvider from "./provider/AuthProvider";
import Header from "./components/Header";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import Login from "./routes/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ]);

  return (
    <AuthProvider>
      <Header />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
