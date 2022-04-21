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
import { Odoo, MODEL_TYPE, Leads, ILead } from "../src";
const expect = chai.expect;

const odooServer = "test-odoo.intelica.mx";
const db = "odoo_test";
const username = "millo@intelica.mx";
const accessKey = "28629e7d1afecbc76c91ba04d6cca754aa4d4a65";
const testEmail = "millo@intelica.mx";
const testPhone = "+593998328746";

describe("Leads", () => {
  const odooCtrl = new Odoo(odooServer);
  let crud: Leads;
  let leadId: number;

  it("Count registered leads", (done) => {
    odooCtrl
      .authenticate(db, username, accessKey)
      .then(() => {
        crud = odooCtrl.getModelActions(MODEL_TYPE.LEAD_OPPORTUNITY) as Leads;
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

  it("Create lead", (done) => {
    crud
      .create({
        name: "Nuevo lead de prueba",
        contact_name: "Reinier Millo",
        partner_id: 2,
        email_from: testEmail,
        phone: testPhone,
        description: "Acerca del lead\nLinea 2",
        source_id: 1,
        user_id: 2,
        team_id: 2,
        tag_ids: [1, 2],
        type: "lead"
      })
      .then((value: number) => {
        expect(value).to.be.a("number");
        leadId = value;
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Create opportunity", (done) => {
    crud
      .create({
        name: "Nueva oportunidad de prueba",
        contact_name: "Reinier Millo",
        partner_id: 2,
        email_from: testEmail,
        phone: testPhone,
        description: "Acerca del lead\nLinea 2",
        source_id: 1,
        user_id: 2,
        team_id: 2,
        tag_ids: [1, 2],
        type: "opportunity"
      })
      .then((value: number) => {
        expect(value).to.be.a("number");
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email", (done) => {
    crud
      .searchByEmail(testEmail)
      .then((value: ILead[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.email_from).to.be.a("string").equal(testEmail);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by phone", (done) => {
    crud
      .searchByPhone(testPhone)
      .then((value: ILead[]) => {
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
      .searchRead(["|", ["email_from", "=", testEmail], ["phone", "=", testPhone]])
      .then((value: ILead[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect([item.email_from, item.phone]).to.include.oneOf([testEmail, testPhone]);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email and phone", (done) => {
    crud
      .searchRead([
        ["email_from", "=", testEmail],
        ["phone", "=", testPhone]
      ])
      .then((value: ILead[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.email_from).to.be.a("string").equal(testEmail);
          expect(item.phone).to.be.a("string").equal(testPhone);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Read by ID", (done) => {
    crud
      .read([leadId])
      .then((value: ILead[]) => {
        expect(value).to.be.a("array");
        expect(value.length).to.be.equal(1);
        expect(value[0].email_from).to.be.a("string").equal(testEmail);
        expect(value[0].phone).to.be.a("string").equal(testPhone);
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Update lead", (done) => {
    crud
      .update(leadId, { name: "New name" })
      .then((updated: boolean) => {
        expect(updated).to.be.a("boolean").equal(true);
        crud
          .read([leadId])
          .then((value: ILead[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(1);
            expect(value[0].name).to.be.a("string").equal("New name");
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);

  it("Delete lead", (done) => {
    crud
      .delete(leadId)
      .then((deleted: boolean) => {
        expect(deleted).to.be.a("boolean").equal(true);
        crud
          .read([leadId])
          .then((value: ILead[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(0);
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);
});
