$(function() {
  console.log("IronGenerator JS imported successfully!");
  $(".clickable").click(function() {
    const imgSrc = $(this).children()[0].currentSrc;
    //console.log($(this).children())
    $("#searchForm").hide();
    let newDiv = $("<div>").addClass("moodClassWow");
    let textDiv = $("<div>")
      .addClass("textClass")
      .html("Your Mood for the Day");
    let cambiarDiv = $("<button>")
      .addClass("buttonCambio")
      .html("Change");
    let img = $("<img>").attr("src",imgSrc);
    axios.post("http://localhost:3000/moodWow", {imgSrc}).then(res => {
      return res;
    });
    $(".clear").empty();
    newDiv.append(img);
    newDiv.append(cambiarDiv);
    $("body").append(textDiv);
    $("body").append(newDiv);
  });

  $("body").on("click", ".buttonCambio", function() {
    $("#searchForm").show();
    $(".textClass").empty();
    $(".moodClassWow").empty();
  });
});
