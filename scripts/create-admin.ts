import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function createAdminUser() {
  try {
    const email = "saab.405nc@gmail.com";
    const password = "Indya@1234!";
    const name = "Admin User";

    console.log("Creating admin user...");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User ${email} already exists. Updating password and role...`);
      const passwordHash = await bcrypt.hash(password, 12);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          role: "admin",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      console.log("✅ Admin user updated:", updatedUser);
      return;
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "admin",
        authStatus: "active",
        accountStatus: "active",
        termsAcceptedVersion: "v1",
        privacyAcceptedVersion: "v1",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: Active`);
    console.log(`   Created: ${user.createdAt}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
