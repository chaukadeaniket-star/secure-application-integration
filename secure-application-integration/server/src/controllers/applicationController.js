import {
  createApplication,
  listApplicationsForReview,
  listApplicationsForUser,
  reviewApplication
} from '../services/applicationService.js';

export function submitApplication(req, res, next) {
  try {
    const application = createApplication(req.user.id, req.validatedBody);
    return res.status(201).json({
      data: {
        id: application.id,
        internshipId: application.internshipId,
        status: application.status,
        createdAt: application.createdAt
      },
      requestId: req.id
    });
  } catch (error) {
    return next(error);
  }
}

export function getMyApplications(req, res) {
  return res.json({ data: listApplicationsForUser(req.user.id), requestId: req.id });
}

export function getApplicationsForReview(req, res) {
  return res.json({ data: listApplicationsForReview(), requestId: req.id });
}

export function reviewApplicationStatus(req, res) {
  const { status } = req.body || {};
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Review status must be approved or rejected.' },
      requestId: req.id
    });
  }
  const application = reviewApplication(req.params.id, status);
  if (!application) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Application not found.' },
      requestId: req.id
    });
  }
  return res.json({
    data: { id: application.id, status: application.status, reviewedAt: application.reviewedAt },
    requestId: req.id
  });
}
