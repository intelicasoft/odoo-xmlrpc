/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */

export enum MODEL_TYPE {
  CONTACTS = "res.partner",
  LEAD_OPPORTUNITY = "crm.lead",
  EMPLOYEES = "hr.employee"
}

export interface IServerVersion {
  server_version: string;
  server_version_info: any[];
  server_serie: string;
  protocol_version: number;
}

export interface IContact {
  name?: string;
  phone?: string;
  email?: string;
  ref?: string;
  category_id?: any[];
}

export interface ILead {
  name?: string;
  partner_id?: number;
  contact_name?: string;
  email_from?: string;
  phone?: string;
  description?: string;
  source_id?: number;
  user_id?: number;
  team_id?: number;
  tag_ids?: number[];
  type?: "lead" | "opportunity";
}

export interface IEmployee {
  department_id?: number;
  name?: string;
  work_email?: string;
  work_phone?: string;
  category_ids?: any[];
}
