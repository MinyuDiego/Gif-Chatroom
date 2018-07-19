$(function() {
  setInterval(function(e) {
    const chatId = $("#chatId").val();
    $.ajax({
      contentType: "application/json",
      dataType: "json",
      type: "POST",

      url: "/chatRoomInterval",
      data: JSON.stringify({ chatId: `${chatId}` })
    }).done(data => {
      $(".messages").empty();
      data.messages.forEach(e => {
        if (e.messageContent != "") {
          let messageDom = $("<p>").addClass("message");
          messageDom.text(e.messageContent + " by " + e.authorId.username);
          messageDom.append("<br>");
          let deleteLink = $("<a>")
            .attr("href", `/chatRoom/deleteMessage/${e._id}`)
            .addClass("messageDeleteButton")
            .text("delete");
          messageDom.append(deleteLink);
          $(".messages").append(messageDom);
        } else {
          var newP = $("<p>");
          let gifDom = $("<div>").addClass("gifMessage");
          let gifContentDom = $("<div>").addClass("gifMessageContent");
          let gif = $("<img>").attr("src", e.messageGif);
          let authorText = "by " + $("#hideAuthorIdUserName").text();
          let deleteLink = $("<a>")
            .attr(
              "href",
              `/chatRoom/deleteMessage/${e._id}`
            )
            .addClass("messageDeleteButton")
            .text("delete");
          gifContentDom.append(gif);
          gifContentDom.append(" by " + $("#hideAuthorIdUserName").text());
          gifDom.append(gifContentDom);
          gifDom.append(deleteLink);
          $(".messages").append(gifDom);
        }
      });
    });
  }, 1000);
});

function autoScrollList() {
  var bottomList = document.getElementById("history-wrapper");
  bottomList.scrollTop = bottomList.scrollHeight;
}