import { Template } from 'meteor/templating';
import { Wines } from '../imports/api/wines/wines.js';
import { Bottles } from '../imports/api/bottles/bottles.js';
import { CellarEvents } from '../imports/api/cellar-events/cellar-events.js';
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
});

Template.newEntry.helpers({
  wines() {
    // Show wines
    return Wines.find({});
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

Template.wines.onCreated(function() {
  this.SelectedItem = new ReactiveVar( "0" );
});

Template.wines.helpers({
  wines() {
    // Show wines
    return Wines.find({});
  },
  designations() {
    // Show designations
    return Designations.find({});
  },
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
  "click .deleteEntry"() {
    CellarEvents.remove(this._id);
  },
});
