//dependencies
var fs = require('fs');

module.exports = class fileExporter {

    constructor(fileName, filePath, data){
        this.fileName = fileName;
        this.filePath = filePath;
        if(data != ''){
            this.export(data);
        }
    }

    export(data){
        if (!fs.existsSync(this.filePath)){
            fs.mkdirSync(this.filePath);
        }
        var file = this.filePath + '/' + this.fileName + '.php'
        var stream = fs.createWriteStream(file);
            stream.once('open', function(fd) {
              stream.write(data);
              stream.end();
              console.log(file + ' successfully generated!');
              process.exit(0);
            });
    }
}