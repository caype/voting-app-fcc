$("#addOption").click(function() {
    var newDiv = $("<input type='text' class='form-control' id='options' placeholder='Enter Option detail'>");
    $("#moreOptions").append(newDiv);
});

//options value : $("#moreOptions").children().each(function(val){console.log(val)})

$("#submitCreatedPoll").click(function() {
  var optionValues=[];
    $("#moreOptions").children().each(function(val) {
        optionValues.push(val);
    });
  console.log(JSON.stringify({name:$("#userPollDesc").val(),options:JSON.stringify(optionValues)}));
})
