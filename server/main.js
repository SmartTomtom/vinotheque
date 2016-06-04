import { Meteor } from 'meteor/meteor';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellarevents/cellarevents.js';
import { Designations } from '../imports/api/designations/designations.js';
import { Parcels } from '../imports/api/parcels/parcels.js';

Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  'deleteDesignation': function(id) {
    Parcels.remove({designationId: id});
    Designations.remove(id);
  },
  'insertDesignation': function(data) {
    console.log ('!! Insert Designation !!');
    console.log('name: ',data['$'].name);
    console.log('category: ',data['$'].category);
    var designationId;
    var designation = Designations.findOne(
      { name: data['$'].name, category: data['$'].category }
    );
    if ( designation != null ) {
      designationId = designation._id;
      console.log('designation already exists : ', designationId);
    } else {
      designationId = Designations.insert(
        { name: data['$'].name, category: data['$'].category },
      );
      console.log('designation created : ', designationId);
    }
    data.parcel.forEach(function(parcel){
      Meteor.call('insertParcel', parcel, designationId);
    });
  },
  'insertParcel': function(data, designationId) {
    console.log('!! Insert parcels !!');
    console.log('designationId: ', designationId);
    console.log('name: ', data['$'].name);
    var parcelId;
    var parcel = Parcels.findOne(
      { name: data['$'].name, designationId: designationId }
    );
    if ( parcel != null ) {
      parcelId = parcel._id;
      console.log('parcel already exists : ', parcelId);
    } else {
      parcelId = Parcels.insert(
        { name: data['$'].name, designationId: designationId },
      );
      console.log('parcel created : ', parcelId);
    }
  },
  'upsertBottle': function(wineId, millesime, quantity){
    var bottle = Bottles.findOne({ wineId: wineId, millesime: millesime});
    if ( bottle != null ) {
      Bottles.update(
        { wineId: wineId, millesime: millesime },
        { $inc: { quantity: quantity } },
      );
      return bottle._id;
    } else {
      var newBottle = Bottles.insert(
        { wineId: wineId, millesime: millesime, quantity: quantity },
      );
      return newBottle;
    }
  },
  'xmlParse': function() {
    var fiber = Npm.require("fibers");
    var util = require('util');
    var fs = require('fs');
    var xml2js = require('xml2js');
    var dataPath = 'D:/Developpement/Vinotheque/vinotheque/resources';
    fs.readFile(dataPath + '/designations.xml', function(err,data){
      if (err) {
          console.error('readFile error',err);
      } else {
        var objects = xml2js.parseString(data,
          {explicitRoot: false},
          function (err, result) {
            result.designation.forEach(function(designation){
              fiber(function(){
                Meteor.call('insertDesignation', designation);
              }).run()
            });
          }
        );
      }
    });
  },
});
