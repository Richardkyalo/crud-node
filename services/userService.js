import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import z from 'zod';

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUser = async (userData) => {
  const validation = userSchema.safeParse(userData);
  if (!validation.success) throw validation.error;

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
};

export const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');

  const updatedUser = await user.update(updateData);
  return updatedUser;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');

  await user.destroy();
};
