import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'aldeed:simple-schema';

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
