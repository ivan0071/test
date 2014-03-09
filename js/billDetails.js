															// alert("start");	
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;	
// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
// Hook up the errors to the console so we could see it.
// In the future, we need to push these messages to the user.
indexedDB.onerror = function(e) {
	console.log(e);
	//alert('Error:' + e);
};

//var idGET = getUrlVars()["id"];
//var idGET = localStorage["clickedID"];
var getBillID = sessionStorage.getItem("billClickedID");
if(getBillID == null) {
	getBillID = 1;
}
															//alert(idGET);
function init() {
															//  alert("init");
  html5rocks.indexedDB.open(); // open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("bills");
			//store = dbS.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getBillID));
		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			$('#billCategory').text(result.expenseName);			
			$('#billAmmount').text(result.expenseAmmount);
			$('#billAccount').text(result.expenseAccount);
			$('#billDueDate').text(result.expenseDueDate);
			$('#billRepeatCycle').text(result.expenseRepeatCycle);
			$('#billRepeatEndDate').text(result.expenseRepeatEndDate);
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;
			$('#currentDate').text(today);
			
			/*// now let's close the database again!
			var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();*/
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
		if(confirm("Are you sure you want to delete this bill?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);	
//alert("90");
				requestDelete.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
//alert("93");
					var storeDelete = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
					storeDelete.delete(parseInt(getBillID));
					alert("This bill is deleted!");
				/*	var dbCLOSEdelete;
					dbCLOSEdelete = requestDelete.result;
					dbCLOSEdelete.close();*/
					return true;
				}
				
				requestDelete.onerror = function(e) {
					alert('request.onerror!');
				}				
				//return true;
				
		} else {
			event.preventDefault();
			return false;
		}
		
		/*var dbCLOSEdelete;
		dbCLOSEdelete = requestDelete.result;
		dbCLOSEdelete.close();*/
	});
});
/*
	const objCategories = [ 
		{ categoryType: "Education", isIncome: "1", isExpense: "1", isBill: "0" },
		{ categoryType: "Food", isIncome: "0", isExpense: "1", isBill: "0" },
		{ categoryType: "Clothes", isIncome: "1", isExpense: "1", isBill: "0" },
	];	
	for (var ind = 0; ind < objCategories.length; ++ind) {
		storeCategories.add(objCategories[ind]);
		//alert(objCategories[ind].categoryType);
	}
*/