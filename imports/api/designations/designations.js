import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Parcels } from '../parcels/parcels.js';

export const Designations = new Mongo.Collection('designations');

Designations.schema = new SimpleSchema ({
  name: {type: String},
  category: {type: String,  allowedValues: ['Grand cru', 'Village','Régionale']},
});

Designations.helpers({
  parcels() {
    return Parcels.find({ designationId: this._id });
  },
});

Designations.attachSchema(Designations.schema);
