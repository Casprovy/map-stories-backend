require('mocha');
const chai = require("chai");
const expect = chai.expect;
// import sinon
const sinon = require("sinon");

const EventController = require('../controllers/events.controllerAsClass');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ accessKeyId: process.env.AWSAccessKeyId, secretAccessKey: process.env.AWSSecretKey, region: 'eu-west-3'});

const eventTest = new EventController(null,null,null,null,s3);

describe('getAWSUrl', function () {
  it('should return an AWS path', function () {
    eventTest.getAWSUrl


  })
})



