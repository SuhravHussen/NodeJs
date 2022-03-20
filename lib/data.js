// dependencie
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
console.log(__dirname);
lib.basedir = path.join(__dirname, '/../data/');
console.log(lib.basedir);
// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert Data to string
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (error2) => {
                if (!error2) {
                    fs.close(fileDescriptor, (error3) => {
                        if (!error3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Error! file may already exists');
        }
    });
};

module.exports = lib;
