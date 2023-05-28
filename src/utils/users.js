
const User = require('../models/user')

const deleteRoomForUser = async (id) => {
    try {
        const user = await User.findOne({ id: id });
        // await User.updateOne({ id: id }, { $set: { room: null } });
        console.log(user)
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

const joinRoomForUser = async (username, room, id) => {
    try {
        await User.updateOne({ username: username }, { $set: { room: room, id: id} });

    } catch (error) { 
        console.log(error)
    }
}
  
const getUsersInRoom = (room) => {
    return User.find({ room: room })
      .then((users) => {
        // console.log(users);    // array içinde öbject döndürür
        return users;
      })
      .catch((error) => {
        console.log(error);
      });
  };

module.exports = {
    deleteRoomForUser,
    getUsersInRoom,
    joinRoomForUser
}