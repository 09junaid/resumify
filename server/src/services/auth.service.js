import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken } from '../utils/jwt.js';

function issueToken(user) {
  return signAccessToken({ sub: user._id.toString(), email: user.email });
}

export const authService = {
  async register({ name, email, password }) {
    const exists = await User.exists({ email });
    if (exists) throw ApiError.conflict('Email already in use');

    const user = await User.create({ name, email, password });
    return { user, token: issueToken(user) };
  },

  async login({ email, password }) {
    // password is `select: false` on the schema — request it explicitly.
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw ApiError.unauthorized('Invalid credentials');

    const ok = await user.comparePassword(password);
    if (!ok) throw ApiError.unauthorized('Invalid credentials');

    return { user, token: issueToken(user) };
  },
};
