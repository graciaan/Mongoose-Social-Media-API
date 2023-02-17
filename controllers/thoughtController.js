const { Thought, User } = require("../models");

module.exports = {
  //gets all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //gets a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  //creates new thought and pushes to user's thought array
  createThought(req, res) {
    Thought.create(req.body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: _id }},
        { new: true }
      )
    })
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No user with that ID' })
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },
  //updates thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No thought with that ID'})
    : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
  //deletes a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'Thought deleted but no user found with that ID'})
        : res.json({ message: 'Thought successfully deleted' })
    )
    .catch((err) => res.status(500).json(err));
},
//creates reaction
createReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body }},
    { runValidators: true,
      new: true}
  )
  .then((thought) =>
  !thought
  ? res.status(404).json({ message: 'No thought found with that ID'})
  : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},
//delete reaction
deleteReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: {reactionId: req.params.reactionId}}},
    { runValidators: true,
      new: true },
  )
  .then((thought) => 
  !thought
  ? res.status(404).json({ message: 'No thought found with that ID'})
  : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},
}