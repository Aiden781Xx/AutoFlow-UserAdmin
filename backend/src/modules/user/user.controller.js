import User from '../../models/User.model.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password -refreshToken -resetToken -resetTokenExpiry'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    
    if (!name || !avatar) {
      return res.status(400).json({
        success: false,
        message: 'Name and avatar are required',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetToken -resetTokenExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};
