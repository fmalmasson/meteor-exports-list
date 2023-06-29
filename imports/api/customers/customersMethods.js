import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CustomersCollection } from '../../db/CustomersCollection';

Meteor.methods({
  'customers.insert'(infos) {
    CustomersCollection.insert({
        infos, 
        createdAt: new Date()
      })
  },
  'customers.remove'(customerId) {
    check(customerId, String);
 
    CustomersCollection.remove(customerId);
  },
});
