import express from 'express';
import passport from 'passport';

const router = express.Router();

import getLogger from '../log';
const log = getLogger(module);
import util from 'util';

import mongoose from '../db/mongoose';
import Post from '../model/post';
const pageSize = 10;

router.get('/index/:page', function(req, res) {
	var page = Number(req.params.page);

	Post.find({published : true}).select('-content').limit(pageSize)
    .skip(pageSize * page).sort({ created: -1 }).exec(function (err, posts) {
		if (!err) {
			return res.json(posts);
		} else {
			res.statusCode = 500;

			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.get('/', function(_req, res) {

	Post.find().sort({ created: -1 }).exec(function (err, posts) {
		if (!err) {
			return res.json(posts);
		} else {
			res.statusCode = 500;

			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.get('/:id', function(req, res) {

	Post.findById(req.params.id, function (err, post) {

		if(!post) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				post:post
			});
		} else {
			res.statusCode = 500;
			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.get('/slug/:slug', function(req, res) {
	Post.find({ slug: req.params.slug }, function (err, post) {

		if(!post) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				post: post[0]
			});
		} else {
			res.statusCode = 500;
			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {

	var post = new Post({
		title: req.body.title,
		description: req.body.description,
		content: req.body.content,
		userId: mongoose.Types.ObjectId((req.user as any).id),
		tags: req.body.tags,
		published: req.body.published,
		slug: req.body.slug
	});

	if (req.body.categoryId != null && req.body.categoryId != '')
		post.categoryId = mongoose.Types.ObjectId(req.body.categoryId);

	post.save(function (err) {
		if (!err) {
			log.info(util.format("New post created with id: %s", post.id));
			return res.json({
				status: 'OK',
				post:post
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error.'
				});
			} else if(err.message.startsWith('E11000')) {
				res.statusCode = 400;
				return res.json({
					error: 'Slug must be unique.'
				});
			} else {
				res.statusCode = 500;

				log.error(util.format('Internal error(%d): %s', res.statusCode, err.message));

				res.json({
					error: 'Server error.'
				});
			}
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var postId = req.params.id;

	Post.findById(postId, function (_err, post) {
		if(!post) {
			res.statusCode = 404;
			log.error(util.format('Post with id: %s Not Found', postId));
			return res.json({
				error: 'Not found.'
			});
		}

		post.title = req.body.title;
		post.description = req.body.description;
		post.content = req.body.content;
		post.userId = mongoose.Types.ObjectId((req.user as any).id);
		post.tags = req.body.tags;
		post.published = req.body.published;
		post.slug = req.body.slug;
		post.modified = new Date();

		if (req.body.categoryId != null && req.body.categoryId != '')
			post.categoryId = mongoose.Types.ObjectId(req.body.categoryId);

		post.save(function (err) {
			if (!err) {
				log.info(util.format("Post with id: %s updated", post.id));
				return res.json({
					status: 'OK',
					post:post
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({
						error: 'Validation error.'
					});
				} else if(err.message.startsWith('E11000')) {
					res.statusCode = 400;
					return res.json({
						error: 'Slug must be unique.'
					});
				} else {
					res.statusCode = 500;

					return res.json({
						error: 'Server error.'
					});
				}
			}
		});
	});
});

router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	Post.deleteOne({ _id: req.params.id },function (err) {
		if (!err) {
			log.info(util.format("Post with id: %s deleted", req.params.id));
			return res.json({
				status: 'OK'
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				return res.json({
					error: 'Validation error.'
				});
			} else {
				res.statusCode = 500;

				return res.json({
					error: 'Server error.'
				});
			}
		}
	});
});

export default router;
