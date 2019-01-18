const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');



const getAllStories = async (ctx, next) => {
  try {
    const page = parseInt(ctx.request.query.page);
    const q = ctx.request.query.q;
    const searchTerm = {};
    const regexp = new RegExp(q , 'gi');
    let stories = [];
    if (q) {
      searchTerm.title = regexp;
      stories = await Story.getAllStories(searchTerm, page);
    } else {
      searchTerm.published = true;
      stories = await Story.getAllStories(searchTerm, page);
    }
    console.log(stories, 'stories');
    ctx.body = stories;
  } catch (e) {
    ctx.throw(400, 'No results found.');
  }
};

const findStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findStory(storyId);
  // const location = story.events.forEach(async (el) =>{
  // console.log('b', Location.find())
  // console.log( await Location.find({_id: el.location_id }));
  // console.log(el)});

  ctx.body = story;
};

const createStory = async (ctx, next) => {
  const storyData = {
    editor: ctx.user,
    title: ctx.request.body.title,
    tagLine: ctx.request.body.tagline,
    map: ctx.request.body.map,
    duration: ctx.request.body.duration,
    published: false,
    events: [],
  };
  if (storyData.title.length > 1) {
    const newStory = new Story(storyData);
    const createdStory = await Story.createStory(newStory);
    ctx.status = 201;
    ctx.body = createdStory;
  } else {
    ctx.throw(400,'Your story needs a valid title!');
  }
};

const editStory = async (ctx, next) => {
  const data = ctx.request.body;
  const storyId = ctx.params.id;
  const updatedProps = {};
  const story = await Story.findOne({_id: storyId, editor: ctx.user._id});

  if (!story) {
    ctx.throw(404);
  }

  if (data.published) {
    if (story.events.length < 1) {
      ctx.throw(400, 'A Story cannot be published without events!');
      return ctx.body;
    }
  }

  if (data.title) story.title = data.title;
  if (data.map) story.map = data.map;
  if (data.tagLine) story.tagLine = data.tagLine;
  if (data.duration) story.duration = data.duration;
  if (data.published !== undefined) story.published = data.published;

  ctx.body = await story.save();
};

const deleteStory = async (ctx, next) => {
  const storyId = ctx.params.id;
  const story = await Story.findOne({ _id: storyId, editor: ctx.user._id });
  if (!story) return ctx.throw(404);
  const deletedStory = await Story.deleteStory(storyId);
  ctx.body = deletedStory;
};

module.exports = {
  getAllStories,
  findStory,
  createStory,
  editStory,
  deleteStory,
};
