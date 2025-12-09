/**
 * Route Definitions
 * Defines all routes with Bengali translations and keywords for navigation
 */

import { RouteDefinition, UserRole } from '@/types/ai-agent';

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
    // Dashboard routes
    {
        path: '/dashboard',
        name: 'Dashboard',
        nameBengali: 'ড্যাশবোর্ড',
        keywords: ['dashboard', 'ড্যাশবোর্ড', 'home', 'হোম', 'main', 'মূল'],
        description: 'Main dashboard',
        descriptionBengali: 'মূল ড্যাশবোর্ড',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },

    // Patient routes
    {
        path: '/patients',
        name: 'Patients',
        nameBengali: 'রোগী',
        keywords: ['patients', 'রোগী', 'রোগীরা', 'patient list', 'রোগীর তালিকা'],
        description: 'View and manage patients',
        descriptionBengali: 'রোগী দেখুন এবং পরিচালনা করুন',
        roles: ['GUARDIAN', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },
    {
        path: '/patients/new',
        name: 'Add Patient',
        nameBengali: 'রোগী যোগ করুন',
        keywords: ['add patient', 'নতুন রোগী', 'রোগী যোগ করুন', 'create patient', 'রোগী তৈরি করুন'],
        description: 'Add a new patient',
        descriptionBengali: 'নতুন রোগী যোগ করুন',
        roles: ['GUARDIAN', 'COMPANY']
    },

    // Job routes
    {
        path: '/jobs',
        name: 'Jobs',
        nameBengali: 'কাজ',
        keywords: ['jobs', 'কাজ', 'কাজের তালিকা', 'assignments', 'নিয়োগ'],
        description: 'View and manage jobs',
        descriptionBengali: 'কাজ দেখুন এবং পরিচালনা করুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR']
    },
    {
        path: '/jobs/new',
        name: 'Create Job',
        nameBengali: 'কাজ তৈরি করুন',
        keywords: ['create job', 'নতুন কাজ', 'কাজ তৈরি করুন', 'new job', 'add job'],
        description: 'Create a new job',
        descriptionBengali: 'নতুন কাজ তৈরি করুন',
        roles: ['GUARDIAN', 'COMPANY']
    },

    // Payment routes
    {
        path: '/payments',
        name: 'Payments',
        nameBengali: 'পেমেন্ট',
        keywords: ['payments', 'পেমেন্ট', 'লেনদেন', 'transactions', 'billing', 'বিল'],
        description: 'View payment history',
        descriptionBengali: 'পেমেন্ট ইতিহাস দেখুন',
        roles: ['GUARDIAN', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },
    {
        path: '/payments/create',
        name: 'Make Payment',
        nameBengali: 'পেমেন্ট করুন',
        keywords: ['make payment', 'পেমেন্ট করুন', 'pay', 'টাকা দিন', 'new payment'],
        description: 'Make a new payment',
        descriptionBengali: 'নতুন পেমেন্ট করুন',
        roles: ['GUARDIAN'],
        requiresConfirmation: true
    },

    // Care logs
    {
        path: '/care-logs',
        name: 'Care Logs',
        nameBengali: 'যত্ন লগ',
        keywords: ['care logs', 'যত্ন লগ', 'logs', 'লগ', 'records', 'রেকর্ড'],
        description: 'View care logs',
        descriptionBengali: 'যত্ন লগ দেখুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR']
    },
    {
        path: '/care-logs/new',
        name: 'Add Care Log',
        nameBengali: 'যত্ন লগ যোগ করুন',
        keywords: ['add care log', 'নতুন লগ', 'যত্ন লগ যোগ করুন', 'new log', 'create log'],
        description: 'Add a new care log',
        descriptionBengali: 'নতুন যত্ন লগ যোগ করুন',
        roles: ['CAREGIVER', 'GUARDIAN']
    },

    // Profile and settings
    {
        path: '/profile',
        name: 'Profile',
        nameBengali: 'প্রোফাইল',
        keywords: ['profile', 'প্রোফাইল', 'account', 'অ্যাকাউন্ট', 'settings', 'সেটিংস'],
        description: 'View and edit profile',
        descriptionBengali: 'প্রোফাইল দেখুন এবং সম্পাদনা করুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },

    // Notifications
    {
        path: '/notifications',
        name: 'Notifications',
        nameBengali: 'বিজ্ঞপ্তি',
        keywords: ['notifications', 'বিজ্ঞপ্তি', 'alerts', 'সতর্কতা', 'messages', 'বার্তা'],
        description: 'View notifications',
        descriptionBengali: 'বিজ্ঞপ্তি দেখুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },
    {
        path: '/notifications/settings',
        name: 'Notification Settings',
        nameBengali: 'বিজ্ঞপ্তি সেটিংস',
        keywords: ['notification settings', 'বিজ্ঞপ্তি সেটিংস', 'preferences', 'পছন্দ'],
        description: 'Manage notification preferences',
        descriptionBengali: 'বিজ্ঞপ্তি পছন্দ পরিচালনা করুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },

    // Packages
    {
        path: '/packages',
        name: 'Packages',
        nameBengali: 'প্যাকেজ',
        keywords: ['packages', 'প্যাকেজ', 'plans', 'পরিকল্পনা', 'services', 'সেবা'],
        description: 'Browse care packages',
        descriptionBengali: 'যত্ন প্যাকেজ ব্রাউজ করুন',
        roles: ['GUARDIAN', 'COMPANY']
    },

    // Files
    {
        path: '/files',
        name: 'Files',
        nameBengali: 'ফাইল',
        keywords: ['files', 'ফাইল', 'documents', 'নথি', 'uploads', 'আপলোড'],
        description: 'Manage files and documents',
        descriptionBengali: 'ফাইল এবং নথি পরিচালনা করুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR']
    },

    // Feedback
    {
        path: '/feedback',
        name: 'Feedback',
        nameBengali: 'মতামত',
        keywords: ['feedback', 'মতামত', 'reviews', 'পর্যালোচনা', 'ratings', 'রেটিং'],
        description: 'View and manage feedback',
        descriptionBengali: 'মতামত দেখুন এবং পরিচালনা করুন',
        roles: ['GUARDIAN', 'CAREGIVER', 'COMPANY', 'MODERATOR']
    },

    // Job assignment
    {
        path: '/job-assignment',
        name: 'Job Assignment',
        nameBengali: 'কাজ বরাদ্দ',
        keywords: ['job assignment', 'কাজ বরাদ্দ', 'assign', 'বরাদ্দ করুন', 'matching'],
        description: 'Assign jobs to caregivers',
        descriptionBengali: 'যত্নকারীদের কাজ বরাদ্দ করুন',
        roles: ['COMPANY', 'MODERATOR']
    },

    // Patient management
    {
        path: '/patient-management',
        name: 'Patient Management',
        nameBengali: 'রোগী ব্যবস্থাপনা',
        keywords: ['patient management', 'রোগী ব্যবস্থাপনা', 'manage patients', 'রোগী পরিচালনা'],
        description: 'Advanced patient management',
        descriptionBengali: 'উন্নত রোগী ব্যবস্থাপনা',
        roles: ['COMPANY', 'MODERATOR', 'SUPER_ADMIN']
    },

    // Verification
    {
        path: '/verification',
        name: 'Verification',
        nameBengali: 'যাচাইকরণ',
        keywords: ['verification', 'যাচাইকরণ', 'verify', 'যাচাই করুন', 'documents'],
        description: 'Document verification',
        descriptionBengali: 'নথি যাচাইকরণ',
        roles: ['CAREGIVER', 'COMPANY', 'MODERATOR']
    },

    // Escrow
    {
        path: '/escrow',
        name: 'Escrow',
        nameBengali: 'এসক্রো',
        keywords: ['escrow', 'এসক্রো', 'funds', 'তহবিল', 'balance', 'ব্যালেন্স'],
        description: 'Escrow account management',
        descriptionBengali: 'এসক্রো অ্যাকাউন্ট ব্যবস্থাপনা',
        roles: ['GUARDIAN', 'COMPANY', 'MODERATOR']
    }
];

/**
 * Find route by keyword (Bengali or English)
 */
export function findRouteByKeyword(keyword: string, userRole: UserRole): RouteDefinition | null {
    const normalizedKeyword = keyword.toLowerCase().trim();

    const route = ROUTE_DEFINITIONS.find(route => {
        // Check if user has permission
        if (!route.roles.includes(userRole)) {
            return false;
        }

        // Check if keyword matches
        return route.keywords.some(kw =>
            kw.toLowerCase().includes(normalizedKeyword) ||
            normalizedKeyword.includes(kw.toLowerCase())
        );
    });

    return route || null;
}

/**
 * Get all routes accessible by user role
 */
export function getRoutesByRole(userRole: UserRole): RouteDefinition[] {
    return ROUTE_DEFINITIONS.filter(route => route.roles.includes(userRole));
}

/**
 * Get route by exact path
 */
export function getRouteByPath(path: string): RouteDefinition | null {
    return ROUTE_DEFINITIONS.find(route => route.path === path) || null;
}
