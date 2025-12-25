import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function disableMFA() {
  const phoneNumber = '+8801712345102';

  try {
    console.log(`🔍 Looking for user with phone: ${phoneNumber}...`);

    // Find user by phone
    const user = await prisma.users.findUnique({
      where: {
        phone: phoneNumber,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        mfa_enabled: true,
        role: true,
      },
    });

    if (!user) {
      console.error(`❌ User with phone ${phoneNumber} not found!`);
      process.exit(1);
    }

    console.log(`✅ Found user:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email || 'N/A'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Current MFA Status: ${user.mfa_enabled ? 'ENABLED' : 'DISABLED'}`);

    if (!user.mfa_enabled) {
      console.log(`\n⚠️  MFA is already disabled for this user.`);
      process.exit(0);
    }

    // Update MFA status
    console.log(`\n🔄 Disabling MFA...`);
    const updatedUser = await prisma.users.update({
      where: {
        phone: phoneNumber,
      },
      data: {
        mfa_enabled: false,
        mfa_secret: null, // Also clear the MFA secret
      },
      select: {
        phone: true,
        name: true,
        mfa_enabled: true,
      },
    });

    console.log(`\n✅ MFA successfully disabled!`);
    console.log(`   User: ${updatedUser.name} (${updatedUser.phone})`);
    console.log(`   MFA Status: ${updatedUser.mfa_enabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`\n🎉 You can now login without OTP.`);
  } catch (error) {
    console.error('❌ Error disabling MFA:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
disableMFA();
