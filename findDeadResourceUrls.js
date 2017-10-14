var recursive = require('recursive-readdir');
var fs = require('fs');
var path = require('path');
var getUrls = require('get-urls');
var request = require('request');

var fileTypes = ['.png', '.jpg', '.jpeg', '.gif', '.tif', '.pdf', '.tiff', '.ico', '.zip', '.pptx'];
var filePath = '/Users/wade.wegner/Projects/Github/WadeWegner/wadewegner.github.com/';

function ignoreFunc(file, stats) {
  return stats.isDirectory() && path.basename(file) == ".git";
}

recursive(filePath, ['*.aspx', '*.css', '*.rb', '*.txt', '*.lock', '*.ico', ignoreFunc], function (err, files) {

  files.some(file => {

    var buffer = fs.readFileSync(file, "utf8");
    var foundUrls = getUrls(buffer, { stripFragment: true, removeTrailingSlash: true });

    foundUrls.some(foundUrl => {

      var length = fileTypes.length;

      while (length--) {

        if (foundUrl.indexOf(fileTypes[length]) != -1) {

          if (foundUrl.slice(-1) == ')') {
            foundUrl = foundUrl.substring(0, foundUrl.length - 1);
          }

          request.head(foundUrl, function (err, res, body) {
            if (err != null) {
              console.log(err);
              return true;
            }
            if (res.statusCode != 200) {
              console.log(foundUrl);
            }
          })
        }
      }
    })
  });
});