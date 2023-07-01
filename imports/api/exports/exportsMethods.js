import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ExportsCollection } from '../../db/ExportsCollection';

const urlList = [
    'https://www.lempire.com/',
    'https://www.lemlist.com/',
    'https://www.lemverse.com/',
    'https://www.lemstash.com/'
];


Meteor.methods({
  'exports.insert'() {
    ExportsCollection.insert({
        status: 0,
        createdAt: new Date()
      }, Meteor.bindEnvironment((error, exportId) => {
        if(error) {
          throw new Meteor.Error('error');
        }
        
        processExport(exportId);

      }))
  },
  'exports.remove'(exportId) {
    check(exportId, String);
 
    ExportsCollection.remove(exportId);
  },
});

function processExport(exportId) {
  let progress = 0;
  let progressInterval = Meteor.setInterval(() => {

    ExportsCollection.update(exportId, { $inc: { status: 5 }});
    progress += 5;

    if(progress > 100) {
      ExportsCollection.update(exportId, { $set: { status: urlList[Math.floor(Math.random()*urlList.length)] }});
      clearInterval(progressInterval);
    }
  }, 1000);
}