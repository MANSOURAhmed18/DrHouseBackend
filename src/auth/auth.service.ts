import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signupdto.dto';
import { User, UserRole } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from '../schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { randomInt } from 'crypto'; // Import randomInt to generate the code
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PaginatedResponse } from 'src/interfaces/paginated-response.interface';
import { UserResponse } from 'src/interfaces/user-response.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';




@Injectable()
export class AuthService {
    
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    

         @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
         @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
        private jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async sigupasAdmin(signupData: SignupDto): Promise<User> {
        const { email, name, password } = signupData;
        const AdminExists = await this.userModel.findOne({ email });
        if (AdminExists) {
            throw new BadRequestException('Super Admin already exists');
        }

        
        const emailInUse = await this.userModel.findOne({ email });

        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the super admin user
        const Admin = await this.userModel.create({
            email,
            name,
            password: hashedPassword,
            role: UserRole.ADMIN,
            createdAt: new Date()
        });

        return Admin;
    }


    async signUp(signupData: SignupDto) {
        const { email, name, password } = signupData;
        const emailInUse = await this.userModel.findOne({ email });

        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Await the hashing process
        await this.userModel.create({
            email,
            name,
            password: hashedPassword,
            createdAt: new Date()
        });
        await this.mailService.sendWelcomeEmail(email, name, false);

    }
    async findUserById(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async login(credentials: LoginDto) {
        const { email, password } = credentials;
        // Find if user exists by email
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new UnauthorizedException('Wrong credentials');
        }
        if (!user.isActive) {
            throw new ForbiddenException('Account is deactivated');
        }
      
        // Compare entered password with existing password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedException('Wrong credentials');
        }
      
        // Check if it's the user's first login
        const isFirstLogin = user.isFirstLogin;
      
        // If it's the first login, update the flag
        if (isFirstLogin) {
          user.isFirstLogin = false;
          await user.save();
        }
      
        // Generate JWT tokens
        const tokens = await this.generateUserToken(user._id);
        return {
          ...tokens,
          userId: user._id,
          isFirstLogin,
        };
      }

    async refreshTokens(refreshToken: string) {
        const token = await this.refreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gt: new Date() }

        });
        if (!token) {
            //they have to login again in the front 

            throw new UnauthorizedException('Invalid refresh token');
        }
        //if it havent exiperd
        return this.generateUserToken(token.userId);

    }


    //return acces token and refresh token 
    async generateUserToken(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const accestoken = this.jwtService.sign({ userId,role: user.role }, { expiresIn: '2h'  });

        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken, userId);
        return {
            accestoken
            , refreshToken
        };
    }
    async storeRefreshToken(token: string, userId: string) {
        // Calculate expiry date 7 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await this.refreshTokenModel.updateOne(
            { userId },
            { $set: { expiryDate, token } },
            {
                upsert: true,
            },
        );
    }

    async changePassword(userId, oldPassword: string, newPassword: string): Promise<void> {
        // Ensure userId is a string
      
    
        // Find the user
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        /// Compare the old password with the stored password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedException('Wrong credentials');
        }
    
        // Hash the new password and update the user record
        const newHashedPassword = await bcrypt.hash(newPassword, '10');
        user.password = newHashedPassword;
        await user.save();
      }

      async forgotPassword(email: string): Promise<void> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Generate a 4-digit reset code
        const resetCode = randomInt(1000, 9999).toString();

        // Save the reset code to the database
        await this.resetTokenModel.create({
            userId: user._id,
            token: resetCode,
            expiryDate: new Date(Date.now() + 3600000), // 1 hour expiry
        });

        // Send the reset code via email
        await this.mailService.sendResetEmail(user.email, resetCode);
    }
    
    
      async verifyReset(resetToken: string, newPassword: string): Promise<void> {
        const tokenEntry = await this.resetTokenModel.findOne({ token: resetToken });
        if (!tokenEntry || tokenEntry.expiryDate < new Date()) {
          throw new UnauthorizedException('Invalid or expired reset token');
        }
    
        // Find the user associated with the reset token
        const user = await this.userModel.findById(tokenEntry.userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        // Hash the new password and update the user record
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();
    
        // Remove the used reset token
        await this.resetTokenModel.deleteOne({ token: resetToken });
      }
      async verifyResetCode(email: string, code: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const tokenEntry = await this.resetTokenModel.findOne({ userId: user._id, token: code });
        if (!tokenEntry || tokenEntry.expiryDate < new Date()) {
            return false;
        }

        return true;
    }
    async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
      const isValid = await this.verifyResetCode(email, code);
      if (!isValid) {
          throw new UnauthorizedException('Invalid or expired reset code');
      }

      const user = await this.userModel.findOne({ email });
      if (!user) {
          throw new NotFoundException('User not found');
      }

      // Hash the new password and update the user record
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      // Remove the used reset code
      await this.resetTokenModel.deleteOne({ userId: user._id, token: code });
  }

  async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // Prevent changing super_admin role
    if (user.role === UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot modify super admin role');
    }

    // Update the user's role
    user.role = newRole;
    return await user.save();
}
async updateAccountStatus(userId: string, isActive: boolean, adminRole: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // Prevent deactivating super_admin accounts if the requester is not a super_admin
    if (user.role === UserRole.SUPER_ADMIN && adminRole !== UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Cannot modify super admin account status');
    }

    user.isActive = isActive;
    await user.save();

    return user;
}



async getAllUsers(query: GetUsersQueryDto): Promise<UserResponse[]> {
    try {
        const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = query;

        // Build filter conditions
        const filter: any = {};

        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Add role filter
        if (role) {
            filter.role = role;
        }

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const users = await this.userModel
            .find(filter)
            .select('_id name email role isActive createdAt')
            .sort(sort)
            .exec();

        // Return users
        return users.map(user => ({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        }));
    } catch (error) {
        throw new BadRequestException('Failed to fetch users: ' + error.message);
    }
}

// Add this method to your AuthService class
async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // Check if new email is already taken by another user
    

    // Update user
    const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
            name: updateProfileDto.name,
        },
        { new: true }
    ).select('-password -refreshToken'); // Exclude sensitive fields

    return {
        name: updatedUser.name,
        email: updatedUser.email
    };
}



}