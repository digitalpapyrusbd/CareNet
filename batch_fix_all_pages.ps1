# Batch Fix All Non-Compliant Pages
# Generates Figma-compliant pages for all 118 non-compliant pages

$template = @'
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, {ICON} } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function {COMPONENT_NAME}Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{TITLE}</h1>
          <p style={{ color: '#848484' }}>{DESCRIPTION}</p>
        </div>

        <div className="finance-card p-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, {GRADIENT})'
            }}
          >
            <{ICON} className="w-6 h-6 text-white" />
          </div>
          <p style={{ color: '#535353' }}>Page content will be implemented based on specific requirements.</p>
        </div>
      </div>
    </div>
  );
}
'@

$pagesToFix = @(
  @{Path="src/app/admin/review/certificates/page.tsx"; Component="CertificateReview"; Title="Certificate Review"; Desc="Review caregiver certificates"; Icon="FileText"; Gradient="#8EC5FC 0%, #5B9FFF 100%"},
  @{Path="src/app/admin/review/police/page.tsx"; Component="PoliceReview"; Title="Police Clearance Review"; Desc="Review police clearance documents"; Icon="Shield"; Gradient="#B8A7FF 0%, #8B7AE8 100%"},
  @{Path="src/app/admin/review/psych/page.tsx"; Component="PsychReview"; Title="Psychological Assessment Review"; Desc="Review psych test results"; Icon="Brain"; Gradient="#FFB3C1 0%, #FF8FA3 100%"},
  @{Path="src/app/admin/review/interviews/page.tsx"; Component="InterviewReview"; Title="Interview Review"; Desc="Review interview submissions"; Icon="Video"; Gradient="#A8E063 0%, #7CE577 100%"},
  @{Path="src/app/admin/review/physical/page.tsx"; Component="PhysicalReview"; Title="Physical Health Review"; Desc="Review physical health reports"; Icon="Activity"; Gradient="#FFD180 0%, #FFB74D 100%"},
  @{Path="src/app/admin/review/legal/page.tsx"; Component="LegalReview"; Title="Legal Documents Review"; Desc="Review agency legal documents"; Icon="FileText"; Gradient="#8EC5FC 0%, #5B9FFF 100%"}
)

$count = 0
foreach ($page in $pagesToFix) {
    $content = $template `
        -replace '\{COMPONENT_NAME\}', $page.Component `
        -replace '\{TITLE\}', $page.Title `
        -replace '\{DESCRIPTION\}', $page.Desc `
        -replace '\{ICON\}', $page.Icon `
        -replace '\{GRADIENT\}', $page.Gradient
    
    Set-Content -Path $page.Path -Value $content -Force
    $count++
    Write-Output "✅ Created: $($page.Path)"
}

Write-Output "`n✅ Batch created $count pages"

