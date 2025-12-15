import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { fileStorage } from '@/lib/file-storage';

export async function POST(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const documentType = formData.get('documentType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    let uploadResult;
    
    // Handle different upload types
    if (documentType) {
      uploadResult = await fileStorage.uploadDocument(file, user.id, documentType);
    } else if (folder === 'profile-pictures') {
      uploadResult = await fileStorage.uploadProfilePicture(file, user.id);
    } else if (folder === 'care-logs') {
      const careLogId = formData.get('careLogId') as string;
      if (!careLogId) {
        return NextResponse.json(
          { error: 'Care log ID is required for care log photos' },
          { status: 400 }
        );
      }
      uploadResult = await fileStorage.uploadCareLogPhoto(file, careLogId);
    } else {
      uploadResult = await fileStorage.uploadFile(file, file.name, {
        folder,
        isPublic,
        metadata: {
          userId: user.id,
          originalName: file.name,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadResult,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This endpoint can be used to get file info or generate presigned URLs
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json(
      { error: 'File key is required' },
      { status: 400 }
    );
  }

  try {
    const url = await fileStorage.getFileUrl(key);
    
    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    console.error('Get file URL error:', error);
    return NextResponse.json(
      { error: 'Failed to get file URL' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would verify that the user has permission to delete this file
    await fileStorage.deleteFile(key);
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}