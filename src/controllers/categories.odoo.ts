/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { MODEL_TYPE, ICategory } from "../models/odoo.types";
import { Odoo } from "./odoo";
import { OdooCRUD } from "./odoo.crud";

export class Categories extends OdooCRUD<ICategory> {
  constructor(odoo: Odoo) {
    super(MODEL_TYPE.CATEGORIES, odoo);
    this._keys = ["id", "name"];
  }

  create(value: ICategory): Promise<number> {
    return super.create(value);
  }

  searchById(id: number): Promise<ICategory[]> {
    return this.searchRead([["id", "=", id]]);
  }

  searchByName(name: string): Promise<ICategory[]> {
    return this.searchRead([["name", "=", name]]);
  }
}
