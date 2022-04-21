/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { MODEL_TYPE, ILead } from "../models/odoo.types";
import { Odoo } from "./odoo";
import { OdooCRUD } from "./odoo.crud";

export class Leads extends OdooCRUD<ILead> {
  constructor(odoo: Odoo) {
    super(MODEL_TYPE.LEAD_OPPORTUNITY, odoo);
    this._keys = [
      "id",
      "name",
      "partner_id",
      "contact_name",
      "email_from",
      "phone",
      "description",
      "source_id",
      "user_id",
      "team_id",
      "tag_ids"
    ];
  }

  searchByEmail(email: string): Promise<ILead[]> {
    return this.searchRead([["email_from", "=", email]]);
  }

  searchByPhone(phone: string): Promise<ILead[]> {
    return this.searchRead([["phone", "=", phone]]);
  }
}
