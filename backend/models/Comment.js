module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'Comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return Comment;
};