'use client';

import { useRouter } from 'next/navigation';
import { Heart, Shield, Clock, Users, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: Shield, title: 'Verified Caregivers', description: 'All caregivers undergo thorough background checks' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance whenever you need it' },
    { icon: Heart, title: 'Quality Care', description: 'Experienced professionals providing compassionate care' },
    { icon: Users, title: 'Trusted Agencies', description: 'Licensed agencies with proven track records' },
  ];

  const testimonials = [
    { name: 'Mrs. Fatima Ahmed', role: 'Guardian', rating: 5, text: 'CareNet helped me find the perfect caregiver for my mother. The platform is easy to use and the caregivers are highly professional.' },
    { name: 'Rashid Khan', role: 'Caregiver', rating: 5, text: 'As a caregiver, CareNet connects me with families who truly appreciate my work. The payment system is transparent and reliable.' },
    { name: 'Green Care Agency', role: 'Agency', rating: 5, text: 'Managing our caregivers and clients has never been easier. CareNet\'s platform streamlines everything.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="px-6 pt-8 pb-12">
        <div className="flex items-center justify-center mb-8">
          <div 
            className="flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="mb-4" style={{ color: '#535353' }}>CareNet</h1>
          <p className="text-lg mb-6" style={{ color: '#848484' }}>
            Quality care, connected
          </p>
          <p className="mb-8" style={{ color: '#535353' }}>
            Bangladesh's trusted platform for connecting families with verified caregivers and professional agencies
          </p>

          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <Button
              onClick={() => router.push('/auth/role-selection')}
              size="lg"
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
                color: 'white',
                border: 'none'
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push('/auth/login')}
              size="lg"
              variant="outline"
              className="w-full bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12">
        <h2 className="text-center mb-8" style={{ color: '#535353' }}>Why Choose CareNet?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="finance-card p-6">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)'
                }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2" style={{ color: '#535353' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-6 py-12">
        <h2 className="text-center mb-8" style={{ color: '#535353' }}>What Our Users Say</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="finance-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <span className="text-white">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#535353' }}>{testimonial.name}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>{testimonial.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                  ))}
                </div>
              </div>
              <p className="text-sm" style={{ color: '#535353' }}>{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-12">
        <div className="finance-card p-8 text-center max-w-2xl mx-auto">
          <h2 className="mb-4" style={{ color: '#535353' }}>Ready to Get Started?</h2>
          <p className="mb-6" style={{ color: '#848484' }}>
            Join thousands of families and caregivers finding quality care solutions
          </p>
          <Button
            onClick={() => router.push('/guardian/packages')}
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            Browse Agencies
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-3" style={{ color: '#535353' }}>CareNet</h3>
              <p className="text-sm" style={{ color: '#848484' }}>
                Quality care, connected across Bangladesh
              </p>
            </div>
            <div>
              <h4 className="mb-3" style={{ color: '#535353' }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#848484' }}>
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
                <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3" style={{ color: '#535353' }}>Contact</h4>
              <div className="space-y-2 text-sm" style={{ color: '#848484' }}>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+880 1XXX-XXXXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@carenet.bd</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/30 text-center text-sm" style={{ color: '#848484' }}>
            <p>&copy; 2024 CareNet Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
