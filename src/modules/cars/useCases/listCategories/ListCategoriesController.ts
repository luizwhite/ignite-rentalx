import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

class ListCategoriesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    try {
      const allCategories = await listCategoriesUseCase.execute();

      return res.json(allCategories);
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
}

export { ListCategoriesController };
