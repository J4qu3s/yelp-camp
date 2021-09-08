const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas');

const validateCampground = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body);
    console.log("validating");
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    //Also can be findById(req.params.id)
    const campground = await Campground.findById(id).populate('reviews');
    // res.send(`this is the response ${id}`)
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id/', validateCampground, catchAsync(async (req, res) => {
    const { id }  = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

module.exports = router;