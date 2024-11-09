const mongoose = require("mongoose");

const linksSchema = new mongoose.Schema({
  shortURL: { type: String, required: true, unique: true, index: true },
  longURL: { type: String, required: true },
  createdAt: { type: Date },
  expireAt: { type: Date },
});

linksSchema.index({
  shortURL: "text",
});

const Link = mongoose.model("Links", linksSchema);

const connectDatabase = async () => {
  const connectionString = process.env.MONGO_DB;

  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    console.error(error);
  }
};

const insertIntoDatabase = async (
  shortURL,
  longURL,
  expireAfterSeconds = null
) => {
  connectDatabase();

  const [currentTime, expiryTime] = await calculateTime(expireAfterSeconds);

  try {
    let link = new Link({
      shortURL: shortURL,
      longURL: longURL,
      createdAt: currentTime,
      expireAt: expiryTime,
    });

    await link.save();

    createIndex();
  } catch (error) {
    console.log(error);
  }
};

const searchDatabase = async (query) => {
  try {
    connectDatabase();

    const result = await Link.findOne({ shortURL: query });

    return result ? result.longURL : null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

async function createIndex() {
  const exists = await Link.collection.indexExists("expireAt");

  if (!exists) {
    await Link.collection.createIndex(
      { expireAt: 1 },
      { expireAfterSeconds: 0 },
      { background: true }
    );
  }
}

async function calculateTime(expireAfterSeconds) {
  var expiryTime = null;

  const currentTime = new Date();

  if (expireAfterSeconds !== "null") {
    expireAfterSeconds = parseInt(expireAfterSeconds);

    expiryTime = new Date(currentTime.getTime() + expireAfterSeconds * 1000);
  }
  return [currentTime, expiryTime];
}

module.exports = { connectDatabase, insertIntoDatabase, searchDatabase };
