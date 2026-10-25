export const APPLICATION_LIMITS = {
  name: 80,
  email: 254,
  phone: 24,
  college: 120,
  course: 120,
  skills: 500,
  resumeUrl: 2048,
  portfolioUrl: 2048,
  message: 1200
};

export function validateApplication(values) {
  const errors = {};
  const name = values.name?.trim() ?? '';
  const email = values.email?.trim() ?? '';
  const phone = values.phone?.trim() ?? '';
  const college = values.college?.trim() ?? '';
  const course = values.course?.trim() ?? '';
  const skills = values.skills?.trim() ?? '';
  const resumeUrl = values.resumeUrl?.trim() ?? '';
  const portfolioUrl = values.portfolioUrl?.trim() ?? '';
  const message = values.message?.trim() ?? '';

  if (name.length < 2 || name.length > APPLICATION_LIMITS.name) {
    errors.name = 'Enter a name between 2 and 80 characters.';
  }
  if (email.length > APPLICATION_LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phone.length > APPLICATION_LIMITS.phone || !/^\+?[1-9][\d\s().-]*$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid phone number with 7 to 15 digits.';
  }
  if (college.length < 2 || college.length > APPLICATION_LIMITS.college) {
    errors.college = 'Enter a college name between 2 and 120 characters.';
  }
  if (course.length < 2 || course.length > APPLICATION_LIMITS.course) {
    errors.course = 'Enter a course or degree between 2 and 120 characters.';
  }
  if (skills.length < 2 || skills.length > APPLICATION_LIMITS.skills) {
    errors.skills = 'Enter skills between 2 and 500 characters.';
  }
  if (resumeUrl.length > APPLICATION_LIMITS.resumeUrl || !isHttpUrl(resumeUrl)) {
    errors.resumeUrl = 'Enter a resume URL using http or https.';
  }
  if (portfolioUrl && !isHttpUrl(portfolioUrl)) {
    errors.portfolioUrl = 'Use a valid http or https URL.';
  }
  if (message.length < 20 || message.length > APPLICATION_LIMITS.message) {
    errors.message = 'Your note must be between 20 and 1200 characters.';
  }
  return errors;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
