function funcAccountAdd() {
	var openedDB;
	var request;
	var accountDate = formatDate($("#accountDate").val());
	var obj =  { 
			accountName: $("#accountName").val(),
			accountType: $("#accountType").val(),
			accountBalance: $("#accountBalance").val(),
			accountDate: accountDate
		};				
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
			
//	alert("New accound is added - WRONG");
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
		store.add(obj);
		//alert('New accound is added - TRUE');
		
		// now let's close the database again!
		var dbCLOSE;
		dbCLOSE = request.result;
		dbCLOSE.close();
		window.location.href = "./accountsList.html";
	};
	
	request.onupgradeneeded = function(e) {  
//		alert('request.onupgradeneeded!');
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