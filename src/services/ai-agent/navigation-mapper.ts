/**
 * Navigation Mapper
 * Maps natural language to application routes
 */

import { findRouteByKeyword, getRoutesByRole, ROUTE_DEFINITIONS } from './route-definitions';
import { isRouteAllowed, requiresConfirmation } from './config';
import {
    NavigationAction,
    IntentResult,
    UserRole,
    Language
} from '@/types/ai-agent';

/**
 * Map intent to navigation action
 */
export function mapToNavigationAction(
    intent: IntentResult,
    userRole: UserRole
): NavigationAction | null {
    const { entities } = intent;

    // Extract target from entities
    const target = entities.target || entities.route || entities.page;

    if (!target) {
        return null;
    }

    // Find route by keyword
    const route = findRouteByKeyword(target, userRole);

    if (!route) {
        return null;
    }

    // Check if route is allowed
    if (!isRouteAllowed(route.path)) {
        return null;
    }

    // Check if confirmation is required
    const needsConfirmation = requiresConfirmation(route.path);

    return {
        type: 'navigate',
        route: route.path,
        routeName: route.name,
        routeNameBengali: route.nameBengali,
        requiresConfirmation: needsConfirmation
    };
}

/**
 * Get navigation suggestions based on partial input
 */
export function getNavigationSuggestions(
    partialInput: string,
    userRole: UserRole,
    language: Language,
    limit: number = 3
): Array<{ name: string; path: string; description: string }> {
    const input = partialInput.toLowerCase().trim();

    // Get routes accessible by user
    const accessibleRoutes = getRoutesByRole(userRole);

    // Score routes based on keyword match
    const scored = accessibleRoutes.map(route => {
        let score = 0;

        // Check if any keyword matches
        for (const keyword of route.keywords) {
            const kw = keyword.toLowerCase();

            // Exact match
            if (kw === input) {
                score += 100;
            }
            // Starts with
            else if (kw.startsWith(input)) {
                score += 50;
            }
            // Contains
            else if (kw.includes(input)) {
                score += 25;
            }
            // Input contains keyword
            else if (input.includes(kw)) {
                score += 10;
            }
        }

        return { route, score };
    });

    // Filter and sort by score
    const suggestions = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => ({
            name: language === 'bn' ? item.route.nameBengali : item.route.name,
            path: item.route.path,
            description: language === 'bn' ? item.route.descriptionBengali : item.route.description
        }));

    return suggestions;
}

/**
 * Validate if user can navigate to route
 */
export function canNavigateToRoute(
    routePath: string,
    userRole: UserRole
): { allowed: boolean; reason?: string } {
    // Check if route is whitelisted
    if (!isRouteAllowed(routePath)) {
        return {
            allowed: false,
            reason: 'This route is not accessible through voice navigation.'
        };
    }

    // Find route definition
    const route = ROUTE_DEFINITIONS.find(r => r.path === routePath);

    if (!route) {
        return {
            allowed: false,
            reason: 'Route not found.'
        };
    }

    // Check role permission
    if (!route.roles.includes(userRole)) {
        return {
            allowed: false,
            reason: 'You do not have permission to access this page.'
        };
    }

    return { allowed: true };
}

/**
 * Get all available routes for user
 */
export function getAvailableRoutes(userRole: UserRole, language: Language) {
    return getRoutesByRole(userRole).map(route => ({
        path: route.path,
        name: language === 'bn' ? route.nameBengali : route.name,
        description: language === 'bn' ? route.descriptionBengali : route.description,
        requiresConfirmation: route.requiresConfirmation || false
    }));
}
