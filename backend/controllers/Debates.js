const debatesModel = require("../models/debatesModel");
const likesModel = require("../models/likesModel");



const MyDebates = async (req, res) => {
  const createdBy = req.user.email.split("@")[0];
  const { page } = req.query;
  const skip = (page - 1) * 10;
  try {
    const totalRecords = await debatesModel.countDocuments({ createdBy });
    let debates = await debatesModel
      .find({ createdBy })
      .skip(skip)
      .limit(10)
      .sort({ createdOn: -1 });
    debates = debates.map((debate) => {
      debate.options = debate.options.filter((option) => !option.isRemoved);
      return debate;
      
    });

    res.status(200).json({ totalRecords, debates });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error! Please try again later" });
  }
};


const CreateDebate = async (req, res) => {
  const { question, options } = req.body;
  const createdBy = req.user.email.split("@")[0];
  console.log(createdBy);

  try {
    const debateData = new debatesModel({
      question,
      options: options.map((data, i) => ({ answer: data })),
      createdOn: new Date(),
      createdBy,
    });
    await debateData.save();
    res.status(200).json({ message: "Success ! Debate created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error ! Try after sometime" });
  }
};

const LikeDebate = async (req, res) => {
  const { debateId } = req.query;
  const { userId } = req.user;
  try {
    const liked = await likesModel.findOne({ debateId, userId });
    if (!liked) {
      await likesModel.create({ userId, debateId });
      await debatesModel.findByIdAndUpdate(debateId, {
        $inc: { totalLikes: 1 },
      });
      return res.json({ message: "liked" });
    }
    await likesModel.deleteOne(liked);
    await debatesModel.findByIdAndUpdate(debateId, {
      $inc: { totalLikes: -1 },
    });
    res.status(200).json({ message: "disliked" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "server error" });
  }
};



module.exports = {
  CreateDebate,
  MyDebates,
  LikeDebate,
};
