import AdminDashboard from '@/components/AdminDashboard';
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <main>
      <AdminDashboard />
      {children}
    </main>
  )
}
