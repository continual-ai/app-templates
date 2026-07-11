import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/routes/Dashboard";
import { NotFound } from "@/routes/NotFound";
import { Settings } from "@/routes/Settings";
const Styleguide = lazy(() => import("@/routes/Styleguide").then((module) => ({ default: module.Styleguide })));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "settings", element: <Settings /> },
      {
        path: "_styleguide",
        element: (
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading styleguide...</div>}>
            <Styleguide />
          </Suspense>
        ),
      },
      { path: "dashboard", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
