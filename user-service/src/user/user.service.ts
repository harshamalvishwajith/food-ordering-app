import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<User> {
    // Hash the password if provided
    // if (userData.passwordHash) {
    //   const salt = await bcrypt.genSalt(10);
    //   userData.passwordHash = await bcrypt.hash(userData.passwordHash, salt);
    //   delete userData.passwordHash; // Remove raw password from the data
    // }

    const user = new this.userModel(userData);
    return user.save();
  }

  async getLogged(userData: Partial<User>): Promise<User> {
    console.log('get logged funtion is called userData', userData);
    const user = await this.userModel.findOne({
      email: userData.email,
      passwordHash: userData.passwordHash,
      userType: userData.role,
    });
    if (!user) throw new NotFoundException('User not found');
    // const isMatch = await bcrypt.compare(
    //   userData.passwordHash,
    //   user.passwordHash,
    // );
    // if (!isMatch) throw new NotFoundException('Invalid credentials');
    if (user) {
      console.log('user found', user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
      },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }
}
