import FarmerController from "./farmer.controller.js";
import { expect } from "chai"; 
import Sinon from "sinon";
import FarmerService from "../services/farmer.service.js";
import { faker } from "@faker-js/faker/locale/en_NG";

describe("Farmer Controller", function () {
  const generateRandomFarmer = () => {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone_number: faker.phone.number(),
      age: faker.number.int({min: 18, max: 80}),
      address: faker.location.city(),
      crops: faker.helpers.arrayElements(["maize", "yam", "cassava", "potato", "cereal"])
    }
  }

  describe("#insertFarmer()", function () {
    let status, res, json, sandbox, next
    this.beforeEach(() => {
      sandbox = Sinon.createSandbox()
      status = sandbox.stub()
      json = sandbox.spy()
      res = { status, json }
      status.returns(res)
      next = sandbox.fake()
    })

    this.afterEach(() => {
      sandbox.restore()
    })

    it("should successfully insert a farmer record into the DB", async function () {
      const req = { body: generateRandomFarmer() }
      const serviceInsertStub = sandbox.stub(FarmerService, "insertFarmer").returns("Record inserted successfully");
      await FarmerController.insertFarmer(req, res, next);
      expect(serviceInsertStub.calledOnceWithExactly(req.body)).to.be.true
      expect(status.calledOnceWithExactly(201)).to.be.true;
      expect(json.calledOnceWithExactly({message: "Record inserted successfully"})).to.be.true
      expect(next.callCount).to.equal(0)
    })

    it("should fail if a farmer record could not be inserted into the DB", async function () {
      const req = { body: {} }
      const serviceInsertStub = sandbox.stub(FarmerService, "insertFarmer").throws(new Error("service error"));
      await FarmerController.insertFarmer(req, res, next);
      expect(serviceInsertStub.callCount).to.equal(1)
      expect(status.callCount).to.equal(0);
      expect(json.callCount).to.equal(0)
      expect(next.callCount).to.equal(1)
    })

  })

  describe("#getFarmers()", function () {
    let status, res, json, sandbox, next
    this.beforeEach(() => {
      sandbox = Sinon.createSandbox()
      status = sandbox.stub()
      json = sandbox.spy()
      res = { status, json }
      status.returns(res)
      next = sandbox.fake()
    })

    this.afterEach(() => {
      sandbox.restore()
    })

    it("should successfully retrieve all farmer records from a populated DB", async function () {
      const req = { query: {} }
      const farmers = [];
      const len = Math.floor(Math.random() * 20) + 1
      for (let i = 0; i < len; i++) {
        farmers.push(generateRandomFarmer())
      }
      const serviceGetStub = sandbox.stub(FarmerService, "getFarmers").returns(farmers);
      await FarmerController.getFarmers(req, res, next);
      expect(serviceGetStub.calledOnceWithExactly(req.query)).to.be.true
      expect(status.calledOnceWithExactly(200)).to.be.true;
      expect(json.calledOnceWithExactly({farmers, message: "Records retrieved successfully"})).to.be.true
      expect(next.callCount).to.equal(0)
    })

    it("should successfully access the DB and if the user if no matching record is found", async function () {
      const req = { query: {} }
      const serviceGetStub = sandbox.stub(FarmerService, "getFarmers").returns([]);
      await FarmerController.getFarmers(req, res, next);
      expect(serviceGetStub.callCount).to.equal(1)
      expect(status.calledOnceWithExactly(404)).to.be.true;
      expect(json.calledOnceWithExactly({farmers: [], message: "No record found"})).to.be.true
      expect(next.callCount).to.equal(0)
    })

    it("should fail if the farmer records could not be retrieved from the DB", async function () {
      const req = { body: {} }
      const serviceGetStub = sandbox.stub(FarmerService, "getFarmers").throws(new Error("service error"));
      await FarmerController.getFarmers(req, res, next);
      expect(serviceGetStub.callCount).to.equal(1)
      expect(status.callCount).to.equal(0);
      expect(json.callCount).to.equal(0)
      expect(next.callCount).to.equal(1)
    })
  })

})