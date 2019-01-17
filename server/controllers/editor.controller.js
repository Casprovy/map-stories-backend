const mongoose = require('mongoose');
const Story = require('../model/story.model');
const Editor = require('../model/editor.model');

const signUpEditor = async (ctx, next) => {
  let token = ctx.headers.authorization;
  token = token.split(' ')[1];
  const editorData = {
    name: ctx.request.body.name,
    email: ctx.request.body.email,
    token: token,
    picture: ctx.request.body.picture,
  };
  const editorEmail = editorData.email;
  const editorExists = await Editor.findOne({email: editorEmail});
  if (editorExists !== null) {
    const updatedEditor = await Editor.findOneAndUpdate({email : editorEmail}, {$set: {token: editorData.token}}, {new: true});
    ctx.body = updatedEditor;
    ctx.status = 200;
  } else {
    const editor = await Editor.createEditor(editorData);
    ctx.body = editor;
    ctx.status = 200;
  }
};

const getEditorStories = async (ctx, next) => {
  const editorStories = await Story.find({editor: ctx.user._id}).populate('editor');
  ctx.body = editorStories;
};


// const createEditor = () => {
//   const editorData = {
//     name: 'admin',
//     email: 'admin',
//     token: 'admin',
//     picture: 'https://res.cloudinary.com/pinchepanchopincho/image/upload/v1547042159/userpics/nadal2.jpg'
//   };


// }

module.exports = {
  signUpEditor,
  getEditorStories,
};
