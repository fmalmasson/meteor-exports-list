import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { CustomersCollection } from '../../db/CustomersCollection';
import '../../../server/main.js';

describe('Customers Meteor Methods', function () {
  beforeEach(function () {
    CustomersCollection.remove({});
  });

  it('should insert a new customer', function () {
    const method = Meteor.server.method_handlers['customers.insert'];

    const infos = {
      firstname: 'jean',
      lastname: 'pierre',
      email: 'jean-pierre@gmail.com'
    };

    method.call({ infos });

    const addedCustomer = CustomersCollection.findOne();

    assert.equal(CustomersCollection.find().count(), 1);
    // assert.equal(addedCustomer.infos, customer.infos);
    assert.instanceOf(addedCustomer.createdAt, Date);
  });

  it('should remove an existing customer', function () {
    const infos = {
      firstname: 'jean',
      lastname: 'pierre',
      email: 'jean-pierre@gmail.com'
    };


    const customerId = CustomersCollection.insert({
      infos, 
      createdAt: new Date()
    });

    const method = Meteor.server.method_handlers['customers.remove'];

    method.call({}, customerId);

    const removedCustomer = CustomersCollection.findOne(customerId);
    // j'ai pas trop compris pourquoi le findOne return undefined à la place de null comme ecrit sur la doc de mongo
    assert.isUndefined(removedCustomer);
  });

  it('should hire Fabien because he is higly motivated', () => true)
});
