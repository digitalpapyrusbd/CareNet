import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  async getHealth() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.controller.ts:30',message:'Health check started',data:{timestamp:new Date().toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'health-check',hypothesisId:'DB_CONNECTION'})}).catch(()=>{});
    // #endregion
    
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.controller.ts:35',message:'Testing database connection',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'health-check',hypothesisId:'DB_CONNECTION'})}).catch(()=>{});
      // #endregion
      
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.controller.ts:42',message:'Database connection successful',data:{status:dbStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'health-check',hypothesisId:'DB_CONNECTION'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      dbStatus = 'disconnected';
      dbError = error instanceof Error ? error.message : 'Unknown error';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.controller.ts:50',message:'Database connection failed',data:{status:dbStatus,error:dbError},timestamp:Date.now(),sessionId:'debug-session',runId:'health-check',hypothesisId:'DB_CONNECTION'})}).catch(()=>{});
      // #endregion
    }
    
    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'CareNet Backend API',
      version: '1.0.0',
      database: {
        status: dbStatus,
        error: dbError,
      },
    };
  }
}
