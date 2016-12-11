var express = require('express')
var router = express.Router();
const helpers = require('../config/helpers');
var User = require("../Models/userModel");
var Poll = require("../Models/pollModel");
var GraphColors = ["#2196f3", "#2ecc71", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login To Create a poll');
    res.redirect('/');
}

module.exports = function(passport) {

    router.get('/logoff', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.post('/shouldVote', function(req, res) {
        if (req.body.pollid) {
            Poll.find({
                "uniqueId": req.body.pollid
            }, function(err, pollJSON) {
                var ip = helpers.getIp();
                var shouldVote = false;
                if (req.isAuthenticated()) {
                    shouldVote = pollJSON[0].AuthVoters.indexOf(ip) == -1 ? true : false;
                    console.log(shouldVote = pollJSON[0].AuthVoters.indexOf(ip) == -1 ? true : false);
                } else {
                    shouldVote = pollJSON[0].NonAuthVoters.indexOf(ip) == -1 ? true : false;
                    console.log(shouldVote = pollJSON[0].NonAuthVoters.indexOf(ip) == -1 ? true : false);
                }
                res.send(shouldVote);
            });
        }
    });

    router.get('/allPolls', function(req, res) {
        Poll.find({}, function(err, retrievedPolls) {
            if (err) res.status(500).send(null);
            res.status(200).send(retrievedPolls);
        });
    });

    router.get('/myPolls', isAuthenticated, function(req, res) {
        Poll.find({
            "createdById": req.user._id
        }, null, {
            sort: {
                '_id': -1
            }
        }, function(err, foundRecords) {
            res.render('pages/myPollList', {
                userPolls: foundRecords,
                user: req.isAuthenticated() ? req.user : null
            });
        });
    });

    router.get('/poll/:pollId', function(req, res) {
        Poll.findOne({
            "uniqueId": req.params.pollId
        }, function(err, foundPoll) {
            if (err) res.status(500).send('failed! try again.');

            res.render('pages/voteForPoll', {
                user: req.isAuthenticated() ? req.user : null,
                pollData: foundPoll
            });
        });
    });

    router.post('/delete', function(req, res) {
        console.log(req.body.id);
        Poll.remove({
            _id: req.body.id
        }, function(err) {
            if (err)
                res.status(500).send('failed! try again.');
            res.status(200).send('success');
        });
    });

    router.get('/', function(req, res) {
        res.render('pages/home', {
            user: req.isAuthenticated() ? req.user : null
        });
    });

    router.get('/profile', isAuthenticated, function(req, res) {
        res.send(req.user);
    });

    router.post('/create', isAuthenticated, function(req, res) {
        var receivedPollData = req.body;
        Poll.findOne({
            "description": receivedPollData.name
        }, function(err, foundPoll) {
            if (err) {
                res.redirect('/create', req.flash('error', "An error occured while creating your poll. Please try again."));
            }
            if (foundPoll) {
                console.log(foundPoll);
                res.send(JSON.stringify(foundPoll));
            } else {
                if (receivedPollData.options != undefined) {
                    var curDate = new Date();
                    var PollsToArray = receivedPollData.options.map(function(CurrentPoll, index) {
                        return {
                            option: CurrentPoll,
                            count: 0,
                            color: GraphColors[index]
                        }
                    });
                    var newPoll = new Poll({
                        description: receivedPollData.name,
                        poll: PollsToArray,
                        uniqueId: helpers.generateRandomNumbers(),
                        createdData: curDate,
                        createdById: req.user._id
                    });
                    newPoll.save(function(err, savedPoll) {
                        if (err) {
                            res.redirect('/create', req.flash('error', "An error occured while saving your poll. Please try again."));
                        }
                        req.flash('success', 'Poll successfully Created.!');
                        res.send(JSON.stringify(savedPoll));
                    });
                }
            }
        });
    });

    router.post('/updatePoll', function(req, res) {
        var receivedUpdatedPollData = req.body;
        var toPush = req.isAuthenticated() ? {
            $push: {
                AuthVoters: helpers.getIp()
            },
            $inc: {
                "poll.$.count": 1
            }
        } : {
            $push: {
                NonAuthVoters: helpers.getIp()
            },
            $inc: {
                "poll.$.count": 1
            }
        };
        Poll.findOneAndUpdate({
            "uniqueId": req.body.pollId,
            "poll.option": req.body.selectedOption
        }, toPush, {
            upsert: true,
            new: true
        }, function(err, updatedDoc) {
            if (err) return res.status(200).send(err);
            console.log(updatedDoc);
            return res.status(200).send(updatedDoc);
        });
    });

    router.get('/create', isAuthenticated, function(req, res) {
        res.render('pages/createPoll', {
            user: req.isAuthenticated() ? req.user : null
        });
    });

    router.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }));

    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/myPolls',
            failureRedirect: '/',
            failureFlash: true
        }));

    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/myPolls',
            failureRedirect: '/'
        }));

    router.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/myPolls',
            failureRedirect: '/'
        }));

    router.get('/delete', function(req, res) {
        User.find({}).remove().exec();
        res.send('done');
    });

    return router;
};
