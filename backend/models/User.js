const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  // Compare password with stored hash
  User.prototype.validPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  // Hash password before creating user
  User.beforeCreate(async (user) => {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  User.associate = function (models) {
    User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
    User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
  };

  return User;
};