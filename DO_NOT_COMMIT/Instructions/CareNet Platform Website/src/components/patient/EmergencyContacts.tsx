import { Plus, Phone, Edit, Trash2, User, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface EmergencyContactsProps {
  contacts: Array<{
    id: string;
    name: string;
    relation: string;
    phone: string;
    isPrimary: boolean;
  }>;
  onAddContact: () => void;
  onEditContact: (id: string) => void;
  onDeleteContact: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onCallContact: (id: string) => void;
}

export function EmergencyContacts({
  contacts,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onSetPrimary,
  onCallContact
}: EmergencyContactsProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Emergency Contacts</h1>
          <Button
            onClick={onAddContact}
            size="sm"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Primary Contact */}
        {contacts.filter(c => c.isPrimary).map((contact) => (
          <div
            key={contact.id}
            className="finance-card p-6 mb-6"
            style={{ borderLeft: '4px solid #FFB3C1' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ color: '#535353' }}>{contact.name}</h3>
                  <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                </div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>{contact.relation}</p>
                <p style={{ color: '#535353' }}>{contact.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => onCallContact(contact.id)}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  color: 'white'
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                onClick={() => onEditContact(contact.id)}
                variant="outline"
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDeleteContact(contact.id)}
                variant="outline"
                className="bg-white/50 border-white/50"
                style={{ color: '#FF6B7A' }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Other Contacts */}
        <h2 className="mb-4" style={{ color: '#535353' }}>Other Contacts</h2>
        <div className="space-y-3">
          {contacts.filter(c => !c.isPrimary).map((contact) => (
            <div key={contact.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{contact.name}</h3>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>{contact.relation}</p>
                  <p className="text-sm" style={{ color: '#535353' }}>{contact.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  onClick={() => onCallContact(contact.id)}
                  size="sm"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                    color: 'white'
                  }}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onSetPrimary(contact.id)}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/50 text-xs"
                  style={{ color: '#535353' }}
                >
                  Set Primary
                </Button>
                <Button
                  onClick={() => onEditContact(contact.id)}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDeleteContact(contact.id)}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#FF6B7A' }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contacts.filter(c => !c.isPrimary).length === 0 && (
          <div className="text-center py-12 finance-card">
            <User className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No additional contacts</p>
            <p className="text-sm mb-4" style={{ color: '#848484' }}>
              Add more emergency contacts for safety
            </p>
            <Button
              onClick={onAddContact}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        )}

        {/* Info */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ background: 'rgba(142, 197, 252, 0.1)' }}
        >
          <p className="text-sm" style={{ color: '#535353' }}>
            💡 <strong>Tip:</strong> Emergency contacts will be notified when you activate the SOS button.
          </p>
        </div>
      </div>
    </div>
  );
}
