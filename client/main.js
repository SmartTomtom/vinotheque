import { Template } from 'meteor/templating';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellarevents/cellarevents.js';
import { Designations } from '../imports/api/designations/designations.js';
import { Parcels } from '../imports/api/parcels/parcels.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function (){
    this.render('home');
});
Router.route('/wines', function (){
    this.render('wines');
});
Router.route('/designations', function (){
    this.render('designations');
});
Router.route('/history', function (){
    this.render('history');
});

Template.registerHelper(
  "today", function () {
    var date = new Date();
    var dateFormat = require('dateformat');
    var dateFormated = dateFormat(date,'yyyy-mm-dd');
    return dateFormated;
  },
);

Template.registerHelper(
  "wines", function () {
    // Show wines
    return Wines.find({});
  },
);

Template.registerHelper(
  "bottles", function () {
    // Show bottles
    return Bottles.find({});
  },
);

Template.registerHelper(
  "designations", function () {
    // Show designations
    return Designations.find({});
  },
);

Template.home.events({
  "click .deleteBottle"() {
    Bottles.remove(this._id);
  },
});

Template.newEntry.events({
  "submit #new-entry": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const date = target.date.value;
    const index = target.wine.selectedIndex;
    const wineId = target.wine.options[index].value;
    const millesime = Number(target.millesime.value);
    const quantity = Number(target.quantity.value);
    const comments = target.comments.value;
    
    Meteor.call('upsertBottle', wineId, millesime, quantity,
      function(error, result){
        var id = result;
        CellarEvents.insert({
           date: date,
           type: "in",
           quantity: quantity,
           bottleId: id,
           comments: comments,
         });
      }
    );

     // Clear form
     target.wine.selectedIndex=0;
     target.millesime.value = '';
     target.quantity.value = '';
     target.comments.value = '';
  },
});

Template.newExit.onCreated(function() {
  this.exitChecked = new ReactiveVar(false);
});

Template.newExit.helpers({
  exitChecked() {
    // Show parcels of a designation
    var bool = Template.instance().exitChecked.get();
    return bool;
  },
});

Template.newExit.events({
  "submit #new-exit": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const date = target.date.value;
    const bottleId = target.bottle.value;
    const quantity = Number(target.quantity.value);
    const comments = target.comments.value;

    Bottles.update(
      { _id: bottleId },
      { $inc: { quantity: quantity*-1 } },
    );
    CellarEvents.insert({
       date: date,
       type: "out",
       quantity: quantity,
       bottleId: bottleId,
       comments: comments,
     });

     // Clear form
     target.quantity.value = '';
     target.comments.value = '';
  },
  "click .exitBottle": function(event, template){
    const target = event.target;
    if(template.exitChecked.get()){
      template.exitChecked.set(false);
    } else {
      template.exitChecked.set(true);
    }
  },
});

Template.wines.onCreated(function() {
  this.SelectedItem = new ReactiveVar( "0" );
});

Template.wines.helpers({
  parcels() {
    // Show parcels of a designation
    var index = Template.instance().SelectedItem.get();
    return Parcels.find({designationId: index});
  },
});

Template.wines.events({
  "submit #new-wine": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const color = target.color.value;
    const indexD = target.designation.selectedIndex;
    const designationId = target.designation.options[indexD].value;
    const indexP = target.parcel.selectedIndex;
    const parcelId = target.parcel.options[indexP].value;
    const domain = target.domain.value;

    // Insert a wine into the collection
    Wines.insert({
      color: color,
      designationId: designationId,
      parcelId: parcelId,
      domain: domain,
    });

    // Clear form
    target.color.value = 'red';
    target.designation.selectedIndex=0;
    target.domain.value = '';
  },
  "change #designation": function(event, template){
    var currentTarget = event.currentTarget;
    const index = currentTarget.selectedIndex;
    const designationId = currentTarget.options[index].value;
    template.SelectedItem.set(designationId);
  },
  "click .deleteWine"() {
    Wines.remove(this._id);
  },
});

Template.designations.events({
  "click .delete"() {
    Designations.remove(this._id);
  },
  "click .add"() {
    Meteor.call('xmlParse');
  },
});

Template.history.helpers({
  entries() {
    // Show entries
    return CellarEvents.find({ type: "in"});
  },
  exits() {
    // Show exits
    return CellarEvents.find({ type: "out"});
  },
});

Template.history.events({
  "click .deleteCellarEv"() {
    CellarEvents.remove(this._id);
  },
});
