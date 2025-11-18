"use client";
import React, { useEffect, useState } from 'react';
import PatientTable from '@/components/patients/PatientTable';
import PatientForm from '@/components/patients/PatientForm';
import { apiCall } from '@/lib/api-client';

export default function Page() {
  const [patients, setPatients] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try {
      const data = await apiCall('/patients', { method: 'GET' });
      if (data?.success) setPatients(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleEdit(p: any) {
    setEditing(p);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this patient?')) return;
    try {
      await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      setPatients((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSaved(saved: any) {
    // If editing, replace, else prepend
    if (editing?.id) {
      setPatients((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } else {
      setPatients((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Patient Management</h1>
        <div>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => { setEditing(null); setShowForm(true); }}>New Patient</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <PatientForm initial={editing || undefined} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} />
    </main>
  );
}
