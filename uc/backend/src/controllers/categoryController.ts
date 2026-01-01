import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/Category';
import ErrorResponse from '../utils/errorResponse';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get all categories (including inactive)
// @route   GET /api/categories/all
// @access  Private/Admin
export const getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find().sort({ displayOrder: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id).populate('services');

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
