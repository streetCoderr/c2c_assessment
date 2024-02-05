import { expect } from "chai";
import generateRetrievalQueryParams from "./generateRetrievalQuery.js"
import { BadRequestError } from "./error.js";
import Sinon from "sinon";
import validator from "./validator.js";
import { ZodError } from "zod";

describe("Utilites", function () {
  describe("#generateRetrievalQueryParams()", function () {
    it("should return an object where fields property = `*` when the argument object's field property is missing/undefined, null, or an empty string", function () {
      const obj = {
        filters: "age:20,crops:yam-maize",
      }
      expect(generateRetrievalQueryParams(obj).fields, "should equal '*' because `fields` is missing").to.equal("*");
      obj.fields = null,
      expect(generateRetrievalQueryParams(obj).fields, "should equal '*' because `fields` is null").to.equal("*");
      obj.fields = ""
      expect(generateRetrievalQueryParams(obj).fields, "should equal '*' because `fields` equal empty string").to.equal("*");
    })

    it("return an object where the `fields` property is equal to the value of the field argument (if provided)", function () {
      const obj = {
        fields: "id,first_name,age",
        filters: "age:20,crops:yam-maize",
      }
      expect(generateRetrievalQueryParams(obj).fields).to.equal(obj.fields);
    })

    it("should return an empty string if the argument obj does not contain the filters property", function () {
      const obj = {
        fields: "first_name"
      }
      const res = generateRetrievalQueryParams(obj);
      expect(res.filters).to.equal("")
    })

    it("should throw bad request error on wrong age input format for filters", function () {
      const obj = {
        filters: "age:20-30-40"
      }
      expect(() => generateRetrievalQueryParams(obj))
        .to
        .throw(BadRequestError, "Please specify the age to match properly")
        .with.property("statusCode", 400)
    })

    it("should throw an error if the lower or upper bound of the age range (if provided in the filter) is not an integer", function () {
      const obj = {
        filters: "age:2h-p"
      }

      expect(() => generateRetrievalQueryParams(obj))
        .to
        .throw(BadRequestError, "Please insert a valid age range")
        .with.property("statusCode", 400)
    })

    it("should throw an error if the exact age filter (if provided in the filter) is not an integer", function () {
      const obj = {
        filters: "age:4h"
      }

      expect(() => generateRetrievalQueryParams(obj))
        .to
        .throw(BadRequestError, "Please insert a valid age")
        .with.property("statusCode", 400)
    })
    
    it("should call `forEach` twice if provided crops filter is specified by user and is not empty", function () {
      const forEachSpy = Sinon.spy(Array.prototype, "forEach");
      const obj = {
        filters: "crops:yam-maize"
      }
      generateRetrievalQueryParams(obj)
      expect(forEachSpy.callCount).to.equal(2)
      forEachSpy.restore()
    })

    it("should call `forEach` only once if provided crops filter is specified by user but is empty", function () {
      const forEachSpy = Sinon.spy(Array.prototype, "forEach");
      const obj = {
        filters: "crops:"
      }
      generateRetrievalQueryParams(obj)
      expect(forEachSpy.callCount).to.equal(1)
      forEachSpy.restore()
    })

    it("should push no query to the filters array for the `address` field if provided", function () {
      const pushSpy = Sinon.spy(Array.prototype, "push");
      const obj = {
        filters: "address:lagos"
      }
      generateRetrievalQueryParams(obj)
      expect(pushSpy.callCount).to.equal(0)
      pushSpy.restore()
    })

    it("should return an object that contains the right DB query paramters based on the provided argument", function () {
      const obj = {
        fields: "id,first_name,age",
        filters:"first_name:Jimoh,age:31,crops:yam-maize-cassava"
      }
      const res = generateRetrievalQueryParams(obj)
      expect(res.fields, "The fields property should contain exactly the provided field argument").to.equal("id,first_name,age")
      expect(res.filters, "The filters property should contain the filter string").to.equal(" WHERE first_name = $1 AND age = $2 AND crops && $3")
      expect(res.parameters, "The parameters property should contain the parameters of the parameterized query in the right order").to.deep.equal(["Jimoh", 31, ["yam", "maize", "cassava"]])
    })
  })


  describe("#validateFarmer", function () {

    it("should throw a ZodError if the object provided is empty", function () {
      expect(() => validator.validateFarmer({})).to.throw(ZodError)
    })

    it("should throw a ZodError if a rquired field is not provided in the object argument", function () {
      const obj = {
        first_name: "Jimoh",
        phone_number: "081223145526",
        age: 31,
        address: "Lagos",
        crops: ["cassava", "orange"]
      }
      expect(() => validator.validateFarmer(obj)).to.throw(ZodError)
    })

    it("should throw a ZodError if the age field is neither an integer or convertible to one", function () {
      const obj = {
        first_name: "Jimoh",
        last_name: "Mike",
        phone_number: "081223145526",
        age: "31.5h",
        address: "Lagos",
        crops: ["cassava", "orange"]
      }
      expect(() => validator.validateFarmer(obj)).to.throw(ZodError)
    })

    it("should throw a ZodError if the crops field is not strictly an array of strings", function () {
      const obj = {
        first_name: "Jimoh",
        last_name: "Mike",
        phone_number: "081223145526",
        age: "31",
        address: "Lagos",
        crops: ["cassava", 10]
      }
      expect(() => validator.validateFarmer(obj)).to.throw(ZodError)
    })


    it("should parse the argument, carry out coercion where necessary and return an appropriate Farmer object", function () {
      const obj = {
        first_name: "Jimoh",
        last_name: "Mike",
        phone_number: "081223145526",
        age: "31",
        address: "Lagos",
        crops: ["cassava", "orange"]
      }
      const res = validator.validateFarmer(obj)
      obj.age = Number(obj.age);
      expect(res).to.deep.equal(obj)
    })
  })
    

  describe("#validatePathQuery", function () {

    it("should not throw error if the object argument is empty", function () {
      expect(() => validator.validatePathQuery({})).to.not.throw(BadRequestError)
    })

    it("should not throw error if the fields property of the argument contains only valid Farmer attributes", function () {
      const obj = {
        fields:"id,age,crops",
        filters:"age:20-30,first_name:Jimoh,id:1"
      }
      expect(() => validator.validatePathQuery(obj)).to.not.throw(BadRequestError)
    })

    it("should throw error if the fields property of the argument contains invalid Farmer attributes", function () {
      const obj = {
        fields:"id,age,crops,email",
        filters:"age:20-30,first_name:Jimoh,id:1"
      }
      expect(() => validator.validatePathQuery(obj)).to.throw(BadRequestError, 
        "Please ensure that all provided fields are valid and properly comma delimited")
    })

    it("should throw error if the filters property of the argument contains invalid Farmer attributes", function () {
      const obj = {
        fields:"id,age,crops",
        filters:"age:20-30:first_name,Jimoh,id:1"
      }
      expect(() => validator.validatePathQuery(obj)).to.throw(BadRequestError, 
        "Please ensure that all provided fields in the filter query parameter are valid and in the right format")
    })

  })

})
