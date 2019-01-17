const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;

const editorSchema = new Schema({
  name: String,
  email: String,
  token: String,
  picture: String,
});

const Editor = mongoose.model('Editor', editorSchema);

const myEditor={

    name: 'admin',
    email: 'admin',
    token: 'admin',
    picture: 'https://res.cloudinary.com/pinchepanchopincho/image/upload/v1547042159/userpics/nadal2.jpg'
}

Editor.createEditor = (editorData) => {
  const newEditor = new Editor ({
    name: editorData.name,
    email: editorData.email,
    token: editorData.token,
    picture: editorData.picture
  });
  console.log('ran');
  return newEditor.save();
};

Editor.searchEditors = (query) => {
  const editors = Editor.find({'name' : new RegExp(query, 'gi')});
  if (editors) {
    return editors;
  }
};



// Editor.createEditor(myEditor);


module.exports = Editor;
