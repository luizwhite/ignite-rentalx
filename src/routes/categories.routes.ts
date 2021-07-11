import { Router } from 'express';

import { CategoriesRepository } from '../repositories/CategoriesRepository';

const categoriesRoutes = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get('/', (req, res) => {
  const allCategories = categoriesRepository.list();

  return res.json(allCategories);
});

categoriesRoutes.post('/', (req, res) => {
  const { name, description } = req.body;

  const categoryFound = categoriesRepository.findByName(name);
  if (categoryFound)
    return res.status(400).json({ error: 'Category already exists!' });

  categoriesRepository.create({ name, description });

  return res.status(201).send();
});

export { categoriesRoutes };
