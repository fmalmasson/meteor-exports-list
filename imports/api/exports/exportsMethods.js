import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ExportsCollection } from '../../db/ExportsCollection';

Meteor.methods({
  'exports.insert'({ fileName, createdAt, status }) {
    ExportsCollection.insert({
        fileName, 
        createdAt, 
        status,
        createdAt: new Date()
      }, Meteor.bindEnvironment((error, exportId) => {
        if(error) {
          throw new Meteor.Error('error');
        }
        
        processExport(exportId);

      }))
  },
  'exports.remove'(exportId) {
    console.log('exportId', exportId)
    check(exportId, String);
 
    ExportsCollection.remove(exportId);
  },
});

function processExport(exportId) {
  Meteor.setTimeout(() => {
    ExportsCollection.update(exportId, { $set: { status: "done" }});
  }, 20000);
}