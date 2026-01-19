import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.MAIL_PASS, // App Password
      },
    });
  }

  async forgotPassword(email: string) {
    console.log(`[ForgotPassword] Request for email: ${email}`);
    const user = await this.userService.findOne({ email });
    if (!user) {
      console.log(`[ForgotPassword] User not found for email: ${email}`);
      // Don't reveal if user exists
      return {
        message:
          'If your email is registered, you will receive a password reset link.',
      };
    }
    console.log(`[ForgotPassword] User found: ${user.id}`);

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-ignore
        resetPasswordToken: resetToken,
        // @ts-ignore
        resetPasswordExpires: resetExpires,
      },
    });
    console.log(`[ForgotPassword] Token generated and saved`);

    await this.sendResetPasswordEmail(user.email, resetToken);

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        // @ts-ignore
        resetPasswordToken: token,
        // @ts-ignore
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // @ts-ignore
        resetPasswordToken: null,
        // @ts-ignore
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, role } = registerDto;

    const existingUser = await this.userService.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      name,
      phone,
      role: UserRole.CUSTOMER,
      // @ts-ignore - Prisma types might not update immediately in IDE
      verificationToken,
      isEmailVerified: false,
    });

    // Send verification email
    await this.sendVerificationEmail(user.email, verificationToken);

    // Exclude password from the returned user object
    const { password: _, ...result } = user;
    return result;
  }

  async checkEmail(email: string) {
    const user = await this.userService.findOne({ email });
    return { available: !user };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Optional: Check if email is verified
    // Optional: Check if email is verified (Only for Customers)
    if (user.role === UserRole.CUSTOMER && !user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null, // Clear token
      },
    });

    return { message: 'Email verified successfully' };
  }

  async validateGoogleUser(details: {
    email: string;
    name: string;
    avatar: string;
    googleId: string;
    accessToken: string;
  }) {
    // 1. Check by googleId
    // @ts-ignore
    let user = await this.userService.findOne({ googleId: details.googleId });

    if (user) return user;

    // 2. Check by email (link account)
    user = await this.userService.findOne({ email: details.email });
    if (user) {
      // Link account
      return this.prisma.user.update({
        where: { id: user.id },
        data: {
          // @ts-ignore
          googleId: details.googleId,
          avatar: user.avatar || details.avatar,
          isEmailVerified: true, // Google verifies email
        },
      });
    }

    // 3. Create new user
    const password = await bcrypt.hash(uuidv4(), 10); // Random password
    return this.userService.createUser({
      email: details.email,
      name: details.name,
      password,
      role: UserRole.CUSTOMER,
      avatar: details.avatar,
      // @ts-ignore
      googleId: details.googleId,
      isEmailVerified: true,
    });
  }

  async googleLogin(user: any) {
    if (!user) throw new BadRequestException('No user from google');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: '"Smart Restaurant" <no-reply@smartrestaurant.com>',
        to: email,
        subject: 'Verify your email',
        html: `
                <h1>Welcome to Smart Restaurant!</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${url}">${url}</a>
            `,
      });
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      // Do not block registration if email fails (for now), just log it
    }
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    console.log(`[SendResetEmail] Preparing email to: ${email}`);
    console.log(`[SendResetEmail] URL: ${url}`);
    // Check transporter credentials specifically
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error('[SendResetEmail] MAIL_USER or MAIL_PASS not set in env');
    }

    try {
      await this.transporter.sendMail({
        from: '"Smart Restaurant" <no-reply@smartrestaurant.com>',
        to: email,
        subject: 'Reset your password',
        html: `
                <h1>Reset Password Request</h1>
                <p>You requested to reset your password. Click the link below to verify:</p>
                <a href="${url}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `,
      });
      console.log(`[SendResetEmail] Reset password email sent to ${email}`);
    } catch (error) {
      console.error('[SendResetEmail] Error sending reset email:', error);
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // If email is changed -> check unique
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already registered');
      }
    }

    // If email changed -> set isEmailVerified = false, create new verificationToken (optional)
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!current) throw new UnauthorizedException();

    const emailChanged = dto.email && dto.email !== current.email;

    const data: any = {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
    };

    if (emailChanged) {
      const verificationToken = uuidv4();
      data.isEmailVerified = false;
      data.verificationToken = verificationToken;

      // Try sending verification email (won't block if env missing)
      try {
        await this.sendVerificationEmail(dto.email!, verificationToken);
      } catch (e) {
        // ignore
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...result } = updated as any;
    return result;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(dto.currentPassword, user.password);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const result = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type or upload failed');
    });

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: result.secure_url },
    });

    const { password, ...resultUser } = updated as any;
    return resultUser;
  }
}
