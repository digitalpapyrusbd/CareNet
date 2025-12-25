import { NextRequest, NextResponse } from "next/server";
import { authenticate, getCurrentUser } from "@/lib/middleware/auth";
import { UserRole } from "@prisma/client";
import { TextScrubber } from "@/utils/textScrubber";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get authenticated user and verify SUPER_ADMIN role
    const user = getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Insufficient permissions: SUPER_ADMIN role required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      action,
      selectedIds,
      createBackup,
      replacements: replacementData,
    } = body;

    // Resolve project root - ensure we're working with the actual source directory
    // In Next.js, process.cwd() might point to .next or build directory
    // We need to find the actual project root where src/ exists
    let projectRoot = process.cwd();

    // Try to find project root by looking for src/ directory
    let currentDir = process.cwd();
    let found = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!found && attempts < maxAttempts) {
      const srcPath = require("path").join(currentDir, "src");
      if (require("fs").existsSync(srcPath)) {
        found = true;
        projectRoot = currentDir;
      } else {
        const parent = require("path").dirname(currentDir);
        if (parent === currentDir) break; // Reached filesystem root
        currentDir = parent;
        attempts++;
      }
    }

    // #region agent log
    const fs = require("fs");
    const path = require("path");
    const logPath = path.join(process.cwd(), ".cursor", "debug.log");
    const logRoute = {
      location: "api/admin/translations/scrub/route.ts:50",
      message: "Scrub route called",
      data: {
        action,
        projectRoot,
        hasSelectedIds: !!selectedIds,
        selectedIdsCount: selectedIds?.length,
        hasReplacementData: !!replacementData,
        replacementDataCount: replacementData?.length,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "N",
    };
    try {
      fs.appendFileSync(logPath, JSON.stringify(logRoute) + "\n", "utf-8");
    } catch {
      // eslint-disable-line no-empty
      // Intentionally silent - debug logging should not interrupt normal flow
    }
    // #endregion

    const scrubber = new TextScrubber(projectRoot);

    if (action === "scan") {
      // Scan mode - dry run
      const result = await scrubber.scanComponents();
      // #region agent log
      const logScan = {
        location: "api/admin/translations/scrub/route.ts:58",
        message: "Scan completed",
        data: {
          totalFound: result.totalFound,
          componentsAffected: result.componentsAffected,
          replacementsCount: result.replacements?.length,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "O",
      };
      try {
        fs.appendFileSync(logPath, JSON.stringify(logScan) + "\n", "utf-8");
      } catch {
        // eslint-disable-line no-empty
        // Intentionally silent - debug logging should not interrupt normal flow
      }
      // #endregion
      return NextResponse.json(result);
    } else if (action === "apply") {
      // Apply replacements
      if (!selectedIds || !Array.isArray(selectedIds)) {
        return NextResponse.json(
          { error: "selectedIds array is required" },
          { status: 400 },
        );
      }

      // If replacement data is provided, restore it to the scrubber instance
      // This is necessary because each API call creates a new scrubber instance
      if (
        replacementData &&
        Array.isArray(replacementData) &&
        replacementData.length > 0
      ) {
        // #region agent log
        const logRestore = {
          location: "api/admin/translations/scrub/route.ts:68",
          message: "Restoring replacement data",
          data: {
            replacementDataCount: replacementData.length,
            firstReplacement: replacementData[0]
              ? {
                  id: replacementData[0].id,
                  filePath: replacementData[0].filePath,
                  line: replacementData[0].line,
                  originalText: replacementData[0].originalText?.substring(
                    0,
                    50,
                  ),
                }
              : null,
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "Z",
        };
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify(logRestore) + "\n",
            "utf-8",
          );
        } catch (e) {
          /* log error silently */
        }
        // #endregion
        (scrubber as any).replacements = replacementData;
      } else {
        // #region agent log
        const logNoData = {
          location: "api/admin/translations/scrub/route.ts:73",
          message: "No replacement data, scanning first",
          data: {},
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "AA",
        };
        try {
          fs.appendFileSync(logPath, JSON.stringify(logNoData) + "\n", "utf-8");
        } catch (e) {
          /* log error silently */
        }
        // #endregion
        // If no replacement data, we need to scan first to get the replacements
        // This is less efficient but ensures we have the data
        await scrubber.scanComponents();
      }

      // #region agent log
      const logBeforeApply = {
        location: "api/admin/translations/scrub/route.ts:75",
        message: "Before apply",
        data: {
          selectedIdsCount: selectedIds.length,
          replacementsInScrubber: (scrubber as any).replacements?.length,
          createBackup,
          selectedIds: selectedIds.slice(0, 3),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "P",
      };
      try {
        fs.appendFileSync(
          logPath,
          JSON.stringify(logBeforeApply) + "\n",
          "utf-8",
        );
      } catch (e) {
        /* log error silently */
      }
      // #endregion

      const result = await scrubber.applyReplacements(
        selectedIds,
        createBackup !== false,
      );

      // #region agent log
      const logApplyComplete = {
        location: "api/admin/translations/scrub/route.ts:82",
        message: "Apply completed",
        data: {
          success: result.success,
          backupPath: result.backupPath,
          errorsCount: result.errors?.length,
          errors: result.errors?.slice(0, 3),
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "Q",
      };
      try {
        fs.appendFileSync(
          logPath,
          JSON.stringify(logApplyComplete) + "\n",
          "utf-8",
        );
      } catch (e) {
        /* log error silently */
      }
      // #endregion

      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "scan" or "apply"' },
        { status: 400 },
      );
    }
  } catch (error: any) {
    // #region agent log
    const fs = require("fs");
    const path = require("path");
    const logPath = path.join(process.cwd(), ".cursor", "debug.log");
    const logError = {
      location: "api/admin/translations/scrub/route.ts:106",
      message: "Error in scrub route",
      data: {
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: error?.stack?.substring(0, 300),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "AB",
    };
    try {
      fs.appendFileSync(logPath, JSON.stringify(logError) + "\n", "utf-8");
    } catch (e) {
      /* log error silently */
    }
    // #endregion
    console.error("Error in text scrubber:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 },
    );
  }
}
