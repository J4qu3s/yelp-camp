const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas');
const flash = require('connect-flash');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'succesfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    //Also can be findById(req.params.id)
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate : {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    // res.send(`this is the response ${id}`)
    if(!campground){
        req.flash('error', 'The campground you are looking for does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'The campground you are looking for does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id/', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id }  = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'succesfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'succesfully deleted a campground');
    res.redirect('/campgrounds')
}));

module.exports = router;