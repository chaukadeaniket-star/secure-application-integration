import { internships } from '../data/internships.js';

export function listInternships({ search = '', location = '', category = '' } = {}) {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();
  return internships.filter((internship) => {
    const searchable = `${internship.title} ${internship.company} ${internship.category} ${internship.description} ${internship.skills.join(' ')}`.toLowerCase();
    return (!normalizedSearch || searchable.includes(normalizedSearch))
      && (!normalizedLocation || internship.location.toLowerCase().includes(normalizedLocation))
      && (!normalizedCategory || internship.category.toLowerCase() === normalizedCategory);
  });
}

export function listInternshipCategories() {
  return [...new Set(internships.map((internship) => internship.category))].sort();
}

export function getInternshipById(id) {
  return internships.find((internship) => internship.id === id) || null;
}
