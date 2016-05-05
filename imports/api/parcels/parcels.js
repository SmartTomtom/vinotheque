import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Designations } from '../designations/designations.js';

export const Parcels = new Mongo.Collection('parcels');

Parcels.schema = new SimpleSchema ({
  name: {type: String},
  category: {type: String, optional: true},
  designationId: {type: String},
});

Parcels.helpers({
  designation() {
    return Designations.findOne(this.designationId);
  },
});

Parcels.attachSchema(Parcels.schema);
