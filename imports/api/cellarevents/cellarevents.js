import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Wines } from '../wines/wines.js';
import { Bottles } from '../bottles/bottles.js';

export const CellarEvents = new Mongo.Collection('cellarevents');

CellarEvents.schema = new SimpleSchema ({
  date: {type: Date},
  type: {type: String, allowedValues: ['in', 'out']},
  quantity: {type: Number},
  bottleId: {type: String},
  comments: {type: String, optional: true},
});

CellarEvents.helpers({
  bottle() {
    return Bottles.findOne(this.bottleId);
  },
  wine() {
    return Bottles.findOne(this.bottleId).wine();
  },
  dateFormated() {
    var dateFormat = require('dateformat');
    var date = this.date;
    return dateFormat(date,'dd/mm/yyyy');
  },
});

CellarEvents.attachSchema(CellarEvents.schema);
