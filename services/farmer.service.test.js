import { expect } from "chai"
import Sinon from "sinon"
import { faker } from "@faker-js/faker/locale/en_NG";
import farmerDB from "../data-access/farmer.data_access.js"
import validator from "../utilities/validator.js"
import FarmerService from "../services/farmer.service.js"

describe("Farmer Service", function () {
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
    let sandbox
    beforeEach(function () {
      sandbox = Sinon.createSandbox()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it("should successfully create a farmer record", async function () {

      const farmer = generateRandomFarmer();
      const insertStub = sandbox.stub(farmerDB, "insert").resolves("Record inserted successfully");
      const validateFarmerStub = sandbox.stub(validator, "validateFarmer").returns(farmer);
      expect(await FarmerService.insertFarmer(farmer)).to.equal("Record inserted successfully");
      expect(insertStub.callCount).to.equal(1);
      expect(validateFarmerStub.callCount).to.equal(1);
    })

    it("should throw the error thrown by the validator if validation of farmer input fails", async function () {
      const farmer = generateRandomFarmer();
      const insertSpy = sandbox.spy(farmerDB, "insert");
      const validateFarmerStub = sandbox.stub(validator, "validateFarmer").throws(new Error("err"));
      await FarmerService.insertFarmer(farmer).catch(err => expect(err.message).to.equal("err"));
      expect(validateFarmerStub.callCount).to.equal(1)
      expect(insertSpy.callCount).to.equal(0);
    })

    it("should throw an error if the db could not insert the farmer record", async function () {
      const farmer = generateRandomFarmer();
      const insertStub = sandbox.stub(farmerDB, "insert").throws(new Error("DB error"));
      const validateFarmerSpy = sandbox.spy(validator, "validateFarmer");
      await FarmerService.insertFarmer(farmer).catch(err => expect(err.message).to.equal("DB error"));
      expect(validateFarmerSpy.callCount).to.equal(1)
      expect(insertStub.callCount).to.equal(1);
    })

  })

  describe("#getFarmers()", function () {
    let sandbox
    beforeEach(function () {
      sandbox = Sinon.createSandbox()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it("should successfully retrieve all the farmer records that meets the provided filtering criteria", async function () {
      const farmers = [];
      const len = Math.floor(Math.random() * 20)
      for (let i = 0; i < len; i++) {
        farmers.push(generateRandomFarmer())
      }
      let valPQ = sandbox.stub(validator, "validatePathQuery").returns();
      let getStub = sandbox.stub(farmerDB, "get").returns(farmers)
      expect(await FarmerService.getFarmers({})).to.deep.equal(farmers)
      expect(valPQ.callCount).to.equal(1)
      expect(getStub.callCount).to.equal(1)
    })

    it("should throw the error thrown by the validator if validation of the query arguments fails", async function () {
      const getSpy = sandbox.spy(farmerDB, "get");
      const validatePathQueryStub = sandbox.stub(validator, "validatePathQuery").throws(new Error("val err"));
      await FarmerService.getFarmers({}).catch(err => expect(err.message).to.equal("val err"));
      expect(validatePathQueryStub.callCount).to.equal(1);
      expect(getSpy.callCount).to.equal(0);
    })

    it("should throw an error if the db could not be accessed to retrieve the farmer records", async function () {
      const getStub = sandbox.stub(farmerDB, "get").throws(new Error("DB err"));
      const validatePathQueryStub = sandbox.stub(validator, "validatePathQuery").returns()
      await FarmerService.getFarmers({}).catch(err => expect(err.message).to.equal("DB err"));
      expect(validatePathQueryStub.callCount).to.equal(1);
      expect(getStub.callCount).to.equal(1);
    })

  })
  
})