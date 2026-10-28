import { notFound } from 'next/navigation';
import AdminDashboard from './admin-dashboard';

// Read ADMIN_PASSWORD per request: a static render would freeze the 404 of a
// build made without the variable, even once it is set at runtime (Docker).
export const dynamic = 'force-dynamic';

/** Without ADMIN_PASSWORD the dashboard does not exist at all. */
export default function AdminPage() {
  if (!process.env.ADMIN_PASSWORD) notFound();
  return <AdminDashboard />;
}
