import { createBrowserRouter } from "react-router-dom";
import Landing from "../../pages/Landing/Landing.jsx";
import MainLayout from "../../layouts/mainLayout/MainLayout.jsx";
import Register from "../../pages/Register/Register.jsx";
import Login from "../../pages/Login/Login.jsx";
import ProtectedRoute from "../common/ProtectedRoute.jsx";
import Purchases from "../../pages/Purchases/Purchases.jsx";
import AdminAuthorLayout from "../../layouts/adminAuthorLayout/AdminAuthorLayout.jsx";
import Roles from "../../pages/Roles/Roles.jsx";
import Permissions from "../../pages/Permissions/Permissions.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute requiredRole="all"></ProtectedRoute>,
    children: [
      {
        path: "",
        element: (
          <MainLayout>
            <Landing />
          </MainLayout>
        ),
      },
      {
        path:"/purchases",
        element:(
          <MainLayout>
            <Purchases/>
          </MainLayout>
        )
      }
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/admin",
    element: <ProtectedRoute requiredRole="admin"></ProtectedRoute>,
    children:[
      {
          path:"dashboard",
          element:(
              <AdminAuthorLayout>
                  <Roles/>
              </AdminAuthorLayout>
          )
      },
      {
        path:"permissions",
        element:(
          <AdminAuthorLayout>
            <Permissions/>
          </AdminAuthorLayout>
        )
      }
    ]
  },
  {
    path:"/author",
    element: <ProtectedRoute requiredRole="author"></ProtectedRoute>,
    children:[
      {
          path:"permissions",
          element:(
            <AdminAuthorLayout>
              <Permissions/>
            </AdminAuthorLayout>
          )
      },
    ]
  }
]);

export default Router;
