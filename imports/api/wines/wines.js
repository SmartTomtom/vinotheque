import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Bottles } from '../bottles/bottles.js';
import { Designations } from '../designations/designations.js';
import { Parcels } from '../parcels/parcels.js';

export const Wines = new Mongo.Collection('wines');

Wines.schema = new SimpleSchema ({
  color: {type: String, allowedValues: ['red', 'white']},
  designationId: {type: String},
  parcelId: {type: String},
  domain: {type: String},
});

Wines.helpers({
  bottles() {
    return Bottles.find({ wineId: this._id }, {sort: {millesime: 1}});
  },
  designation() {
    return Designations.findOne(this.designationId);
  },
  parcel() {
    return Parcels.findOne(this.parcelId);
  },
});

Wines.attachSchema(Wines.schema);
