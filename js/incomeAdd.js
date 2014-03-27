/*$("drop-down-list-account-listbox").click(function() {
	addAccountsDropDown();
});*/

function addAccountsDropDown() {

		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;

		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		

		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");				
			
			var openedIndex = store.index("by_accountName");
			var numItemsRequesr = openedIndex.count();	
		//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;	
				/*alert(numItems);*/
				if (openedIndex) {
					var deletePoints = 0;
					var haveCashOnHand = false; var haveCreditCard = false; var haveBankAccount = false;
					var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
							if(cursor.value.id == 1) 		{	haveCashOnHand = true;	}
							else if(cursor.value.id == 2) 	{	haveCreditCard = true;	}
							else if(cursor.value.id == 3) 	{	haveBankAccount = true;	}
							else {
								$('#drop-down-list-account').append('<option value="' + cursor.value.accountName + '">' + cursor.value.accountName + '</option>');
								deletePoints++;
							}								
							cursor.continue();
						} else {
							if(haveCashOnHand == false) {	
								$("#drop-down-list-account option[value='cashOnHand']").remove();
							}
							if(haveCreditCard == false) {	
								$("#drop-down-list-account option[value='creditCard']").remove();
							}
							if(haveBankAccount == false) {
								$("#drop-down-list-account option[value='bankAccount']").remove();
							}
							if(deletePoints == 0) {
								$("#drop-down-list-account option[value='points']").remove();
							}
						}
					}
				}	
			}			
			//$('#drop-down-list-account').append('<option value="test1">Test1: 1 day</option>');
			/*alert('request.onsuccess!');*/
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
}

function addCategoriesDropDown() {	

		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;

		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		

		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");		
			
			var openedIndex = store.index("by_isIncome");
			var range = IDBKeyRange.only("1");
			var numItemsRequesr = openedIndex.count();	
		//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;	
				/*alert(numItems);*/
				if (openedIndex) {
					var curCursor = openedIndex.openCursor(range/*null, "prev"*/);				
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
							$('#drop-down-list-category').append('<option value="' + cursor.value.categoryType + '">' + cursor.value.categoryType + '</option>');
							cursor.continue();
						}
					}
				}	
			}			
			/*alert('request.onsuccess!');*/
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
}

function funcIncomeAdd() {
			
	var incomeRepeat = $('#repeat').val();
	var incomeName = $('#incomeName').val();
	var incomeAmmount = $('#incomeAmmount').val(); 
	var incomeAccount = $('#drop-down-list-account').val(); 
	var incomeCategory = $('#drop-down-list-category').val(); 
	var incomeDueDate =	$('#incomeDueDate').val(); 
	var incomeRepeatCycle = $('#drop-down-list-cycle').val();	 
	var incomeRepeatEndDate = $('#incomeRepeatEndDate').val();
	
	if(incomeRepeat == "off") {
		incomeRepeatCycle = "";
		incomeRepeatEndDate = "";
	}

	incomeDueDate = formatDate(incomeDueDate);
	incomeRepeatEndDate = formatDate(incomeRepeatEndDate);

/*
	alert(
		incomeName 					+ " : " + 
		incomeAmmount 				+ " : " + 
		incomeAccount 				+ " : " + 
		incomeCategory 				+ " : " + 
		incomeDueDate 				+ " : " + 
		incomeRepeatCycle 			+ " : " + 
		incomeRepeatEndDate 		+ " : " + 
		incomeRepeat
	);
*/
	var openedDB;
	var request;
	var obj =  { 
			incomeName: incomeName,
			incomeAmmount: incomeAmmount,
			incomeAccount: incomeAccount,
			incomeCategory: incomeCategory,
			incomeDueDate: incomeDueDate,
			incomeRepeatCycle: incomeRepeatCycle,
			incomeRepeatEndDate: incomeRepeatEndDate
		};	
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
			
//	alert("New income is added - WRONG");
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		store.add(obj);
//		alert('New income is added - TRUE');
		
		// now let's close the database again!
		/*var dbCLOSE;
		dbCLOSE = request.result;
		dbCLOSE.close();*/
		window.location.href = "./incomesList.html";
	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}

function formatDate(enteredDate){
	var dateArray = enteredDate.split('-');
	if(dateArray.length == 3) {
		return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
	} else {
		return "";
	}
}