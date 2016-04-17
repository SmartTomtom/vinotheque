import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Wines = new Mongo.Collection('wines');

Wines.schema = new SimpleSchema ({
  color: {type: String},
  designation: {type: String},
  domain: {type: String},
  classificationId: {type: String, optional: true}
});

Wines.helpers({
  bottles() {
    return Bottles.find({ wineId: this._id }, {sort: {millesime: 1}});
  }
});

Wines.attachSchema(Wines.schema);
