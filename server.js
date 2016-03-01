var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {

    var length = this.items.length;
    var item = null;
    for (var i = 0; i < length; i++) {
        var listItem = this.items[i]
        if (listItem.id == id) {
            this.items.splice(i, 1)
            item = listItem
            break
        }
    }

    return item;
};

Storage.prototype.put = function(id, name) {
    var length = this.items.length;
    var item = null;
    for (var i = 0; i < length; i++) {
        var listItem = this.items[i]
        if (listItem.id == id) {
            listItem.name = name
            item = listItem
            break
        }
    }
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});
 
app.delete('/items/:id', function(req, res) {
    var item = storage.remove(req.params.id);
    if (item !== null) {
        console.log(item.name + ", " + item.id)
        res.status(201).json(item);
    } else {
        res.status(400).json({"error": "no item found"})
    }
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
  
    var item = storage.put(req.params.id, req.body.name);
    res.status(201).json(item);
});

app.listen(process.env.PORT || 8080);

exports.app = app
exports.storage = storage
