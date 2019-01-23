const Router = require('koa-router');

const storiesController = require('./controllers/stories.controller');
const editorController = require('./controllers/editor.controller');
// const eventsController = require('./controllers/events.controller');
const router = new Router();

const Editor = require('./model/editor.model');

// for injection based controller

const mongoose = require('mongoose');
const Story = require('./model/story.model');
const Event = require('./model/event.model').Event;
const Attachment = require('./model/event.model').Attachment;
const Location = require('./model/event.model').Location;

require('dotenv').config({ path: process.cwd() + '/enviroment/.env' })
require('./db')('mapstory-backend');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, region: 'eu-west-3'});
const EventController = require('./controllers/events.controllerAsClass');
const eventsController = new EventController(Story, Event, Attachment, Location, s3);


// end of injection attempt

const authMiddleware = async (ctx, next) => {
  console.log('INCOMING',ctx.headers.authorization)
  let token = ctx.headers.authorization;
  if (token) token = token.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    return;
  }
  ctx.user = await Editor.findOne({ token });
  console.log(ctx.user);
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  await next();
};

//user actions
router.get('/stories', storiesController.getAllStories);
router.get('/stories/:id', storiesController.findStory);

//editor actions
router.post('/sign-up', editorController.signUpEditor);
router.get('/me/stories', authMiddleware, editorController.getEditorStories);
router.post('/stories', authMiddleware, storiesController.createStory);
router.put('/stories/:id', authMiddleware, storiesController.editStory);
router.delete('/stories/:id', authMiddleware, storiesController.deleteStory);

//event actions
router.get('/geturl', authMiddleware, eventsController.getAWSUrl)
router.post('/stories/:id/event', authMiddleware, eventsController.addEvent);
router.put('/stories/:id/event/:eventId', authMiddleware, eventsController.editEvent);
router.delete('/stories/:id/event/:eventId', authMiddleware, eventsController.deleteEvent);

module.exports = router;
