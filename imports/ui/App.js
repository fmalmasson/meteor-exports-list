import { Template } from 'meteor/templating';
import { ExportsCollection } from '../db/ExportsCollection';
import { CustomersCollection } from '../db/CustomersCollection';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import 'toastr/build/toastr.min.css';
import toastr from 'toastr';

import './App.html';
import './templates/customers/customer.html';
import './templates/customers/customer-form.html';
import './templates/exports/export.html';

const URL_LIST = "urlList";

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  Meteor.subscribe('listExports');
  Meteor.subscribe('listCustomers');
  Meteor.subscribe('exportStatusChanged');

  Tracker.autorun(() => {
    ExportsCollection.find().observeChanges({
      changed: function (id, fields) {
        const updatedDocument = { _id: id, ...fields };
        toastr.success(`Your export ${id} is ready`);
      }
    });
  });
});

Template.export.onCreated(function exportOnCreated() {
  this.state = new ReactiveDict();
  this.state.set(URL_LIST, [
    'https://www.lempire.com/',
    'https://www.lemlist.com/',
    'https://www.lemverse.com/',
    'https://www.lemstash.com/'
  ]);

  this.exportProgress = new ReactiveVar(0);

  // Pick a random url in URL_LIST
  const urlArray = this.state.get(URL_LIST);
  this.exportUrl = new ReactiveVar(urlArray[Math.floor(Math.random()*urlArray.length)]);

  // update progress every second, add 5 %
  this.autorun(() => {
    setInterval(() => {
      const currentProgress = this.exportProgress.get();
      const updatedProgress = currentProgress + 5;
      this.exportProgress.set(updatedProgress);
    }, 1000);
  });
});



Template.mainContainer.helpers({
  exports() {
    return ExportsCollection.find({}, { sort: { createdAt: -1 } });
  },
  customers() {
    return CustomersCollection.find({});
  },
  customersTotal() {
    return CustomersCollection.find().count();
  },
  exportsTotal() {
    return ExportsCollection.find().count();
  },
});

Template.export.helpers({
  formatedDate(date) {
    return new Date(date).toLocaleString();
  },
  fileName() {
    return `Export-${this._id}`;
  },
  // when export is processed, show loader, when done, show url as status
  showExportStatus() {
    return this.status !== 'in_progress';
  },
  progress() {
    const templateInstance = Template.instance();
    return `${templateInstance.exportProgress.get()} %`;
  },
  finalUrl() {
    const templateInstance = Template.instance();
    return templateInstance.exportUrl.get();
  }
})

Template.mainContainer.events({
  "click #btn-export-selection"() {
    Meteor.call('exports.insert', { 
      fileName: 'test', 
      createdAt: new Date(), 
      status: 'in_progress'
    });
  },

  "click #delete-customer"() {
    Meteor.call('customers.remove', this._id);
  },

  "click #delete-export"() {
    Meteor.call('exports.remove', this._id);
  }
})

Template.customerForm.events({
  "submit .customer-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;

    const infos = {
      firstname: target.firstname.value,
      lastname: target.lastname.value,
      email: target.email.value
    }

    // Insert a customer into the collection
    Meteor.call('customers.insert', infos);

    // Clear form
    [
      'firstname',
      'lastname',
      'email',
    ].forEach(input => target[input].value = '')
  }
})