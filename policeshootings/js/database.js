var lengthOfResults;
var db;

function getCountFromDatabase(rowSelected, colSelected, rowVal, colVal) {
    var sqlStmt = 'SELECT * FROM SHOOTINGS WHERE ' + 
                  String(rowSelected) + ' = \"' + String(rowVal) + '\" AND ' +
                  String(colSelected) + ' = \"' + String(colVal) + '\";'
                  
    console.log(sqlStmt); 
    
    db.transaction(function(tx) {
       tx.executeSql(sqlStmt, [], countResults, null); 
    });
    
    /*
    lengthOfResults = db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SHOOTINGS WHERE hit = "Hit";', [],
					   countResults, null);
				});
	*/
	
    console.log("Length of Results: " + lengthOfResults);
	
	return lengthOfResults;
}

var createDatabase = function() {
    db = openDatabase("shootings", "1.0", "Police Shootings", 32678);

    db.transaction(function (tx) {  
        tx.executeSql('CREATE TABLE IF NOT EXISTS SHOOTINGS (' + 
                    'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
                    'hit TEXT,' + 
                    'gender TEXT,' + 
                    'hisLat TEXT,' +
                    'armed TEXT,' +
                    'summary TEXT,' +
                    'shots TEXT,' +
                    'link TEXT,' +
                    'dateSearched TEXT' + 
                    ');'
                    );
    });    
    
    clearTable();
    
    insertData();

    /*
    lengthOfResults = db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SHOOTINGS WHERE hit = "Hit";', [],
					   countResults, null);
				});
	*/
}

function countResults (tx, results) {
    var len = results.rows.length;
    lengthOfResults = len;
    return len;
}

function clearTable() {
    db.transaction(function (tx) {  
        tx.executeSql('DELETE FROM SHOOTINGS;');
    });     
}

function insertData() {
    var statements = [];

    for (var i in allData) {
        var entry = allData[i];

        var hit = String(entry['Hit or Killed?']);
        var gender = String(entry['Victim\'s Gender']);
        var shots = String(entry['Shots Fired']);
        var armed = String(entry['Armed or Unarmed?']);
        var his = String(entry['Hispanic or Latino Origin']);
        var sourceLink = String(entry['Source Link']);
        var summary = String(entry['Summary']);
        var dateSearched = String(entry['Date Searched']);
        
        var sqlStmt = 'INSERT INTO SHOOTINGS (hit, gender, hisLat, armed, summary,' + 
                        'shots, link, dateSearched)' + 
                        'VALUES (\"' + hit + '\", \"' + gender + '\", \"' + his + '\", \"' + armed + 
                        '\", \"' + summary + '\",\"' + shots + '\",\"' + sourceLink + "\",\"" + 
                        dateSearched + '\")';
        
        statements.push(sqlStmt);
    }

    db.transaction(function (tx) {
        for (var i=0; i<statements.length; i++) {
            var sqlStmt = statements[i];
            //tx.executeSql(sqlStmt, [], function () {console.log("Success"); }, function() {console.log(sqlStmt);});
            //tx.executeSql(sqlStmt, [], null, null);
            tx.executeSql(sqlStmt, [], function () { }, function() { });
        }
    });      
    
    /*
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO SHOOTINGS (hit, gender, hisLat, armed, summary,' + 
                    'shots, link, dateSearched)' + 
                    'VALUES ("Hit", "Male", "His", "Armed", "Summary Really Long",' +
                    '12, "http://www.google.com", "27 Apr 2016")');
    });    
    */
}
