import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const HomeLinkApp = lazy(() => import("../homelink/HomeLinkApp.jsx"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeLink | Verified Rentals & Roommates" },
      {
        name: "description",
        content: "Find verified rentals and compatible roommates with zero brokerage on HomeLink.",
      },
      { property: "og:title", content: "HomeLink | Verified Rentals & Roommates" },
      {
        property: "og:description",
        content: "Find verified rentals and compatible roommates with zero brokerage on HomeLink.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HomeLinkApp />
      </Suspense>
    </ClientOnly>
  );
}
