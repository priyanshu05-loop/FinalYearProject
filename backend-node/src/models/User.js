import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
    phone: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  user.first_name = user.firstName || '';
  user.last_name = user.lastName || '';
  user.profile_picture = user.profilePicture || '';
  user.total_interviews = user.totalInterviews ?? 0;
  user.average_score = user.averageScore ?? 0;

  delete user.firstName;
  delete user.lastName;
  delete user.profilePicture;
  delete user.totalInterviews;
  delete user.averageScore;

  return user;
};

export default mongoose.model('User', userSchema);
