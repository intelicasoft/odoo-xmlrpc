/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { IServerVersion, MODEL_TYPE } from "../models/odoo.types";
import { createSecureClient, Client } from "xmlrpc";
import { ERRORS } from "../constants/errors.enum";
import { Contacts } from "./contacts.odoo";
import { Employees } from "./employees.odoo";
import { Leads } from "./leads.odoo";

export class Odoo {
  private _client: Client;
  private _uid: number;
  private _db: string;
  private _password: string;

  constructor(host: string, port = 443) {
    this._client = createSecureClient({
      host: host,
      port: port
    });
  }

  private _commonPath() {
    this._client.options.path = "/xmlrpc/2/common";
  }

  private _objectPath() {
    this._client.options.path = "/xmlrpc/2/object";
  }

  public version(): Promise<IServerVersion> {
    return new Promise<IServerVersion>((resolve, reject) => {
      this._commonPath();

      this._client.methodCall("version", [], (error, value) => {
        error ? reject(error) : resolve(value);
      });
    });
  }

  public authenticate(db: string, username: string, password: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._db = db;
      this._password = password;

      this._commonPath();

      this._client.methodCall("authenticate", [db, username, password, {}], (error, value) => {
        if (error) {
          return reject(error);
        }
        if (!value) {
          return reject({ boError: ERRORS.INVALID_CREDENTIALS });
        }
        this._uid = value;
        resolve(value);
      });
    });
  }

  public callRPC(params: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._objectPath();
      const opts = [this._db, this._uid, this._password, ...params];
      this._client.methodCall("execute_kw", opts, (error, value) => {
        error ? reject(error) : resolve(value);
      });
    });
  }

  public getModelActions(model: string): Contacts | Leads | Employees {
    switch (model) {
      case MODEL_TYPE.CONTACTS:
        return new Contacts(this);
      case MODEL_TYPE.LEAD_OPPORTUNITY:
        return new Leads(this);
      case MODEL_TYPE.EMPLOYEES:
        return new Employees(this);
    }
    throw new Error("Invalid model type");
  }
}
