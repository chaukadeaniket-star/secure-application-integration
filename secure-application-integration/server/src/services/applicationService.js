import { randomUUID } from 'node:crypto';
import { getInternshipById } from './internshipService.js';

const applications = [];

export function createApplication(userId, application) {
  if (!getInternshipById(application.internshipId)) {
    const error = new Error('The selected internship was not found.');
    error.statusCode = 404;
    throw error;
  }
  const existingApplication = applications.find((item) =>
    item.userId === userId
    && item.internshipId === application.internshipId
    && ['pending', 'approved'].includes(item.status)
  );
  if (existingApplication) {
    const error = new Error(
      existingApplication.status === 'approved'
        ? 'You already have an approved application for this internship.'
        : 'You already have a pending application for this internship.'
    );
    error.statusCode = 409;
    throw error;
  }

  const record = {
    id: randomUUID(),
    userId,
    ...application,
    status: 'pending',
    reviewedAt: null,
    createdAt: new Date().toISOString()
  };
  applications.push(record);
  return record;
}

export function listApplicationsForUser(userId) {
  return applications
    .filter((application) => application.userId === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(({ id, name, email, internshipId, status, createdAt, reviewedAt }) => ({
      id, name, email, internshipId, status, createdAt, reviewedAt, internship: getInternshipById(internshipId)
    }));
}

export function listApplicationsForReview() {
  return applications
    .map((application) => ({
      id: application.id,
      name: application.name,
      email: application.email,
      phone: application.phone,
      college: application.college,
      course: application.course,
      skills: application.skills,
      resumeUrl: application.resumeUrl,
      message: application.message,
      portfolioUrl: application.portfolioUrl,
      internshipId: application.internshipId,
      internship: getInternshipById(application.internshipId),
      status: application.status,
      createdAt: application.createdAt,
      reviewedAt: application.reviewedAt
    }));
}

export function reviewApplication(id, status) {
  const application = applications.find((item) => item.id === id);
  if (!application) return null;
  if (application.status !== 'pending') {
    const error = new Error('This application has already been reviewed.');
    error.statusCode = 409;
    throw error;
  }
  application.status = status;
  application.reviewedAt = new Date().toISOString();
  return application;
}
