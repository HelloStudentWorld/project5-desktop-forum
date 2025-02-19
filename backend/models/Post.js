module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'Posts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments' });
    Post.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  };

  return Post;
};