const express = require('express')
const mealsRoutes =  express.Router()
const multer = require('multer')
let Image  = require('./image.model')
const Meal  =  require('./meals.model')

const  storage = multer.diskStorage({
  destination: function( req, file, cb){
    cb(null, './uploads/meals/')
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

mealsRoutes.route("/imageUpload")
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


mealsRoutes.route('/addMeal').post((req, res )=> {
    let meal = new Meal(req.body)
    meal.save()
        .then( meal =>{
            res.status(200).json({
                'meal': 'meal added successfully'
            })
        }).catch(err =>{
                res.status(400).send("unable to save to database")
        })
})

// Defined get data(index or listing) route
mealsRoutes.route('/').get(function (req, res) {
    Meal.find(function(err, meals){
    if(err){
      console.log(err);
    }
    else {
      res.json(meals);
    }
  });
});

// Defined edit route
mealsRoutes.route('/editMeal/:id').get(function (req, res) {
  let id = req.params.id;
  Meal.findById(id, function (err, meal){
      res.json(meal);
  });
});

//  Defined update route
mealsRoutes.route('/updateMeal/:id').post(function (req, res) {
    Meal.findById(req.params.id, function(err, meal) {
    if (!meal)
      res.status(404).send("data is not found");
    else {
       meal.Title = req.body.Title;
       meal.Recipe = req.body.Recipe;
       meal.Chef = req.body.Chef;
     

       meal.save().then(event => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
mealsRoutes.route('/deleteMeal/:id').get(function (req, res) {
    Meal.findByIdAndRemove({_id: req.params.id}, function(err, event){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});


module.exports = mealsRoutes