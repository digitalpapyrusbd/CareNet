import { User, Plus, Calendar, MapPin, Phone, Mail, Edit, Trash2, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  avatar?: string;
  phone: string;
  address: string;
  activeCaregiver?: string;
  nextAppointment?: string;
  status: "active" | "inactive";
}

interface MyPatientsProps {
  onNavigate: (page: string) => void;
}

export function MyPatients({ onNavigate }: MyPatientsProps) {
  const patients: Patient[] = [
    {
      id: 1,
      name: "Mrs. Fatima Rahman",
      age: 72,
      condition: "Post-Surgery Recovery",
      phone: "+880 1712-345678",
      address: "Gulshan 2, Dhaka",
      activeCaregiver: "Nurse Amina",
      nextAppointment: "Dec 5, 2:00 PM",
      status: "active",
    },
    {
      id: 2,
      name: "Mr. Abdul Karim",
      age: 68,
      condition: "Diabetes Management",
      phone: "+880 1712-345679",
      address: "Banani, Dhaka",
      activeCaregiver: "Nurse Sultana",
      nextAppointment: "Dec 6, 10:00 AM",
      status: "active",
    },
    {
      id: 3,
      name: "Mrs. Nasreen Akhter",
      age: 75,
      condition: "Dementia Care",
      phone: "+880 1712-345680",
      address: "Dhanmondi, Dhaka",
      status: "inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Add Button */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="mb-1">My Patients</h1>
            <p className="text-sm text-muted-foreground">Manage patient profiles</p>
          </div>
          <button className="btn-neumorphic-primary w-12 h-12 rounded-[22px]">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display mb-1">3</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </Card>
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display text-primary mb-1">2</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </Card>
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display mb-1">1</div>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Patients List */}
      <div className="px-6 space-y-3">
        {patients.map((patient) => (
          <Card
            key={patient.id}
            className="modern-card p-5 border-0 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
            onClick={() => onNavigate(`patient-detail-${patient.id}`)}
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full btn-neumorphic-primary flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{patient.name.charAt(0)}</span>
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="mb-0.5">{patient.name}</h3>
                  <Badge className={patient.status === "active" ? "btn-neumorphic-primary text-xs px-2 py-1" : "btn-neumorphic text-xs px-2 py-1"}>
                    {patient.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Age {patient.age} • {patient.condition}</p>
                
                {/* Contact Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {patient.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Care Info */}
            {patient.status === "active" && patient.activeCaregiver && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Caregiver:</span>
                  <span className="font-medium">{patient.activeCaregiver}</span>
                </div>
                {patient.nextAppointment && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Visit:</span>
                    <span className="font-medium text-primary">{patient.nextAppointment}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="btn-neumorphic text-sm py-2" onClick={(e) => { e.stopPropagation(); }}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="btn-neumorphic text-sm py-2 text-destructive" onClick={(e) => { e.stopPropagation(); }}>
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
