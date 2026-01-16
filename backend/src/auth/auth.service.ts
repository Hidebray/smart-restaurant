import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.MAIL_PASS, // App Password
      },
    });
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

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      }
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null, // Clear token
      }
    });

    return { message: 'Email verified successfully' };
  }

  async validateGoogleUser(details: { email: string, name: string, avatar: string, googleId: string, accessToken: string }) {
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
        }
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
        isEmailVerified: user.isEmailVerified
      }
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
}
