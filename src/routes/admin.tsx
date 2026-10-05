import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const AdminApp = lazy(() => import('../admin/AdminApp.jsx'));

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'HomeLink Admin' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return <ClientOnly fallback={<div className="min-h-screen bg-slate-950" />}><Suspense fallback={<div className="min-h-screen bg-slate-950" />}><AdminApp /></Suspense></ClientOnly>;
}
