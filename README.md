
2:43 PM
/query/?q=SELECT+Id+FROM+Contact+WHERE+Email='${email}
Vivinpaulraj Sesuraj
2:51 PM
https://data-speed-4514--mobileapp.sandbox.lightning.force.com/services/data/v62.0/sobjects/Contact/a069200000Ix0WHAAZ -H "Authorization: Bearer {token}" -H "Content-Type: application/json"
after reset to update mpin to sf
Vivinpaulraj Sesuraj
2:55 PM
https://data-speed-4514--mobileapp.sandbox.lightning.force.com/services/data/v62.0/sobjects/Contact/{response Id}--give  from user creation response
https://data-speed-4514--mobileapp.sandbox.lightning.force.com/services/data/v62.0/sobjects/Contact/ {response Id}--give  from user creation response
Vivinpaulraj Sesuraj
2:57 PM
Response :
{
  "id" : "a069200000Ix0WHAAZ",
  "success" : true,
  "errors" : [ ]
}
Vivinpaulraj Sesuraj
2:59 PM
creation APi:

curl: https://data-speed-4514--mobileapp.sandbox.lightning.force.com/services/data/v62.0/sobjects/Contact/ -H "Authorization: Bearer token" -H "Content-Type: application/json" -d "@newContact.json"

Json:

{
  "LastName": "test",
  "FirstName":"Login",
  "Email": "test@gmail.com"
  "Mpin__c" : "1234"
 }
 
 
 Response :
{
  "id" : "a069200000Ix0WHAAZ",
  "success" : true,
  "errors" : [ ]
}
You
3:02 PM
0039200000hdJ0QAAU
You
3:05 PM
alokkumar@qrsolutions.in
Vivinpaulraj Sesuraj
3:06 PM
/query/?q=SELECT+Id+FROM+Contact+WHERE+Email='${email}+AND+Mpin__c='$mpin
