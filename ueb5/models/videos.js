// a singleton for ID generation
var globalCounter = (function() {
    var i = 100;
    return function() {
        return ++i;
    }

})();

// mongoose model for videos
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

// setter
function setID () {
    return globalCounter().toString();
}

var videoSchema = new Schema({
    _id: {type: String, required: true, set: setID},
    title: {type: String, required: true},
    description: {type: String, default: ''},
    src: {type: String, required: true},
    length: {type: Number, required: true, min: 0},
    playcount: {type: Number, default: 0, min: 0 },
    ranking: {type: Number, default: 0, min: 0 }
}, {timestamps: {createdAt: 'timestamps', updatedAt: 'lastUpdate'}});



module.exports = mongoose.model('Videos', videoSchema);