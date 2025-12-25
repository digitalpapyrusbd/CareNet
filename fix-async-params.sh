#!/bin/bash

# Script to automatically fix async params in Next.js 15+ route handlers
# This script updates route handlers to use async params (Promise-based)

echo "=========================================="
echo "Next.js 15+ Async Params Migration Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for files modified
FILES_MODIFIED=0

# Find all route.ts files in src/app/api
echo "🔍 Searching for route handlers in src/app/api..."
ROUTE_FILES=$(find src/app/api -name "route.ts" -type f)

if [ -z "$ROUTE_FILES" ]; then
    echo "${RED}❌ No route.ts files found in src/app/api${NC}"
    exit 1
fi

echo "Found $(echo "$ROUTE_FILES" | wc -l) route handler files"
echo ""

# Backup directory
BACKUP_DIR=".backups/async-params-migration-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Creating backups in: $BACKUP_DIR"
echo ""

# Process each file
for file in $ROUTE_FILES; do
    # Check if file contains params pattern that needs updating
    if grep -q "params: { " "$file" 2>/dev/null; then
        echo "📝 Processing: $file"

        # Create backup
        BACKUP_PATH="$BACKUP_DIR/${file#src/app/api/}"
        mkdir -p "$(dirname "$BACKUP_PATH")"
        cp "$file" "$BACKUP_PATH"

        # Create temporary file for modifications
        TEMP_FILE="${file}.tmp"

        # Perform the replacements
        # Pattern 1: Simple id param
        sed -E 's/\{ params \}: \{ params: \{ id: string \} \}/{ params }: { params: Promise<{ id: string }> }/g' "$file" > "$TEMP_FILE"

        # Pattern 2: Multiple params (id, slug, etc.)
        sed -i -E 's/\{ params \}: \{ params: \{ ([a-zA-Z]+): string; ([a-zA-Z]+): string \} \}/{ params }: { params: Promise<{ \1: string; \2: string }> }/g' "$TEMP_FILE"

        # Pattern 3: Single non-id param
        sed -i -E 's/\{ params \}: \{ params: \{ ([a-zA-Z]+): string \} \}/{ params }: { params: Promise<{ \1: string }> }/g' "$TEMP_FILE"

        # Pattern 4: Context with params
        sed -i -E 's/context: \{ params: \{ id: string \} \}/context: { params: Promise<{ id: string }> }/g' "$TEMP_FILE"

        # Pattern 5: Context with multiple params
        sed -i -E 's/context: \{ params: \{ ([a-zA-Z]+): string; ([a-zA-Z]+): string \} \}/context: { params: Promise<{ \1: string; \2: string }> }/g' "$TEMP_FILE"

        # Pattern 6: Context with single non-id param
        sed -i -E 's/context: \{ params: \{ ([a-zA-Z]+): string \} \}/context: { params: Promise<{ \1: string }> }/g' "$TEMP_FILE"

        # Now add await to params destructuring
        # Pattern: const { id } = params; -> const { id } = await params;
        sed -i -E 's/const \{ ([a-zA-Z, ]+) \} = params;/const { \1 } = await params;/g' "$TEMP_FILE"

        # Pattern: const id = params.id; -> const id = (await params).id;
        sed -i -E 's/const ([a-zA-Z]+) = params\.([a-zA-Z]+);/const \1 = (await params).\2;/g' "$TEMP_FILE"

        # Pattern: params.id -> (await params).id (when used directly)
        # This is more complex and might need manual review

        # Move temp file to original
        mv "$TEMP_FILE" "$file"

        FILES_MODIFIED=$((FILES_MODIFIED + 1))
        echo "${GREEN}✅ Updated${NC}"
        echo ""
    fi
done

echo ""
echo "=========================================="
echo "Migration Summary"
echo "=========================================="
echo "${GREEN}Files modified: $FILES_MODIFIED${NC}"
echo "Backups saved to: $BACKUP_DIR"
echo ""

if [ $FILES_MODIFIED -gt 0 ]; then
    echo "${YELLOW}⚠️  IMPORTANT NOTES:${NC}"
    echo "1. Review the changes carefully before committing"
    echo "2. Some complex patterns may need manual fixing"
    echo "3. Run 'npm run type-check' to verify all changes"
    echo "4. Test your API routes thoroughly"
    echo ""
    echo "Common patterns that may need manual review:"
    echo "  - Direct params property access (e.g., if (params.id))"
    echo "  - Params passed to other functions"
    echo "  - Conditional logic based on params"
    echo ""
    echo "To restore from backup:"
    echo "  cp -r $BACKUP_DIR/* src/app/api/"
    echo ""
    echo "${GREEN}Next steps:${NC}"
    echo "1. npm run type-check"
    echo "2. Review git diff"
    echo "3. npm run test"
    echo "4. npm run dev"
else
    echo "${YELLOW}No files needed modification${NC}"
fi

echo ""
echo "Done! 🎉"
