require('mocha');
require('dotenv').config({ path: process.cwd() + '/enviroment/.env' })
require('../db')('mapstory-backend');
const chai = require("chai");
var chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();
require('chai').should();
const expect = chai.expect;
// import sinon
const sinon = require("sinon");

const EventController = require('../controllers/events.controllerAsClass');

const AWS = require('aws-sdk');
//const s3 = new AWS.S3({ accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, region: 'eu-west-3' });

const s3 = {};
s3.createPresignedPost = (params, callback) => {
  callback(0,1);
};

const eventTest = new EventController(null, null, null, null, s3);

describe('#getAWSUrl()', () => {

  it('should return the s3 response',
    async () => {
      let ctx = {
        };
      await eventTest.getAWSUrl(ctx);
      ctx.body.should.eql(1);
    });
});



describe('addEvents', () => {

  it('should not create events if no title is provided',
    async () => {
      const ctx = {
        request: {
          body: {
            title: '',
            startTime: 38,
            dateAndTime: 'Thurs 21 December',
            mapLocation: 'Barcelona',
            attachments: [],
          }
        }
      };
      await eventTest.addEvent(ctx).should.be.rejected;
    }
  )
}
)

