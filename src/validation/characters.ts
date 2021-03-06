import { query, param } from 'express-validator';

const getChars = [
  query('perPage')
    .optional()
    .isInt({ lt: 51, gt: 0 })
    .withMessage('Max 50 characters per page allowed'),

  query('page')
    .optional()
    .isInt({ lt: 51, gt: 0 })
    .withMessage('Only page 1 to 50 are available')
];

const getOne = [
  param('name')
    .isString()
    .withMessage('Invalid Character name')
    .isLength({ min: 1, max: 10 })
    .withMessage('Character name can only be between 1-10 characters')
];

const search = [
  param('name')
    .isString()
    .withMessage('Invalid Character name')
    .isLength({ min: 1, max: 10 })
    .withMessage('Character name can only be between 1-10 characters'),

  query('limit')
    .optional()
    .isInt({ lt: 51, gt: 0 })
    .withMessage('Max 50 characters per page allowed'),

  query('offset')
    .optional()
    .isInt({ lt: 51, gt: 0 })
    .withMessage('Only page 1 to 50 are available')
];

export default {
  getChars,
  getOne,
  search
};
