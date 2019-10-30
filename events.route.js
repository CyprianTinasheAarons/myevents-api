const express = require('express')
const eventRoutes =  express.Router()
const multer = require('multer')
let Image  = require('./image.model')
const Event  =  require('./events.model')

const  storage = multer.diskStorage({
  destination: function( req, file, cb){
    cb(null, './uploads/events/')
  } ,
  filename: function(req, file,cb){
    cb(null, Date.now() + file.originalname) ;
  }

})

const fileFilter = (req , file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true)
  } else{
    cb(null, false)

  }
}

const upload = multer({
  storage:storage,
  limits: {
    fileSize: 10240 * 10240 * 5
  } ,
  fileFilter: fileFilter
})

eventRoutes.route("/imageUpload")
    .post(upload.single('imageData'), (req, res, next) => {
    
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.file.path
        })

        newImage.save()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    success: true,
                    document: result
                });
            })
            .catch((err) => next(err));
    });


eventRoutes.route('/addEvent').post((req, res )=> {
    // let event = new Event(req.body)
    let event = new Event(
      req.body 

    )
    event.save()
        .then( event =>{
            res.status(200).json({
                'event': 'event added successfully'
            })
        }).catch(err =>{
                res.status(400).send("unable to save to database")
        })
})

// Defined get data(index or listing) route
eventRoutes.route('/').get(function (req, res) {
    Event.find(function(err, events){
    if(err){
      console.log(err);
    }
    else {
      res.json(events);
    }
  });
});

//  single event route

eventRoutes.route('/singleEvent/:id').get(function (req, res) {
  let id = req.params.id;
  Event.findById(id, function (err, event){
      res.json(event);
  });
});

// Defined edit route
eventRoutes.route('/editEvent/:id').get(function (req, res) {
  let id = req.params.id;
  Event.findById(id, function (err, event){
      res.json(event);
  });
});



//  Defined update route
eventRoutes.route('/updateEvent/:id').post(function (req, res) {
    Event.findById(req.params.id, function(err, event) {
    if (!event)
      res.status(404).send("data is not found");
    else {
        event.Title = req.body.Title;
        event.Location = req.body.Location;
        event.Description = req.body.Description;
        event.Organizer = req.body.Organizer;
     

        event.save().then(event => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
eventRoutes.route('/deleteEvent/:id').get(function (req, res) {
    Event.findByIdAndRemove({_id: req.params.id}, function(err, event){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});


module.exports = eventRoutes