'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuardianRegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/guardian/registration/step-1');
  }, [router]);

  return null;
}
