import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { useDispatch, useSelector } from "react-redux";
import { setError, setPending, setUser } from "./toolkit/UserSlicer";
import { useEffect, useMemo } from "react";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Error from "./pages/Error";
import { RootState } from "./store/RootStore";
import { Fetch } from "./middlewares/Fetch";
import Admins from "./pages/Admins";
import Students from "./pages/Students";
import CollectionDetail from "./pages/CollectionDetail";
import BookDetail from "./pages/BookDetail";
import Collections from "./pages/Collections";
import UnitDetails from "./pages/UnitDetail";
function App() {
  const { isPending, isAuth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getMyData() {
      try {
        dispatch(setPending());
        const response = await Fetch.get("super-admin/me");
        if (response.data) {
          dispatch(setUser(response.data));
        } else {
          dispatch(setError("No user data available"));
        }
      } catch (error: any) {
        dispatch(setError(error.response?.data || "Unknown Token"));
      }
    }
    getMyData();
  }, [dispatch]);

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: "/",
          element: <Loading />,
        },
      ]);
    }
    if (isAuth) {
      return createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <Students />,
            },
            {
              path: "/admins",
              element: <Admins />,
            },
            {
              path: "/collections",
              element: <Collections />,
            },
            {
              path: "/collections/:collectionName",
              element: <CollectionDetail />,
            },
            {
              path: "/collections/:collectionName/:bookName",
              element: <BookDetail />,
            },
            {
              path: "/units/:collectionName/:bookName/:level/:unitId",
              element: <UnitDetails />,
            },
            {
              path: "*",
              element: <Error />,
            },
          ],
        },
      ]);
    } else {
      return createBrowserRouter([
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "*",
          element: <Error />,
        },
      ]);
    }
  }, [isAuth, isPending]);

  return <RouterProvider router={router} />;
}

export default App;
