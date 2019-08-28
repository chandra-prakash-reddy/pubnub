var pubnubDemo = new PubNub({
    publishKey: 'pub-c-33f17ed3-9580-447d-a574-70ccd617b7b3',
    subscribeKey: 'sub-c-77570070-c8c1-11e9-8ada-366022f02051'
});

this.pubnubDemo.subscribe({
    channels: ['ship_control_channel']
});

this.pubnubDemo.addListener({
    message: function(message) {
        if(checkShipAlreadyExists(message.message.name)){
            unhide(message.message.name)
        }
        else{
            subscribeShip(message.message)
        }
    }
})

function publishHideShip(shipName){  
    this.pubnubDemo.publish({
        message: {'name':shipName,'hide':false},
        channel: 'jack_sparrow_channel'
    });
}

function checkShipAlreadyExists(shipName){
    var ships=JSON.parse(localStorage.getItem('shipRegistry'))
    for(var i = 0; i < ships.length; i++) {
        var ship= ships[i];
        if(ship.name===shipName) {
            return true
        }
    }
    return false
}

function subscribeShip(message){
    submerines=JSON.parse(localStorage.getItem('shipRegistry'))
    console.log(submerines)
    submerines.push(message)
    localStorage.setItem('shipRegistry', JSON.stringify(submerines))
    loadShips()
    console.log(submerines)
}

function loadShips(){
    var registerdShips=JSON.parse(localStorage.getItem('shipRegistry'))
    var myShips=[]
    for(var i = 0; i < registerdShips.length; i++) {
        var ship= registerdShips[i];
        console.log(ship.hide==true)
        if(!ship.hide) {
            myShips.push(ship)
        }
    }
    console.log(myShips)
    var col = [];
        for (var i = 0; i < myShips.length; i++) {
            for (var key in myShips[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myShips.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if(myShips[i][col[j]]===false){
                    tabCell.innerHTML = '<button id='+"'"+myShips[i][col[j-1]]+"'"+'type="button" onclick="hideMyShip('+"'"+myShips[i][col[j-1]]+"'"+')">Hide</button>';
                }else{
                tabCell.innerHTML = myShips[i][col[j]];
                }
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
}


function hideMyShip(shipName){
    var registerdShips=JSON.parse(localStorage.getItem('shipRegistry'))
    var myShips=[]
    console.log(shipName)
    for(var i = 0; i < registerdShips.length; i++) {
        var ship= registerdShips[i];
        if(ship.name===shipName) {
            console.log("ship is caught")
            myShips.push({'name':ship.name,'hide':true})
        }else{
        myShips.push({'name':ship.name,'hide':ship.hide})
        }
    }
    localStorage.setItem('shipRegistry',JSON.stringify(myShips))
    this.loadShips()
    publishHideShip(shipName)
}


function unhide(shipName){
    var registerdShips=JSON.parse(localStorage.getItem('shipRegistry'))
    var myShips=[]
    for(var i = 0; i < registerdShips.length; i++) {
        var ship= registerdShips[i];
        if(ship.name===shipName) {
            myShips.push({'name':ship.name,'hide':false})
        }else{
        myShips.push({'name':ship.name,'hide':ship.hide})
        }
    }
    localStorage.setItem('shipRegistry',JSON.stringify(myShips))
    this.loadShips()
}
