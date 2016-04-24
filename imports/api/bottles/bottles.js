import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Wines } from '../wines/wines.js';

export const Bottles = new Mongo.Collection('bottles');

Bottles.schema = new SimpleSchema ({
  wineId: {type: String},
  millesime: {type: Number},
  quantity: {type: Number, min: 0}
});

Bottles.helpers({
  wine() {
    return Wines.findOne(this.wineId);
  }
});

Bottles.attachSchema(Bottles.schema);
