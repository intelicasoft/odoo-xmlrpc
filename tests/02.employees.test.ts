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
import { Odoo, MODEL_TYPE, Employees, IEmployee } from "../src";
const expect = chai.expect;

const odooServer = "test-odoo.intelica.mx";
const db = "odoo_test";
const username = "millo@intelica.mx";
const accessKey = "28629e7d1afecbc76c91ba04d6cca754aa4d4a65";
const testEmail = "millo@intelica.mx";
const testPhone = "+593998328746";

describe("Employees", () => {
  const odooCtrl = new Odoo(odooServer);
  let crud: Employees;
  let employeeId: number;

  it("Count registered employees", (done) => {
    odooCtrl
      .authenticate(db, username, accessKey)
      .then(() => {
        crud = odooCtrl.getModelActions(MODEL_TYPE.EMPLOYEES) as Employees;
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

  it("Create employee", (done) => {
    crud
      .create({
        department_id: 1,
        name: "Reinier Millo Sánchez - Test XMLRPC",
        work_phone: "+593998328746",
        work_email: "millo@intelica.mx",
        category_ids: [1, 2]
      })
      .then((value: number) => {
        expect(value).to.be.a("number");
        employeeId = value;
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email", (done) => {
    crud
      .searchByEmail(testEmail)
      .then((value: IEmployee[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.work_email).to.be.a("string").equal(testEmail);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by phone", (done) => {
    crud
      .searchByPhone(testPhone)
      .then((value: IEmployee[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.work_phone).to.be.a("string").equal(testPhone);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email or phone", (done) => {
    crud
      .searchRead(["|", ["work_email", "=", testEmail], ["work_phone", "=", testPhone]])
      .then((value: IEmployee[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect([item.work_email, item.work_phone]).to.include.oneOf([testEmail, testPhone]);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Search by email and phone", (done) => {
    crud
      .searchRead([
        ["work_email", "=", testEmail],
        ["work_phone", "=", testPhone]
      ])
      .then((value: IEmployee[]) => {
        expect(value).to.be.a("array").length.to.be.greaterThanOrEqual(1);
        value.forEach((item) => {
          expect(item.work_email).to.be.a("string").equal(testEmail);
          expect(item.work_phone).to.be.a("string").equal(testPhone);
        });
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Read by ID", (done) => {
    crud
      .read([employeeId])
      .then((value: IEmployee[]) => {
        expect(value).to.be.a("array");
        expect(value.length).to.be.equal(1);
        expect(value[0].work_email).to.be.a("string").equal(testEmail);
        expect(value[0].work_phone).to.be.a("string").equal(testPhone);
        done();
      })
      .catch(done);
  }).timeout(20000);

  it("Update employee", (done) => {
    crud
      .update(employeeId, { name: "New name" })
      .then((updated: boolean) => {
        expect(updated).to.be.a("boolean").equal(true);
        crud
          .read([employeeId])
          .then((value: IEmployee[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(1);
            expect(value[0].name).to.be.a("string").equal("New name");
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);

  it("Delete employee", (done) => {
    crud
      .delete(employeeId)
      .then((deleted: boolean) => {
        expect(deleted).to.be.a("boolean").equal(true);
        crud
          .read([employeeId])
          .then((value: IEmployee[]) => {
            expect(value).to.be.a("array");
            expect(value.length).to.be.equal(0);
            done();
          })
          .catch(done);
      })
      .catch(done);
  }).timeout(20000);
});
