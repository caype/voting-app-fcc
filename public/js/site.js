// check code in this fiddle for smooth scrolling to sections : http://jsfiddle.net/ryXFt/3/

$("#addOption").click(function() {
    var newDiv = $("<input type='text' class='form-control' id='options' placeholder='Enter Option detail'>");
    $("#moreOptions").append(newDiv);
});

$("#submitPollResult").click(function(){
 if (localStorage.getItem('PollJson')!= undefined || localStorage.getItem('PollJson')!= null) {
   debugger;
   var RawPollJson = JSON.parse(localStorage.getItem('PollJson'));
   var EditedPollArray=RawPollJson.poll.map(function(pollOption){
     if(pollOption.option === $('#voteForPoll select').val()){
      pollOption.count = pollOption.count+1;
      return pollOption;
    }else{
      return pollOption;
    }
   });
   RawPollJson.poll = EditedPollArray;
   $.ajax({
     url:'/updatePoll',
     type:"POST",
     data:JSON.stringify(RawPollJson),
     contentType:"application/json",
     success:function(updatedPoll){
       var updatedPollObj = JSON.parse(updatedPoll);
       var labels=[],datasets=[],colors=[];
       localStorage.setItem('PollJson',updatedPoll);
       for (var i = 0; i < updatedPollObj.poll.length; i++) {
         labels.push(updatedPollObj.poll[i].option)
         datasets.push(updatedPollObj.poll[i].count)
         colors.push(updatedPollObj.poll[i].color)
       };

      var data = {
           labels: labels,
           datasets: [{
               data: datasets,
               backgroundColor: colors,
               hoverBackgroundColor: colors
           }]
       };

       var ctx = document.getElementById("PollGraphResult");
       var targetChart = new Chart(ctx, {
           data: data,
           type: "pie"
       });

       $("#pollResults").show();
     }
   })
 }
});

$("#submitCreatedPoll").click(function() {
  $("#voteForPoll option").remove();
  var optionValues=[];
    $("#moreOptions").children('input').each(function(i) {
        optionValues.push($(this).val());
    });
    var dataToSend = JSON.stringify({name:$("#userPollDesc").val(),options:optionValues});
    $.ajax({
      url:'/create',
      type:"POST",
      contentType: "application/json",
      data: dataToSend,
      success:function(val){
        localStorage.setItem('PollJson',val);
        var parsedVal = JSON.parse(val);
        var pollOptions=[];
        $("#voteForPoll h4").text(parsedVal.description);
        for (var i = 0; i < parsedVal.poll.length; i++) {
          $('#voteForPoll select').append($('<option>', {
              value: parsedVal.poll[i].option,
              text:parsedVal.poll[i].option
          }));
        }
        $("#voteForPoll").show();
      }
    });
});
