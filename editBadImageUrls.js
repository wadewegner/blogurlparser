var recursive = require('recursive-readdir');
var fs = require('fs');
var path = require('path');
var getUrls = require('get-urls');

require('shelljs/global');

var filePath = '/Users/wade.wegner/Projects/Github/WadeWegner/wadewegner.github.com/';

// choose a bad character mix
var fileTypes = [')]'];

function ignoreFunc(file, stats) {
  return stats.isDirectory() && path.basename(file) == ".git";
}

recursive(filePath, ['*.aspx', '*.rb', '*.txt', '*.lock', '*.ico', ignoreFunc], function (err, files) {

  files.some(file => {

    var discovered = false;
    var buffer = fs.readFileSync(file, "utf8");
    var urls = getUrls(buffer, { stripFragment: true });

    urls.some(url => {

      var length = fileTypes.length;

      while (length--) {

        if (url.indexOf(fileTypes[length]) != -1) {

          if (!discovered) {
            discovered = true;

            exec('/Applications/Macdown.app/Contents/SharedSupport/bin/macdown ' + file, function (status, output) {
              console.log('Exit status:', status);
              console.log('Program output:', output);
            });

            break;
          }
        }
      }

      if (discovered) {
        return true;
      }
    })

    if (discovered) {
      return true;
    }
  });
});