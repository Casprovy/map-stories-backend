const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;



const attachmentsSchema = new Schema({
  text: String,
  link: String,
  imageLink: String,
  video: String,
  audio: String,
});

const storySchema = new Schema({
  editor: { type: Schema.Types.ObjectId, ref: 'Editor' },
  title: String,
  map: String,
  tagLine: String,
  duration: String,
  published: Boolean,
  events:[{ type: Schema.Types.ObjectId, ref: 'Event' }],
});

const Story = mongoose.model('Story', storySchema);


Story.getAllStories = (searchTerm, page) => {
  return Story
      .find()
      .skip((page-1)*10)
      .limit(10)
      .populate({path: 'editor', select: 'name avatar'})
      .select('editor title tagLine published likes'); //id is returned by default
};


Story.findStory = (storyId) => {

  return Story.findOne({_id : storyId})
              .populate({path: 'editor', select: 'name avatar'})
              .populate('events');
};

Story.createStory = (newStory) => {
  return newStory.save();
};
//

Story.editStory = (storyId, updatedProps) => {
  return Story
    .findOneAndUpdate({_id : storyId}, {$set: updatedProps});
};

Story.deleteStory = (storyId) => {
  return Story.findByIdAndRemove(storyId);
};

// Story.createStory(mockStory);
// mockStories.forEach(el => {
//   try {
//     Story.createStory(el)
//   }
//   catch(err) {console.log(err)}
// })

module.exports = Story;


