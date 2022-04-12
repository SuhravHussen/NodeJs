// dependencie
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder

lib.basedir = path.join(__dirname, '/../data/');

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

// read data
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (error, data) => {
        callback(error, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // open file to write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);
            // truncate the file

            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            // close file
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('error closing file');
                                }
                            });
                        } else {
                            callback('Error writing to file');
                        }
                    });
                } else {
                    callback('Error! cant truncate the file');
                }
            });
        } else {
            console.log('error! file may not exist');
        }
    });
};

// delete file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('error deleting file');
        }
    });
};
// list all the items in a common directory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            const trimmedFileNames = [];
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback('error reading directory');
        }
    });
};
module.exports = lib;
