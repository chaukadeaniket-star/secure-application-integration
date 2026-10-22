export const APPLICATION_LIMITS = {
  name: 80,
  email: 254,
  portfolioUrl: 2048,
  message: 1200
};

export function validateApplication(values) {
  const errors = {};
  const name = values.name?.trim() ?? '';
  const email = values.email?.trim() ?? '';
  const portfolioUrl = values.portfolioUrl?.trim() ?? '';
  const message = values.message?.trim() ?? '';

  if (name.length < 2 || name.length > APPLICATION_LIMITS.name) {
    errors.name = 'Enter a name between 2 and 80 characters.';
  }
  if (email.length > APPLICATION_LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
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
