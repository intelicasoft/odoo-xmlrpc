/**
 * Copyright (C) 2022 Intelica. Scientific and Software Solutions
 * Author: Reinier Millo Sánchez <millo@intelica.mx>
 *
 * This file is part of the @intelica/odoo-xmlrpc package.
 * This project is distributed under MIT License.
 * Check LICENSE file in project root folder.
 */
import "mocha";
import chai from "chai";
import { Odoo, IServerVersion } from "../src";
const expect = chai.expect;

const odooServer = "test-odoo.intelica.mx";
const db = "odoo_test";
const username = "millo@intelica.mx";
const accessKey = "28629e7d1afecbc76c91ba04d6cca754aa4d4a65";

describe("Odoo XMLRPC Protocol", () => {
  it("Check Odoo Version 14.0", (done) => {
    const odooCtrl = new Odoo(odooServer);
    odooCtrl
      .version()
      .then((value: IServerVersion) => {
        expect(value.protocol_version).to.equal(1);
        expect(value.server_serie).to.equal("14.0");
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Autenticate user account", (done) => {
    const odooCtrl = new Odoo(odooServer);
    odooCtrl
      .authenticate(db, username, accessKey)
      .then((value: any) => {
        expect(value).to.be.a("number");
        done();
      })
      .catch(done);
  }).timeout(20000);
});
