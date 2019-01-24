class EventsController {
  constructor(Story, Event, Attachment, Location, s3) {

    this.Story = Story;
    this.Event = Event;
    this.Attachment = Attachment;
    this.Location = Location;
    this.s3 = s3;
    this.getAWSUrl = this.getAWSUrl.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);

  }

  async getAWSUrl (ctx, next) {

      const myBucket = process.env.BucketName;
      let expire = 3600;
      const myKey = 'uploads/';


      // const params = { Bucket: myBucket, Key: myKey, Expires: expire, ACL: 'bucket-owner-full-control', ContentType: 'image/jpg' };
      const postParams = {
        Bucket: myBucket,
        Conditions: [
          ['starts-with', '$key', 'uploads/'],
        ]
      };

      const data = await new Promise((resolve, reject) => {
        this.s3.createPresignedPost(postParams, function (err, data) {
          if (err) {
            console.log('Error getting presigned url from AWS S3');
            ctx.body = { success: false, message: 'Pre-Signed URL error', urls: fileUrls };
            reject(err);
          }
          else {
            resolve(data);
          }
        })
      });

      console.log('data', data);


      ctx.status = 201;
      ctx.body = data;

  }




  async addEvent (ctx, next) {


    try {
      if (ctx.request.body.title) {
        const story = await this.Story.findOne({ _id: ctx.params.id, editor: ctx.user._id });
        if (!story) ctx.throw(404);

        let attachments = [];
        console.log(ctx.request.body);
        if (ctx.request.body.attachments.length !== 0) {
          const attachmentsData = ctx.request.body.attachments;
          console.log('attachment', attachmentsData);
          attachments = await Promise.all(attachmentsData.map(async attachment => {
            let attachmentData;
            if (attachment.type === 'link') {
              attachmentData = {
                type: attachment.type,
                url: attachment.url,
                urlImg: attachment.urlImg,
                title: attachment.title,
              };
            } else if (attachment.type === 'text') {
              attachmentData = {
                type: attachment.type,
                text: attachment.text,
              }
            } else if (attachment.type === 'image') {
              attachmentData = {
                type: attachment.type,
                urlImg: attachment.imageUrl,
              };
            } else {
              attachmentData = {
                type: attachment.type,
                url: attachment.url,
              };
            }
            return await this.Attachment.create(attachmentData);
          }));
        }

        console.log('Body', ctx.request.body)


        // const locationData = ctx.request.body.coordinates[0];
        const locationData = {lng:2.197941, lat: 41.394841}

        const location = await this.Location.create(locationData);

        console.log(location)

        const eventData = {
          title: ctx.request.body.title,
          startTime: ctx.request.body.startTime,
          mapLocation: ctx.request.body.mapLocation,
          dateAndTime: ctx.request.body.dateAndTime,
          location,
          attachments,
        };
        const createdEvent = await this.Event.create(eventData);
        // console.log('I am here', createdEvent)
        // console.log(story)
        // story.events.push(createdEvent);
        // console.log(story)
        // console.log(await story.save());
        await this.Story.update({ _id: ctx.params.id },
          { $push: { events: createdEvent } });
        console.log(createdEvent);
        ctx.status = 201;
        ctx.body = createdEvent;
      } else {
        throw 'No title provided!';
      }
    }
    catch (error) {
      console.error(error);
      throw ('Could not create event!');
    }
  };

  //Updates existing events
  async editEvent (ctx, next) {

    try {
      const story = await this.Story.findOne({
        _id: ctx.params.id,
        editor: ctx.user._id,
      }).populate('events');
      if (!story) ctx.throw(404);
      const data = ctx.request.body;

      const updatedProps = {};

      if (data.title) updatedProps.title = data.title;
      if (data.startTime) updatedProps.map = data.startTime;
      if (data.mapLocation) updatedProps.duration = data.mapLocation;
      if (data.dateAndTime) updatedProps.tagLine = data.dateAndTime;
      if (data.attachments) updatedProps.published = data.attachments;

      const eventId = ctx.params.eventId;
      await this.Event.findOneAndUpdate({ '_id': eventId }, { $set: updatedProps });
      ctx.body = await this.Event.findOne({ '_id': eventId });
    } catch (error) {
      throw (401, error);
    }
  };

  //Deletes existing events
  async deleteEvent (ctx, next) {
    try {
      const story = await this.Story.findOne({
        _id: ctx.params.id,
        editor: ctx.user._id
      }).populate('events');
      if (!story) ctx.throw(404);
      const event = story.events;
      for (var i = 0; i < event.length; i++) {
        if (event[i]['_id'] == ctx.params.eventId) {
          event.splice(i, 1);
        }
      }
      story.save();
      // await Event.findByIdAndRemove(ctx.params.eventId)
      ctx.status = 204;
    } catch (error) {
      throw (401, 'Could not edit event!');
    }
  };
};

module.exports = EventsController;