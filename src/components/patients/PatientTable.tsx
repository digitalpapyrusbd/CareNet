"use client";
import React from 'react';

type Patient = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export default function PatientTable({ patients, onEdit, onDelete }: { patients: Patient[]; onEdit: (p: Patient) => void; onDelete: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.phone || '-'}</td>
              <td className="px-4 py-2">{p.email || '-'}</td>
              <td className="px-4 py-2 text-center">
                <button className="mr-2 text-blue-600" onClick={() => onEdit(p)}>Edit</button>
                <button className="text-red-600" onClick={() => onDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
