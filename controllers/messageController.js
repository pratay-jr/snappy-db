const Messages = require("../models/messageModel");
// this is api that adds message to the db and will integrate this in chat container
module.exports.addMessage = async (req, res, next) => {
  // here we add the message to the database
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    // if data is added to db 
    if (data) return res.json({ msg: "Message added successfully." });
    // else 
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
// this is api that fetch all messages from the db and will integrate this in chat container
module.exports.getMessages = async (req, res, next) => {
  try {
    // destructuring data from the req.bosy
    const { from, to } = req.body;
    // a query that searches for the messages in this collection "messageModel",and sort in ascending order according to date/timestamp
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

