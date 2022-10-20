/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { MODEL_TYPE, IEmployee } from "../models/odoo.types";
import { Odoo } from "./odoo";
import { OdooCRUD } from "./odoo.crud";

export class Employees extends OdooCRUD<IEmployee> {
  constructor(odoo: Odoo) {
    super(MODEL_TYPE.EMPLOYEES, odoo);
    this._keys = ["id", "department_id", "name", "work_phone", "work_email", "category_ids"];
  }

  searchByEmail(email: string): Promise<IEmployee[]> {
    return this.searchRead([["work_email", "=", email]]);
  }

  searchByPhone(phone: string): Promise<IEmployee[]> {
    return this.searchRead([["work_phone", "=", phone]]);
  }
}
