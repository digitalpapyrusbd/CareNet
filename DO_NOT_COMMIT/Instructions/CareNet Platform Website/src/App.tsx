import { useState, useEffect } from "react";
import { Home, Sparkles, MessageSquare, User, Menu } from "lucide-react";
import { Login } from "./components/auth/Login";
import { RoleSelection } from "./components/auth/RoleSelection";
import { GuardianDashboard } from "./components/guardian/GuardianDashboard";
import { CaregiverDashboard } from "./components/caregiver/CaregiverDashboard";
import { BrowsePackages } from "./components/guardian/BrowsePackages";
import { BottomNav } from "./components/global/BottomNav";
import { TopBar } from "./components/global/TopBar";
import { AISearch } from "./components/global/AISearch";
import { ChatBox } from "./components/global/ChatBox";
import { ProfileMenu } from "./components/global/ProfileMenu";
import { Toaster } from "./components/ui/sonner";
import { Theme } from "./components/global/ThemeSelector";
import TableOfContents from "./components/navigation/TableOfContents";
import PageRouter from "./components/navigation/PageRouter";

// New page imports
import { MyPatients } from "./components/guardian/MyPatients";
import { ActiveJobs } from "./components/guardian/ActiveJobs";
import { MyJobs } from "./components/caregiver/MyJobs";
import { Earnings } from "./components/caregiver/Earnings";
import { CheckIn } from "./components/caregiver/CheckIn";
import { Settings } from "./components/common/Settings";
import { Notifications } from "./components/common/Notifications";
import { PatientDetail } from "./components/guardian/PatientDetail";
import { JobDetail } from "./components/guardian/JobDetail";

type UserRole = "guardian" | "caregiver" | "agency" | "patient" | null;

type Page = string; // Allow any page string for dynamic navigation

const themeClasses: Record<Theme, string> = {
  "light-default": "theme-light-default",
  "light-ocean": "theme-light-ocean",
  "light-sunset": "theme-light-sunset",
  "light-forest": "theme-light-forest",
  "light-lavender": "theme-light-lavender",
  "dark-default": "dark theme-dark-default",
  "dark-midnight": "dark theme-dark-midnight",
  "dark-cyberpunk": "dark theme-dark-cyberpunk",
  "dark-forest": "dark theme-dark-forest",
  "dark-royal": "dark theme-dark-royal",
};

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentPage, setCurrentPage] = useState<Page>("toc"); // Start with TOC
  const [userName, setUserName] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showAISearch, setShowAISearch] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("light-default");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole;
    const savedName = localStorage.getItem("userName");
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedRole && savedName) {
      setUserRole(savedRole);
      setUserName(savedName);
      // Always load TOC as default page
      setCurrentPage("toc");
    }
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    Object.values(themeClasses).forEach(className => {
      className.split(' ').forEach(cls => root.classList.remove(cls));
    });
    // Add current theme classes
    themeClasses[currentTheme].split(' ').forEach(cls => root.classList.add(cls));
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const handleLogin = (phone: string, password: string) => {
    // Auto-login without validation - accept any credentials
    setIsAuthenticated(true);
    setCurrentPage("role-selection");
  };

  const handleRegister = (role: string) => {
    // Auto-set the role and proceed directly
    const roleMap: { [key: string]: UserRole } = {
      'guardian': 'guardian',
      'caregiver': 'caregiver',
      'agency': 'agency',
      'patient': 'patient'
    };
    
    const selectedRole = roleMap[role] || 'guardian';
    const defaultNames = {
      'guardian': 'Guardian User',
      'caregiver': 'Caregiver User',
      'agency': 'Agency Admin',
      'patient': 'Patient User'
    };
    
    setUserRole(selectedRole);
    setUserName(defaultNames[role] || 'User');
    setCurrentPage('toc');
    localStorage.setItem('userRole', selectedRole);
    localStorage.setItem('userName', defaultNames[role] || 'User');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName("");
    setCurrentPage("login");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleCreatePage = (page: Page) => {
    setCurrentPage(page);
  };

  // Navigation items - simplified to 4 items
  const getNavItems = () => {
    return [
      { 
        icon: Menu, 
        label: "TOC", 
        page: "toc" as Page
      },
      { 
        icon: Home, 
        label: "Home", 
        page: (userRole === "guardian" ? "guardian-home" : "caregiver-home") as Page 
      },
      { 
        icon: Sparkles, 
        label: "AI Search", 
        page: "ai-search" as Page,
        onClick: () => setShowAISearch(true)
      },
      { 
        icon: MessageSquare, 
        label: "Chat", 
        page: "chat" as Page,
        onClick: () => setShowChatBox(true),
        badge: 3
      },
      { 
        icon: User, 
        label: "Profile", 
        page: (userRole === "guardian" ? "guardian-profile" : "caregiver-profile") as Page 
      },
    ];
  };

  const renderPage = () => {
    // Show Table of Contents if page is "toc"
    if (currentPage === "toc") {
      return <TableOfContents onNavigate={handleNavigate} />;
    }

    // Use PageRouter for all other pages
    return <PageRouter 
      currentPage={currentPage} 
      onNavigate={handleNavigate} 
      userRole={userRole || undefined}
      userName={userName}
    />;
  };

  if (!userRole) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Conic Gradient Background with Triple Overlays */}
        <div 
          className="fixed inset-0" 
          style={{
            background: 'conic-gradient(from 180deg at 0% 10%, #EACEDF 0deg, #DBD2FC 118.4deg, #D9DFFD 152.38deg, #7B7EEC 360deg)'
          }}
        />
        <div 
          className="fixed inset-0" 
          style={{
            background: 'linear-gradient(239.26deg, rgba(255, 255, 255, 0.2) -3.01%, rgba(255, 255, 255, 0) 104.55%)'
          }}
        />
        <div 
          className="fixed inset-0" 
          style={{
            background: 'linear-gradient(139.89deg, #F8C2CA -21.02%, rgba(255, 255, 255, 0) 77.14%)'
          }}
        />
        
        {/* Multiple Decorative Blur Circles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Largest circle - top left */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '2226px',
              height: '2226px',
              left: '-313px',
              top: '-39px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 35.18%, rgba(255, 255, 255, 0) 64.82%)',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          {/* Large circle - bottom left */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '1668px',
              height: '1668px',
              left: '-34px',
              top: '240px',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          {/* Medium circle - center right */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '1278px',
              height: '1278px',
              left: '161px',
              top: '435px',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          {/* Small-medium circle */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '970px',
              height: '970px',
              left: '315px',
              top: '589px',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          {/* Small circle with gradient */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '660px',
              height: '660px',
              left: '470px',
              top: '744px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          {/* Additional decorative circles */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '122px',
              height: '122px',
              right: '100px',
              bottom: '200px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0) 100%)',
              opacity: '0.62',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
          
          <div 
            className="absolute rounded-full"
            style={{
              width: '64px',
              height: '64px',
              left: '191px',
              bottom: '200px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.63) 0%, rgba(255, 255, 255, 0) 100%)',
              opacity: '0.62',
              backdropFilter: 'blur(11px)',
              WebkitBackdropFilter: 'blur(11px)'
            }}
          />
        </div>

        {/* Glass Container */}
        <div className="relative glass-container min-h-screen">
          {renderPage()}
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: 'linear-gradient(180deg, #F5F3FF 0%, #E8DFFF 100%)',
        }}
      />
      
      {/* Decorative blur circles */}
      <div
        className="fixed -z-10"
        style={{
          width: '2226px',
          height: '2226px',
          left: '-1113px',
          top: '-50%',
          background: 'rgba(229, 221, 255, 0.3)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        className="fixed -z-10"
        style={{
          width: '1668px',
          height: '1668px',
          left: '-30%',
          bottom: '-20%',
          background: 'rgba(255, 179, 186, 0.25)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        className="fixed -z-10"
        style={{
          width: '1278px',
          height: '1278px',
          right: '-15%',
          top: '20%',
          background: 'rgba(206, 195, 255, 0.2)',
          filter: 'blur(110px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        className="fixed -z-10"
        style={{
          width: '970px',
          height: '970px',
          left: '40%',
          bottom: '-10%',
          background: 'rgba(255, 213, 79, 0.15)',
          filter: 'blur(90px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glass Container */}
      <div className="relative glass-container min-h-screen">
        {/* Top Bar */}
        {currentPage !== "login" && currentPage !== "register" && (
          <TopBar 
            userName={userName}
            userRole={userRole}
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        )}

        {/* Main Content */}
        <main className="pb-20">
          {renderPage()}
        </main>

        {/* Bottom Navigation - Always visible when logged in */}
        <BottomNav
          items={getNavItems()}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        {/* AI Search Overlay */}
        {showAISearch && (
          <AISearch onClose={() => setShowAISearch(false)} />
        )}

        {/* Chat Box Overlay */}
        {showChatBox && (
          <ChatBox onClose={() => setShowChatBox(false)} />
        )}

        <Toaster />
      </div>
    </div>
  );
}