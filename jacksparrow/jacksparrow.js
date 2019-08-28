localStorage.setItem('shipRegistry', JSON.stringify([]))
var pubnubDemo = new PubNub({
    publishKey: 'pub-c-33f17ed3-9580-447d-a574-70ccd617b7b3',
    subscribeKey: 'sub-c-77570070-c8c1-11e9-8ada-366022f02051'
});

this.pubnubDemo.subscribe({
    channels: ['jack_sparrow_channel']
});


this.pubnubDemo.addListener({
    message: function(message) {
        if(checkShipAlreadyExistsInRegistry(message.message.name)){
            hideMyShip(message.message.name)
        }
    }
})

function publishShip(){
    console.log(checkShipAlreadyExists())
    if(!checkShipAlreadyExists()){
    var message={'name':document.getElementById("shipName").value,'hide':false}
    this.pubnubDemo.publish({
        message: message,
        channel: 'ship_control_channel'
    });
    alert("ShipName registered")
    copyShip(message)
    }else{
        alert("ShipName Invalid")
   }
}

function copyShip(message){
    submerines=JSON.parse(localStorage.getItem('shipRegistry'))
    submerines.push(message)
    localStorage.setItem('shipRegistry', JSON.stringify(submerines))
}

function checkShipAlreadyExists(){
    var shipName=document.getElementById("shipName").value
    var ships=JSON.parse(localStorage.getItem('shipRegistry'))
    for(var i = 0; i < ships.length; i++) {
        var ship= ships[i];
        if(ship.name===shipName) {
            return true
        }
    }
    return false
}

function getStatus(){
    var found=false
    var shipName=document.getElementById("shipName").value
    var ships=JSON.parse(localStorage.getItem('shipRegistry'))
    ships.forEach(function(ship) { if(ship.name===shipName){
        if(ship.hide){
            if(confirm("shipName : "+shipName +" status hide  Do you want to show")){
              unhide(shipName)
            }
           
        }else{
            alert("shipName : "+shipName +" status shown")
        }
        found=true
    } });
    if(!found){
        alert("shipName : "+shipName+" not found")
    }
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
    console.log("hide ship copied")
}

function unhide(shipName){
    this.pubnubDemo.publish({
        message: {'name':document.getElementById("shipName").value,'hide':false},
        channel: 'ship_control_channel'
    });
    copyUnhide(shipName)
}


function copyUnhide(shipName){
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
    console.log("unhide copied")
}

function checkShipAlreadyExistsInRegistry(shipName){
    var ships=JSON.parse(localStorage.getItem('shipRegistry'))
    for(var i = 0; i < ships.length; i++) {
        var ship= ships[i];
        if(ship.name===shipName) {
            return true
        }
    }
    return false
}


