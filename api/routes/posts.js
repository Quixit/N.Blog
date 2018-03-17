var express = require('express');
var passport = require('passport');
var router = express.Router();

var log = require('../log')(module);

var db = require('../db/mongoose');
var Post = require('../model/post');

router.get('/', function(req, res) {

	Post.find(function (err, posts) {
		if (!err) {
			return res.json(posts);
		} else {
			res.statusCode = 500;

			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.get('/:id', function(req, res) {

	Post.findById(req.params.id, function (err, post) {

		if(!post) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				post:post
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	var post = new Post({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	post.save(function (err) {
		if (!err) {
			log.info("New post created with id: %s", post.id);
			return res.json({
				status: 'OK',
				post:post
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error'
				});
			} else {
				res.statusCode = 500;

				log.error('Internal error(%d): %s', res.statusCode, err.message);

				res.json({
					error: 'Server error'
				});
			}
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var postId = req.params.id;

	Post.findById(postId, function (err, post) {
		if(!post) {
			res.statusCode = 404;
			log.error('Post with id: %s Not Found', postId);
			return res.json({
				error: 'Not found'
			});
		}

		post.title = req.body.title;
		post.description = req.body.description;
		post.author = req.body.author;
		post.images = req.body.images;

		post.save(function (err) {
			if (!err) {
				log.info("Post with id: %s updated", post.id);
				return res.json({
					status: 'OK',
					post:post
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error'
					});
				}
				log.error('Internal error (%d): %s', res.statusCode, err.message);
			}
		});
	});
});

module.exports = router;
