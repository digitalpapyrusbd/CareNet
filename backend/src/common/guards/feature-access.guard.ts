import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Let JwtAuthGuard handle authentication
    }

    // Check if user has active lockout
    const activeLockout = await this.prisma.account_lockouts.findFirst({
      where: {
        user_id: user.id,
        is_active: true,
      },
    });

    if (!activeLockout) {
      return true; // No lockout, allow access
    }

    // Get the feature being accessed from the route
    const route = request.route.path;
    const method = request.method;
    const featureCode = this.getFeatureCode(route, method);

    // Check if this feature is locked
    const lockedFeatures = activeLockout.locked_features as string[];

    if (lockedFeatures.includes(featureCode)) {
      throw new ForbiddenException(
        `Account locked due to ${activeLockout.reason}. This feature is currently unavailable.`,
      );
    }

    return true;
  }

  private getFeatureCode(route: string, method: string): string {
    // Map routes to feature codes
    // This is a simplified version - you may want to use a more sophisticated mapping
    const featureMap: Record<string, string> = {
      'POST /packages': 'CREATE_PACKAGE',
      'POST /jobs': 'CREATE_JOB',
      'POST /negotiations': 'NEGOTIATE_PACKAGE',
      'GET /caregivers': 'BROWSE_CAREGIVERS',
      'POST /shops/products': 'CREATE_PRODUCT',
      // Add more mappings as needed
    };

    const key = `${method} ${route}`;
    return featureMap[key] || 'GENERAL_ACCESS';
  }
}
