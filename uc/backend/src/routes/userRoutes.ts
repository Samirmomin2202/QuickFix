import express from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
