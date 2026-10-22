import { getInternshipById, listInternshipCategories, listInternships } from '../services/internshipService.js';

export function getInternships(req, res) {
  const search = typeof req.query.search === 'string' ? req.query.search.slice(0, 100) : '';
  const location = typeof req.query.location === 'string' ? req.query.location.slice(0, 100) : '';
  const category = typeof req.query.category === 'string' ? req.query.category.slice(0, 100) : '';
  const data = listInternships({ search, location, category });
  res.json({ data, meta: { count: data.length, categories: listInternshipCategories() }, requestId: req.id });
}

export function getInternship(req, res, next) {
  const internship = getInternshipById(req.params.id);
  if (!internship) {
    const error = new Error('Internship not found.');
    error.statusCode = 404;
    return next(error);
  }
  return res.json({ data: internship, requestId: req.id });
}
