/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { MODEL_TYPE, IContact } from "../models/odoo.types";
import { Odoo } from "./odoo";
import { OdooCRUD } from "./odoo.crud";

export class Contacts extends OdooCRUD<IContact> {
  constructor(odoo: Odoo) {
    super(MODEL_TYPE.CONTACTS, odoo);
    this._keys = ["id", "name", "phone", "email", "ref"];
  }

  public create(value: IContact): Promise<number> {
    if (value.category_id && value.category_id.length > 0) {
      value.category_id = [[6, 0, value.category_id]];
    }
    return super.create(value);
  }

  searchByEmail(email: string): Promise<IContact[]> {
    return this.searchRead([["email", "=", email]]);
  }

  searchByPhone(phone: string): Promise<IContact[]> {
    return this.searchRead([["phone", "=", phone]]);
  }
}
