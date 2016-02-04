# internship-test

Database used is PostGresql and the database name is 'happiness' 
It contains three tables Customer, orders and Coupon

First Table - "Customer" has three columns - id, name, email
Primary key is id and UNIQUE constraint is applied on email field

Second Table - "orders" has three columns - order_id, order_amount, customerid
Primary key  is orderid and  customerid is foreign key referencing id column in customer tables

Third Table - "Coupon" has three columns - code_id, status, customerid
Primary KEY - code_id; Foreign key customerid , and there is a CHECK constraint on status field 


Express, Angular.js, Bootstrap and jQuery.


The two web pages  are :
First Webpage- index.html
Second Webpage- index.jade
Jade template is used to render the second webpage

both the files are contained in views folder 
