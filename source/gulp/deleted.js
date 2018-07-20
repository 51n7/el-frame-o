(function() {
  var glob = require("glob-all");
  var through = require("through");
  var path = require("path");
  var _ = require("underscore");
  var del = require("del");

  module.exports = function(dest, destPatterns) {
    if (destPatterns === undefined) return through(function write(data) {this.emit('data', data)},function end () {this.emit('end')});

    var files = [];
    var srcFiles = [];
    var destFiles = glob.sync( destPatterns, {cwd: path.join(process.cwd(), dest) } );

    var onFile = function(file) {
      srcFiles.push(file.path);
      return files.push(file);
    };

    var onEnd = function() {

      for (var i = srcFiles.length -1, l = -1; i > l; i--){
        srcFiles[i] = srcFiles[i].replace(/\\/g, "/").substr(process.cwd().length + 1);
        if (srcFiles[i] == '') {
          srcFiles.splice(i,1);
        }
      }

      var deletedFiles = _.difference(destFiles, srcFiles);

      _.each(deletedFiles, function(item, index) {
        deletedFiles[index] = path.join( process.cwd(), dest,  deletedFiles[index] );
        del.sync(deletedFiles[index], {force: true});
      })

      return this.emit("end");
    };

    return through(onFile, onEnd);
  };

}).call(this);
