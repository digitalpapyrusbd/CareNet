import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Platform Admin</h1>
          <p className="text-sm" style={{ color: '#848484' }}>Secure Administrator Access</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@carenet.bd"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Password</Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 border-white/50 pr-10"
                style={{ color: '#535353' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" style={{ color: '#848484' }} /> : <Eye className="w-5 h-5" style={{ color: '#848484' }} />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>
              ⚠️ MFA verification required after login
            </p>
          </div>
        </div>

        <Button
          onClick={() => onLogin({ email, password })}
          disabled={!email || !password}
          className="w-full mt-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white',
            opacity: (!email || !password) ? 0.5 : 1
          }}
        >
          Continue to MFA
        </Button>
      </div>
    </div>
  );
}

