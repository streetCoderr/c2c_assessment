## Specifications
This API has 2 endpoints which are used for inserting and retrieving farmers into and from our database. Below is how to call the endpoints

### POST api/v1/farmer
* path parameters - null
* query parameters - null
* body <br>
&ensp;&ensp;**first_name** -> string:required<br>
&ensp;&ensp;**last_name** -> string:required<br>
&ensp;&ensp;**phone_number** -> string:required<br>
&ensp;&ensp;**age** -> integer:required<br>
&ensp;&ensp;**address** -> string:required<br>
&ensp;&ensp;**crops** -> array:required<br><br>
&ensp;Example (in json)<br>
&ensp;&ensp;{<br>
&ensp;&ensp;&ensp;`"first_name": "Jimoh"<br>
&ensp;&ensp;&ensp;"last_name": "Mike"<br>
&ensp;&ensp;&ensp;"phone_number": "081223145526"<br>
&ensp;&ensp;&ensp;"age": 31<br>
&ensp;&ensp;&ensp;"address": "Lagos"<br>
&ensp;&ensp;&ensp;"crops": ["cassava", "orange"]<br>
&ensp;&ensp;}<br><br><br>

### GET api/v1/farmer
* path parameters - null
* body - null
* query parameters <br>
&ensp;&ensp;**fields** -> string:optional<br>
&ensp;&ensp;&ensp;Description<br>
&ensp;&ensp;&ensp;&ensp;This contains fields that we want to retrieve from our database. If the fields are more than 1, they are comma delimited.<br>
&ensp;&ensp;&ensp;&ensp;The endpoint retrieves all fields if the fields query parameter is not provided.<br>
&ensp;&ensp;&ensp;Example Usage:<br>
&ensp;&ensp;&ensp;&ensp;`api/v1/farmer?fields=first_name,last_name,age`<br><br>
&ensp;&ensp;**filters** -> string:optional<br>
&ensp;&ensp;&ensp;Description<br>
&ensp;&ensp;&ensp;&ensp;This contains the filter parameters with which we want to retrieve records from our database.<br>
&ensp;&ensp;&ensp;&ensp;This endpoint performs no filter if the filters query parameter is not provided<br>
&ensp;&ensp;&ensp;&ensp;The way we specify filter attributes varies accross different fields. This is shown below<br><br>
&ensp;&ensp;&ensp;&ensp;**age**:<br>
&ensp;&ensp;&ensp;&ensp;&ensp;You can filter the records by specifying the exact age you want to match or the age range<br>
&ensp;&ensp;&ensp;&ensp;&ensp;For exact age match, we specify it this way: `filters=age:30`<br>
&ensp;&ensp;&ensp;&ensp;&ensp;For range age match, we specify it this way: `filters=age:20-30`<br><br>
&ensp;&ensp;&ensp;&ensp;**crops**:<br>
&ensp;&ensp;&ensp;&ensp;&ensp;You can filter the records by specifying at least one crop that you want to narrow you search to.<br>
&ensp;&ensp;&ensp;&ensp;&ensp;This retrieves all the farmers that has any of the provided crops.<br>
&ensp;&ensp;&ensp;&ensp;&ensp;If the number of crops is more than 1, they are hyphen (-) delimited.<br>
&ensp;&ensp;&ensp;&ensp;&ensp;It could be used this way: `filters=crops:yam or filters=crops:yam-maize-cassava`<br><br>
&ensp;&ensp;&ensp;&ensp;**other fields (apart from address)**:<br>
&ensp;&ensp;&ensp;&ensp;&ensp;You can filter the records by specifying the value that you want to match on the given field.<br>
&ensp;&ensp;&ensp;&ensp;&ensp;For instance, to get all records where the first name of the farmer is Jimoh, we specify it this way:<br>
&ensp;&ensp;&ensp;&ensp;&ensp;`filters=first_name:Jimoh`<br>
&ensp;&ensp;&ensp;&ensp;&ensp;The above applies to other fields apart from `address`. No filtering on `address`<br><br>
&ensp;&ensp;&ensp;Note that if we wish to specify more than 1 filter parameter, they should be comma delimited.<br>
&ensp;&ensp;&ensp;For example, if you want to get all farmers that meets the following filtering criteria:<br>
&ensp;&ensp;&ensp;&ensp;1) age within the range of 20 and 30<br>
&ensp;&ensp;&ensp;&ensp;2) first name as Jimoh<br>
&ensp;&ensp;&ensp;&ensp;3) plants at least one of yam or maize<br>
&ensp;&ensp;&ensp;You should specify it as follows<br>
&ensp;&ensp;&ensp;&ensp;`filters=age:20-30,first_name:Jimoh,crops:yam-maize`<br><br><br>
&ensp;&ensp;Bringing the fields and filters parameters together, if we wish to get only the first_name and age fields of all farmers that meets the filtering criteria in the previous example, we call the endpoint this way:<br><br>
&ensp;&ensp;&ensp;`api/v1/farmer?fields=first_name,age&filters=age:20-30,first_name:Jimoh,crops:yam-maize`<br><br>
