import express from 'express';
import passport from 'passport';
const router = express.Router();

import getLogger from '../log'
const log = getLogger(module);

import util from 'util';

import mongoose from '../db/mongoose';
import CategoryModel, { CategoryDocument } from '../model/category';
import Post from '../model/post';

router.get('/', function(_req, res) {

	CategoryModel.find().sort({ name: 1 }).exec(function (err, categorys) {
		if (!err) {
			return res.json(categorys);
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

	CategoryModel.findById(req.params.id, function (err, category) {

		if(!category) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found.'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				category:category
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

	var category = new CategoryModel({
		name: req.body.name,
		description: req.body.description
	});

	category.save(function (err) {
		if (!err) {
			log.info(util.format("New category created with id: %s", category.id));
			return res.json({
				status: 'OK',
				category:category
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
					error: 'Name must be unique.'
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
	var categoryId = req.params.id;

	CategoryModel.findById(categoryId, function (_err: Error, category: CategoryDocument) {
		if(!category) {
			res.statusCode = 404;
			log.error(util.format('Category with id: %s Not Found', categoryId));
			return res.json({
				error: 'Not found.'
			});
		}

		category.name = req.body.name;
		category.description = req.body.description;

		category.save(function (err: Error) {
			if (!err) {
				log.info(util.format("Category with id: %s updated", category.id));
				return res.json({
					status: 'OK',
					category:category
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
						error: 'Name must be unique.'
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
	let queryId = mongoose.Types.ObjectId(req.params.id);

	Post.find({ categoryId : queryId},function (err, posts) {
		if (!err) {
			for (var i = 0; i < posts.length; i++)
			{
				posts[i].categoryId = null;
				posts[i].save(function (err) {
					if (!err) {
						log.info(util.format("Post with id: %s category removed.", queryId));
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
			}

			CategoryModel.deleteOne({ _id: req.params.id },function (err) {
				if (!err) {
					log.info(util.format("Category with id: %s deleted", queryId));
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
		} else {
			res.statusCode = 500;

			log.error(util.format('Internal error(%d): %s',res.statusCode,err.message));

			return res.json({
				error: 'Server error.'
			});
		}
	});


});

export default router;
