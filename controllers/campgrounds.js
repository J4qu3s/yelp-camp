const campground = require('../models/campground');
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'succesfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'The campground you are looking for does not exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id }  = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'succesfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'succesfully deleted a campground');
    res.redirect('/campgrounds')
}