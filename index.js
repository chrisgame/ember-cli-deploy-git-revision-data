/* jshint node: true */
'use strict';

var BasePlugin  = require('ember-cli-deploy-plugin');

var Promise     = require('ember-cli/lib/ext/promise');

module.exports = {
  name: 'ember-cli-deploy-git-revision-data',

  createDeployPlugin: function(options) {
    var Plugin = BasePlugin.extend({
      name: options.name,

      setup: function(context) {
       var client = context._gitInfoLib || require('git-repo-info');

       var path = client._findRepo();

       if (path === null) {
         this.log('No git repo detected', { verbose: true });
         return Promise.resolve();
       }

       var info = client(path);

       var revisionData = Object.keys(info)
         .reduce(function(data, key) {
           if (info[key] && key !== 'root') {
             data[key] = info[key];
           }

           return data;
         }, {});

       if (Object.keys(revisionData).length) {
         return Promise.resolve({
           revisionData: {
             git: revisionData
           }
         });
       }

        return Promise.resolve();
      }
    });

    return new Plugin();
  }
};
