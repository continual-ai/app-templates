import { lazy, Suspense } from "react";
import { createHashRouter, Navigate, RouterProvider } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/routes/Dashboard";
import { NotFound } from "@/routes/NotFound";
import { Settings } from "@/routes/Settings";
const Styleguide = lazy(() => import("@/routes/Styleguide").then((module) => ({ default: module.Styleguide })));

// Hash routing keeps nested screens refresh-safe when this bundle is mounted at
// any defineApp route. The App runtime serves the entry route and packaged assets,
// but does not treat arbitrary browser-history paths as SPA fallbacks.
const router = createHashRouter([
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
