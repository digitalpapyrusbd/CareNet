"use client";
import React, { useState, useEffect } from 'react';
import { apiCall } from '@/lib/api-client';

export default function PatientForm({ initial, onSaved, onCancel }: { initial?: any; onSaved: (data: any) => void; onCancel?: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial?.name || '');
    setPhone(initial?.phone || '');
    setEmail(initial?.email || '');
  }, [initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, phone, email };
      let data;
      if (initial?.id) {
        data = await apiCall(`/patients/${initial.id}`, { method: 'PUT', body: payload });
      } else {
        data = await apiCall('/patients', { method: 'POST', body: payload });
      }
      if (data?.success) onSaved(data.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border px-2 py-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border px-2 py-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border px-2 py-1" />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" className="px-3 py-1 border rounded" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
