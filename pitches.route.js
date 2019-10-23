
const express = require('express')
const pitchesRoutes =  express.Router()
const multer = require('multer')
let Image  = require('./image.model')
const Pitch  =  require('./pitches.model')

const  storage = multer.diskStorage({
  destination: function( req, file, cb){
    cb(null, './uploads/pitches/')
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

pitchesRoutes.route("/imageUpload")
    .post(upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.file.path
        });

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


pitchesRoutes.route('/addPitch').post((req, res )=> {
    let pitch = new Pitch(req.body)
    pitch.save()
        .then( pitch =>{
            res.status(200).json({
                'pitch': 'pitch added successfully'
            })
        }).catch(err =>{
                res.status(400).send("unable to save to database")
        })
})

// Defined get data(index or listing) route
pitchesRoutes.route('/').get(function (req, res) {
    Pitch.find(function(err, pitches){
    if(err){
      console.log(err);
    }
    else {
      res.json(pitches);
    }
  });
});

// Defined edit route
pitchesRoutes.route('/editPitch/:id').get(function (req, res) {
  let id = req.params.id;
  Pitch.findById(id, function (err,pitch){
      res.json(pitch);
  });
});

//  Defined update route
pitchesRoutes.route('/updatePitch/:id').post(function (req, res) {
    Pitch.findById(req.params.id, function(err, pitch) {
    if (!pitch)
      res.status(404).send("data is not found");
    else {
        pitch.Title = req.body.Title;
        pitch.Description = req.body.Description;
        pitch.Owner = req.body.Owner;
     

        pitch.save().then(pitch => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
pitchesRoutes.route('/deletePitch/:id').get(function (req, res) {
    Pitch.findByIdAndRemove({_id: req.params.id}, function(err, event){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});


module.exports = pitchesRoutes