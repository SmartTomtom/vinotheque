import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Wines } from '../wines/wines.js';
import { Bottles } from '../bottles/bottles.js';

export const CellarEvents = new Mongo.Collection('cellar-events');

CellarEvents.schema = new SimpleSchema ({
  date: {type: String},
  type: {type: String},
  quantity: {type: Number},
  bottleId: {type: String},
  comments: {type: String, optional: true},
  review: {type: String, optional: true},
});

CellarEvents.helpers({
  bottles() {
    return Bottles.findOne(this.bottleId);
  },
  wine() {
    return Bottles.findOne(this.bottleId).wine();
  },
});

CellarEvents.attachSchema(CellarEvents.schema);
