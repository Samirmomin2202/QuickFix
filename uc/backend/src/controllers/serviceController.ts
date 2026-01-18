import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Service from '../models/Service';
import Category from '../models/Category';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { category, featured, minPrice, maxPrice, search, sort } = req.query;

  let query: any = { isActive: true };

  // Filter by category (handle both category name and ObjectId)
  if (category) {
    // Check if it's a valid ObjectId or a category name/slug
    if (category.toString().match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId
      query.category = category;
    } else {
      // It's a category name or slug, look up the category ID
      const categoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${category}$`, 'i') } },
          { slug: category }
        ]
      });
      
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category not found, return empty results instead of error
        res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
        return;
      }
    }
  }

  // Filter by featured
  if (featured === 'true') {
    query.isFeatured = true;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Search by name
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  let servicesQuery = Service.find(query).populate('category', 'name icon');

  // Sorting
  if (sort === 'price_asc') {
    servicesQuery = servicesQuery.sort({ price: 1 });
  } else if (sort === 'price_desc') {
    servicesQuery = servicesQuery.sort({ price: -1 });
  } else if (sort === 'rating') {
    servicesQuery = servicesQuery.sort({ rating: -1 });
  } else {
    servicesQuery = servicesQuery.sort({ createdAt: -1 });
  }

  const services = await servicesQuery;

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findById(req.params.id)
    .populate('category', 'name icon')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name profileImage' }
    });

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Get services by category
// @route   GET /api/services/category/:categoryId
// @access  Public
export const getServicesByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const services = await Service.find({ 
    category: req.params.categoryId, 
    isActive: true 
  }).populate('category', 'name icon');

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
