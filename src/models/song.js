const song = (sequelize, DataTypes) => {
  const Song = sequelize.define('song', {
    url: {
      type: DataTypes.STRING,
      validate: { 
        notEmpty: {
          args: true,
          msg: 'You need to upload your song!'
        } 
      },
    },
  });

  Song.associate = models => {
    Song.belongsTo(models.User);
  };

  return Song;
};

export default song;