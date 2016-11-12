
var frisby = require('frisby');

frisby.globalSetup({ 
    request: {
        headers: {
            'Authorization': 'Basic Token'
        },

        inspectOnFailure: true 
    }
});

/*variable*/
var parametersItem = {
        Id : Number,
        Content: String,
        Checked:Boolean,
        Priority:Number,
        Children: Array
};

/**
*Function to create item within  today filter
*/
var createItemWithinTodayFilter = function(itemName){
    var now = new Date();
    var day = now.getUTCDate();
    var month = now.getUTCMonth()+1;
    var year = now.getUTCFullYear();
    var today = month + "/" + day + "/" + year;
    console.log(" day:" , day  , "moth:" , month, "year:", year );
    return frisby.create('Create a Item within today filter' + today)
        .post('https://todo.ly/api/items.json', {
            "Content": itemName,
            "Priority": 2,
            "DueDate": today},
             {json: true})
        .inspectJSON()
        .expectStatus(200)
        .expectJSONTypes(parametersItem)    
};

/**
*create/read/update/delete an item within the today filter
*/

var updateItemValues = {
    "Content": "updateItemFilter2",
    "Priority": 3
};


createItemWithinTodayFilter("itemNameFilter1")
.afterJSON(function(responseItem){     
        var itemId = responseItem.Id;
        var itemNameTest = responseItem.Content;
        console.log('itemId:' ,itemId , 'itemName:' , itemNameTest);

        frisby.create('GET Item  by ID')
            .get('https://todo.ly/api/items/' + itemId + '.json')
            //.inspectJSON()
            .expectStatus(200)
            .expectJSON({
                "Id" : itemId,
                "Content": itemNameTest
            })
            .afterJSON(function(json){
                frisby.create('Update the already created Item by Id within today filter' + itemId)
                    .put('https://todo.ly/api/items/' + itemId + '.json', updateItemValues, {json: true})
                    .inspectJSON()
                    .expectStatus(200)
                    .expectJSON(updateItemValues)
                    .afterJSON(function(responseItemUpdate){
                        var itemIdUpdate = responseItemUpdate.Id
                        console.log("itemIdUpdate:" + itemIdUpdate);
                        frisby.create('Delete item with ID:' + itemIdUpdate)
                            .delete('https://todo.ly/api/items/' + itemIdUpdate +'.json' )
                            .inspectJSON()
                            .expectJSON({
                                Deleted: true
                            })
                        .toss();
                    })
                .toss();
            })
        .toss();
    })
.toss();

