/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import { Odoo } from "./odoo";

export class OdooCRUD<T> {
  private _model: string;
  private _odoo: Odoo;
  protected _keys: string[];

  constructor(model: string, odoo: Odoo, keys: string[] = []) {
    this._model = model;
    this._odoo = odoo;
    this._keys = keys;
  }

  public count(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const params: any[] = [this._model, "search_count", [[]]];
      this._odoo
        .callRPC(params)
        .then((value: any) => {
          resolve(value);
        })
        .catch(reject);
    });
  }

  public create(value: T): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const params: any[] = [this._model, "create", [value]];
      this._odoo
        .callRPC(params)
        .then((value: any) => {
          resolve(value);
        })
        .catch(reject);
    });
  }

  public searchRead(query: any[], limit = 10): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const params: any[] = [
        this._model,
        "search_read",
        [query],
        { fields: this._keys, limit: limit }
      ];
      this._odoo
        .callRPC(params)
        .then((value: any) => {
          resolve(value);
        })
        .catch(reject);
    });
  }

  public read(ids: number[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const params: any[] = [this._model, "read", ids, { fields: this._keys }];
      this._odoo
        .callRPC(params)
        .then((value: any) => {
          resolve(value);
        })
        .catch(reject);
    });
  }

  public update(id: number, data: T): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const params: any[] = [this._model, "write", [[id], data]];
      this._odoo
        .callRPC(params)
        .then((value: boolean) => {
          resolve(value);
        })
        .catch(reject);
    });
  }

  public delete(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const params: any[] = [this._model, "unlink", [[id]]];
      this._odoo
        .callRPC(params)
        .then((value: boolean) => {
          resolve(value);
        })
        .catch(reject);
    });
  }
}
