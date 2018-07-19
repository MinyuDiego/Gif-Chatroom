$(function() {
  $(".js-example-basic-single").select2({
    placeholder: "Select users",
    allowClear: true
  });
  console.log("IronGenerator JS imported successfully!");
  $(".clickable").click(function() {
    const imgSrc = $(this).children()[0].currentSrc;
    $("#searchForm").hide();
    let wrapperDivProfile = $('<div>').addClass('btn-group');
    let newDiv = $("<div>").addClass("moodClassWow");
    let textDiv = $("<div>")
      .addClass("textClass")
      .html("New Mood");
    let cambiarDiv = $("<button>")
      .addClass("buttonCambio btn btn-outline-secondary")
      .html("Change");
    let updateMood = $("<button>")
      .addClass("buttonUpdate btn btn-outline-success")
      .html("Update");
    let img = $("<img>").attr("src", imgSrc).css("display", "block");
    axios.post("/moodWow", { imgSrc }).then(res => {
      return res;
    });
    $(".wrapperForClear").empty();
    $(".wrapperForClear").hide();
    newDiv.append(textDiv)
    newDiv.append(img);
    wrapperDivProfile.append(cambiarDiv);
    wrapperDivProfile.append(updateMood);
    newDiv.append(wrapperDivProfile);
    $(".moodPic").append(newDiv);
  });

  $("body").on("click", ".buttonCambio", function() {
    $("#searchForm").show();
    $(".textClass").empty();
    $(".moodClassWow").empty();
  });

  $("body").on("click", ".buttonUpdate", function() {
    window.location.reload();
  });

  let sendtext = () => {
    var textSent = $(".message-form__input").val();
    if (textSent == "") {
      return;
    }
    var textSentDomFake =
      $(".message-form__input").val() +
      " by " +
      $("#hideAuthorIdUserName").text();
    axios.post("/chatRoom", { textSent }).then(res => {
      console.log("text successfully sent to the back");
    });
    let messageDom = $("<p>").addClass("message");
    messageDom.text(textSentDomFake);
    messageDom.append("<br>");
    let deleteLink = $("<a>")
      .attr("href", "")
      .addClass("messageDeleteButton")
      .text("delete");
    messageDom.append(deleteLink);
    $(".messages").append(messageDom);
    $('input[type="text"]').val("");
  };

  $(".message-form__button").click(function() {
    sendtext();
  });



  $(document).keypress(function(e) {
    if (e.which == 13 /* && $(".message-form__input").val()!="" */) {
      sendtext();
    }
  });
  
  function getValue() {
    var participants = []
    var name = document.getElementById("name").value
    var x = document.getElementById("sel");
    for (var i = 0; i < x.options.length; i++) {
      if (x.options[i].selected == true) {
        participants.push(x.options[i].value)
      }
    }
    axios.post("/createChatRoom", { name,participants}).then(res => {
        window.location.href = "/profile"
      });
  }
  
  $("#createChat").click(function(e){
    getValue()
  })
  $(".chatClickable").click(function() {
    const imgSrc = $(this).children()[0].currentSrc;
    axios
      .post("/chatRoomGifMessage", { imgSrc })
      .then(res => {
        return res;
      });
    let gifDom = $("<div>").addClass("gifMessage");
    let gifContentDom = $("<div>").addClass("gifMessageContent");
    let gif = $("<img>").attr("src", imgSrc);
    let authorText = "by " + $("#hideAuthorIdUserName").text();
    let deleteLink = $("<a>")
      .attr("href", "")
      .addClass("messageDeleteButton")
      .text("delete");
    gifContentDom.append(gif);
    gifContentDom.append(" by " + $("#hideAuthorIdUserName").text());
    gifDom.append(gifContentDom);
    gifDom.append(deleteLink);
    $(".messages").append(gifDom);
  });

  $('.carousel').carousel({
    interval: 4000
  })
});
