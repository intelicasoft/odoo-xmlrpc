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
import { Odoo, MODEL_TYPE, Contacts, IContact } from "../src";
const expect = chai.expect;

const odooServer = "test-odoo.intelica.mx";
const db = "odoo_test";
const username = "millo@intelica.mx";
const accessKey = "28629e7d1afecbc76c91ba04d6cca754aa4d4a65";
const testEmail = "millo@intelica.mx";
const testPhone = "+593998328746";

describe("Contacts", () => {
  const odooCtrl = new Odoo(odooServer);
  let crud: Contacts;
  let contactId: number;

  it("Count registered contacts", (done) => {
    odooCtrl
      .authenticate(db, username, accessKey)
      .then(() => {
        crud = odooCtrl.getModelActions(MODEL_TYPE.CONTACTS) as Contacts;
        crud
          .count()
          .then((value: any) => {
            expect(value).to.be.a("number");
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);

  it("Create contact", (done) => {
    crud
      .create({
        name: "Reinier Millo Sánchez - Test XMLRPC",
        phone: "+593998328746",
        email: "millo@intelica.mx",
        ref: "SampleXMLRPC",
        category_id: [1, 2]
      })
      .then((value: number) => {
        expect(value).to.be.a("number");
        contactId = value;
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email", (done) => {
    crud
      .searchByEmail(testEmail)
      .then((value: IContact[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.email).to.be.a("string").equal(testEmail);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by phone", (done) => {
    crud
      .searchByPhone(testPhone)
      .then((value: IContact[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.phone).to.be.a("string").equal(testPhone);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email or phone", (done) => {
    crud
      .searchRead(["|", ["email", "=", testEmail], ["phone", "=", testPhone]])
      .then((value: IContact[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect([item.email, item.phone]).to.include.oneOf([testEmail, testPhone]);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email and phone", (done) => {
    crud
      .searchRead([
        ["email", "=", testEmail],
        ["phone", "=", testPhone]
      ])
      .then((value: IContact[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.email).to.be.a("string").equal(testEmail);
          expect(item.phone).to.be.a("string").equal(testPhone);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Read by ID", (done) => {
    crud
      .read([contactId])
      .then((value: IContact[]) => {
        expect(value).to.be.a("array");
        expect(value.length).to.be.equal(1);
        expect(value[0].email).to.be.a("string").equal(testEmail);
        expect(value[0].phone).to.be.a("string").equal(testPhone);
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Update contact", (done) => {
    crud
      .update(contactId, { name: "New name" })
      .then((updated: boolean) => {
        expect(updated).to.be.a("boolean").equal(true);
        crud
          .read([contactId])
          .then((value: IContact[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(1);
            expect(value[0].name).to.be.a("string").equal("New name");
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);

  it("Delete contact", (done) => {
    crud
      .delete(contactId)
      .then((deleted: boolean) => {
        expect(deleted).to.be.a("boolean").equal(true);
        crud
          .read([contactId])
          .then((value: IContact[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(0);
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);
});
