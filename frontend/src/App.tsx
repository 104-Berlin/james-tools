import { RouterProvider } from "react-router"
import { createBrowserRouter } from "react-router-dom"
import AuthProvider from "./provider/AuthProvider";
import Header from "./components/Header";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Budget from "./routes/Budget";
import PastaRatio from "./routes/PastaRatio";
import Htw from "./routes/Htw";

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
      path: "/pasta_ratio",
      element: <PastaRatio />,
    },
    {
      path: "/htw",
      element: <Htw />,
    },
    {
      path: "/budget",
      element: <Budget />,
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
