const Router = require('koa-router');

const storiesController = require('./controllers/stories.controller');
const editorController = require('./controllers/editor.controller');
const eventsController = require('./controllers/events.controller');
const router = new Router();

const Editor = require('./model/editor.model');

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
