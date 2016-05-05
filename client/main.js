import { Template } from 'meteor/templating';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellar-events/cellar-events.js';
import { Designations } from '../imports/api/designations/designations.js';

import './main.html';

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function (){
    this.render('home');
});
Router.route('/new-wine', function (){
    this.render('newWine');
});
Router.route('/designations', function (){
    this.render('designations');
});
Router.route('/history', function (){
    this.render('history');
});

Template.home.helpers({
  bottles() {
    // Show bottles
    return Bottles.find({});
  },
});

Template.home.events({
  "click .deleteBottle"() {
    Bottles.remove(this._id);
  },
  "click .deleteEntry"() {
    CellarEvents.remove(this._id);
  },
  "click .test"() {
    Meteor.call('xmlParse');
    //Meteor.call('test');
  },
});

Template.newEntry.helpers({
  wines() {
    // Show wines
    return Wines.find({});
  },
});

Template.newWine.helpers({
  wines() {
    // Show wines
    return Wines.find({});
  },
  designations() {
    // Show designations
    return Designations.find({});
  },
  parcels() {
    // Show parcels
    return Parcels.find({});
  },
});

Template.designations.helpers({
  designations() {
    // Show designations
    return Designations.find({});
  },
});

Template.designations.events({
  "click .delete"() {
    Designations.remove(this._id);
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

Template.newEntry.events({
  "click .deleteWine"() {
    Wines.remove(this._id);
  },
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

    Meteor.call('upsertBottle', wineId, millesime, quantity, date,
      function(error, result){
        var id = result;
        CellarEvents.insert({
           date: date,
           type: "in",
           quantity: quantity,
           bottleId: id,
         });
      }
    );

    // Clear form
    target.date.value = '';
    target.wine.selectedIndex=0;
    target.millesime.value = '';
    target.quantity.value = '';
    target.comments.value = '';
  },
});

Template.newWine.events({
  "submit #new-wine": function(event, template){
    // Prevent default browser form submit
    event.preventDefault();

    // Get values from form
    const target = event.target;
    const color = target.color.value;
    const indexD = target.designation.selectedIndex;
    const designationId = target.designation.options[indexD].value;
    const domain = target.domain.value;

    // Insert a wine into the collection
    Wines.insert({
      color: color,
      designationId: designationId,
      domain: domain,
    });

    // Clear form
    target.color.value = '';
    target.designation.selectedIndex=0;
    target.domain.value = '';
  }
});
