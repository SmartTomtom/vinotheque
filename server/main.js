import { Meteor } from 'meteor/meteor';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellar-events/cellar-events.js';
import { Designations } from '../imports/api/designations/designations.js';

Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  'upsertBottle': function(wineId, millesime, quantity, date){
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
    fs.readFile(dataPath + '/test.xml', function(err,data){
      if (err) {
          console.error('readFile error',err);
      } else {
        var objects = xml2js.parseString(data,
          {explicitRoot: false, explicitArray:false },
           function (err, result) {
             result.designation.forEach(function(obj){
              fiber(function(){
                Designations.insert(obj);
              }).run()
            });
        });
      }
    });
  },
  'test': function() {
    var documents = { name: 'Chablis Grand Cru', category: 'Grand cru' };
    //    { name: 'Bonnes-Mares', category: 'Grand cru' } ];
    Designations.insert(documents);
  },
});
