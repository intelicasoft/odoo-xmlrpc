/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */

/* Export api controllers*/
export { Odoo } from "./controllers/odoo";
export { OdooCRUD } from "./controllers/odoo.crud";
export { MODEL_TYPE, IServerVersion, IContact, ILead, IEmployee, ICategory } from "./models/odoo.types";

/* Export api controller for Odoo models */
export { Contacts } from "./controllers/contacts.odoo";
export { Leads } from "./controllers/leads.odoo";
export { Employees } from "./controllers/employees.odoo";
export { Categories } from "./controllers/categories.odoo";

/* Export models */
export { ERRORS } from "./constants/errors.enum";
