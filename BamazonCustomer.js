
  //    Set initial variables. Declare id and amount globally

var mysql       	= require('mysql'),
    inquirer 	    = require('inquirer'),
    id,
    amount;

 //     Create connection object to mySQL database

const conn = mysql.createConnection({
	host:'localhost',
	port: 3306,
	user: 'root',
	password: 'francis1',
	database: 'Bamazon'
});

 //    Initialize connection to DB. Have the inventory populate when connectd

conn.connect(function(err) {
	if (err) throw err;
	runInventory();
});

 //    Shows inventory by selecting all from Products table. Loop through the entire response object. A simple if statement helps
 //    streamline sequence of events. Display THEN run prompt function.

var runInventory = function() {
	var query = 'SELECT * FROM Products'
	conn.query(query, function(err, res) {
		for (var i=0; i<res.length; i++) {
			console.log("id: " + res[i].id + "\n Product Name: " + res[i].ProductName + "\n Department Name: " + res[i].DepartmentName
			+ "\n Price: " + res[i].Price + "\n Stock Quantity: " + res[i].StockQuantity);
		}

	if (query) {
		orderPrompt();
	}

	})
};

 //		Prompts the user for the id they'd like to purchase, given back as 'order' in the answer object.
 //		Store user input in id variable. Run next function in sequence, quantity.

var orderPrompt = function() {
	inquirer.prompt({
		name: 'order',
		type: 'input',
		message: 'Please input the ID for the product you would like to purchase.'
	}).then(function(answer) {
		id = answer.order;
		quantityPrompt();
	})
};


 //		Prompts the user for the amount they'd like to purchase. Given back as 'amount' in answer object.
 //		Store user input in amount variable. Run next function in sequence, updateInventory.

var quantityPrompt = function() {
	inquirer.prompt({
		name: 'amount',
		type: 'input',
		message: 'How many would you like to buy?'
	}).then(function(answer) {
		amount = answer.amount;
		updateInventory();
	})
};

 //		Queries MYSQL DB and specifically the Products table where id is equal to the user specified id.
 //		This will bring back the corresponding row as a response object.
 //		If searching by id, should only bring back one result, which will be the first position in object. res[0]
 //		Accessing the object uses dot notation, with the corresponding column names you set
 //		So we found the ROW by searching for id, then we accessed the COLUMN we wanted by using dot notation

 //		Since we wanted the quantity in stock, and the price of that item, we used the columns for that and assigned them
 //		to variables for readability.

 //		Then we compare the amount in stock compared to the amount the user wanted, if we can complete the order we do.
 //		Then we will update the StockQuantity with the new amount (updatedStock) which subtracted the amount bought from
 //		original inventory. SET StockQuantity WHERE id =, finds the COLUMN you want to change, then narrows it down to row.

 // 	The user's total price is shown. If the amount specified by user is MORE than amount in inventory, we display 
 //		insufficient quantity, and then take them back to the amount screen.

var updateInventory = function() {
	var query = 'SELECT * from Products WHERE id =' + id;
	conn.query(query, function(err, res){
		var chosenStock = res[0].StockQuantity;
		var chosenPrice = res[0].Price;;
		if (chosenStock > amount) {
			var totalPrice = amount * chosenPrice;
			console.log("Your total price is $" + totalPrice + ". Thank you for shopping with Bamazon!");
			var updatedStock = chosenStock - amount;
			conn.query('UPDATE Products SET StockQuantity = ? WHERE id = ?', [updatedStock, id]);
			//runInventory();
		} else {
			console.log("Insufficient quantity!")
			quantityPrompt();
		}

	})
};

