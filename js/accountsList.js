localStorage["openedDB"] = "MyTestDatabase";
//var version = 3;
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;	
// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
// Hook up the errors to the console so we could see it. In the future, we need to push these messages to the user.
indexedDB.onerror = function(e) {
  console.log(e);
};

function init() {
	html5rocks.indexedDB.open();	// open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB/*, version*/);  
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
	};
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//store = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
			
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");

		// Get everything in the store;
		//var keyRange = IDBKeyRange.lowerBound(0);		
		var openedIndex = store.index("by_accountName");
		var numItemsRequesr = openedIndex.count();	
		var countTest = 0;	var classUnderline = "";
	//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
		numItemsRequesr.onsuccess = function(evt) {  
			var deleteBankAccount = 2;	var deleteCreditCard = 1;	var deleteCashOnHand = 0;
			var currentCashOnHandBalance = 0;	var currentCreditCardBalance = 0;	var currentBankAccountBalance = 0;
			var numItems = evt.target.result;	
			var countDeleteDefaults = 3;
			if (openedIndex) {
				var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
				curCursor.onsuccess = function(evt) {					
					var cursor = evt.target.result;					
					if (cursor) {
						countTest++;						
						if(cursor.value.id > 3) {
							if (countTest == numItems) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }
							
							var currentClass = (cursor.value.accountName).toLowerCase().replace(" ","");
							var currentColor = setStyleColor(cursor.value.accountBalance);	//function defined below
							var sign = "";
							if(cursor.value.accountBalance > 0) {	sign = "+";	}
							
							var arrayDateAccount = (cursor.value.accountDate).split("/");
							var dateAccount = new Date(arrayDateAccount[2],arrayDateAccount[1] - 1,arrayDateAccount[0]);
							var dateToday = new Date();
							if(dateToday >= dateAccount){	//ovdeka						
								$('#accountsListUL').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accountDetails.html" rel="external" onclick="callFunction('+ cursor.value.id + ',\'' + cursor.value.accountName + '\'' + ')" rel="external" class="ui-link-inherit">' + cursor.value.accountName + '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + cursor.value.accountBalance + ' MKD</label>' + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
							}	//ovdeka
							
						} else if(cursor.value.id == 1) {
							deleteCashOnHand = 4;
							currentCashOnHandBalance = cursor.value.accountBalance;
						} else if(cursor.value.id == 2) {
							deleteCreditCard = 4;
							currentCreditCardBalance = cursor.value.accountBalance;
						} else if(cursor.value.id == 3) {
							deleteBankAccount = 4;
							currentBankAccountBalance = cursor.value.accountBalance;
						}
						cursor.continue();
					} else {
						var setStyle;	var sign = "";
						if(deleteBankAccount < 4) {
							$("#accountsListUL").children().eq(deleteBankAccount).remove(); //3. Bank(2)
						} else {
							setStyle = document.getElementsByClassName("bankaccountStyle")[0];
							if(currentBankAccountBalance >  0) {sign = "+";	}	else {	sign = "";	}
							setStyle.innerHTML = sign + currentBankAccountBalance + " MKD";
							setStyle.style.color = setStyleColor(currentBankAccountBalance);	//function defined below
						}
						if(deleteCreditCard < 4) {
							$("#accountsListUL").children().eq(deleteCreditCard).remove(); //2. Credit(1)
						} else {
							setStyle = document.getElementsByClassName("creditcardStyle")[0];
							if(currentCreditCardBalance >  0) {	sign = "+";	}	else {	sign = "";	}
							setStyle.innerHTML = sign + currentCreditCardBalance + " MKD";
							setStyle.style.color = setStyleColor(currentCreditCardBalance);	//function defined below
						}
						if(deleteCashOnHand < 4) {
							$("#accountsListUL").children().eq(deleteCashOnHand).remove(); //1. Cash(0)
						} else {
							setStyle = document.getElementsByClassName("cashonhandStyle")[0];
							if(currentCashOnHandBalance >  0) {	sign = "+";	}	else {	sign = "";	}
							setStyle.innerHTML = sign + currentCashOnHandBalance + " MKD";
							setStyle.style.color = setStyleColor(currentCashOnHandBalance);	//function defined below
						}
					}
				}
			}
			if (countTest == numItems)  {	
										} 			
		}
			
		numItemsRequesr.onerror = function(evt) { var numItems = 0; }		
		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getAccountID,getAccountName) {												
	sessionStorage.setItem("accountClickedID", getAccountID);
	sessionStorage.setItem("accountClickedName", getAccountName);
}

function setStyleColor(currentBalance) {												
	if(currentBalance < 0) {
		return "red";
	} else if(currentBalance > 0) {
		return "green";
	} else {
		return "blue";
	}
}