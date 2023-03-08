const { User, Thought } = require('../models');

module.exports = {
  //gets all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  //gets a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //creates a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
    //deletes a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
    },
    //updates a user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
      .catch((err) => res.status(500).json(err));
  },
  //adds a friend
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true,
      runValidators: true })
      .then((user) =>
      !user
        ? res.status(404).json({message: 'No user with that ID'})
        : res.json(user)
    )
      .catch((err) => res.status(500).json(err));
  },
  //deletes a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true })
      .then((user) =>
      !user
        ? res.status(404).json({ message: "No User find with this ID!" })
        : res.json(user)
    )
      .catch((err) => res.status(500).json(err));
  },
};