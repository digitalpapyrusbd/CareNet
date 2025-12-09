import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SubmitVerificationStepDto, ModeratorReviewDto, AdminReviewDto } from './dto/verification.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) { }

    @Post('submit')
    @Roles(UserRole.CAREGIVER, UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
    submitStep(
        @CurrentUser('id') userId: string,
        @Body() submitDto: SubmitVerificationStepDto,
    ) {
        return this.verificationService.submitStep(userId, submitDto);
    }

    @Get('pending')
    @Roles(UserRole.MODERATOR, UserRole.PLATFORM_ADMIN, UserRole.SUPER_ADMIN)
    getPending(@Query() query: any) {
        return this.verificationService.getPendingVerifications(query.page, query.limit);
    }

    @Patch('moderator-review/:id')
    @Roles(UserRole.MODERATOR)
    moderatorReview(
        @Param('id') stepId: string,
        @CurrentUser('id') moderatorId: string,
        @Body() reviewDto: ModeratorReviewDto,
    ) {
        return this.verificationService.moderatorReview(stepId, moderatorId, reviewDto);
    }

    @Get('moderator-reviewed')
    @Roles(UserRole.PLATFORM_ADMIN, UserRole.SUPER_ADMIN)
    getModeratorReviewed(@Query() query: any) {
        return this.verificationService.getModeratorReviewed(query.page, query.limit);
    }

    @Patch('admin-review/:id')
    @Roles(UserRole.PLATFORM_ADMIN, UserRole.SUPER_ADMIN)
    adminReview(
        @Param('id') stepId: string,
        @CurrentUser('id') adminId: string,
        @Body() reviewDto: AdminReviewDto,
    ) {
        return this.verificationService.adminReview(stepId, adminId, reviewDto);
    }

    @Get('status')
    getMyStatus(@CurrentUser('id') userId: string) {
        return this.verificationService.getUserVerificationStatus(userId);
    }
}
