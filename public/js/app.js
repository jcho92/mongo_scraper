

$(document).on("click", ".save", function () {

  var id = $(this).data("id")
  var text = $("#" + id).text()
  var anchor = $("#" + id).children().attr("href")

  $.ajax({
    method: "POST",
    url: "/update/",
    data: {
      title: text,
      link: anchor,
      id: id
    }
  }).then(function (data) {
    console.log(data)
  })


})

$(document).on("click", ".addNote", function () {
  var id = $(this).data("id")
  var text = $("#" + id).text()
  var anchor = $("#" + id).children().attr("href")
  $.ajax({
    method: "GET",
    url: "/notes/" + id,
    data: {
      id: id
    }
  }).then(function (noteData) {
    for (var i = 0; i < noteData.length; i++) {
      console.log(noteData[i].body);
      
      $("#savedNotes").append("<p data-id='" + noteData[i]._id + "'>" + noteData[i].body + "</p>");
      $("#savedNotes").append("<button class='note-delete' data-id=" + noteData[i]._id + ">delete</button>")
    }
  })
  $.ajax({
    method: "GET",
    url: "/article/" + id,
    data: {
      title: text,
      link: anchor,
      id: id
    }
  }).then(function (data) {
    $("#modal").css("display", "block");
    $("#note-title").html(data[0].title);
    $("#note-title").attr("data-id", data[0].id);
  })
})


$(document).on("click", "#note-button", function () {
  var dataid = $("#note-title").attr("data-id")
  var inputData = $("#note-content").val()
  var titleData = $("#note-title").text()
  $.ajax({
    method: "POST",
    url: "/article/" + dataid,
    data: {
      title: titleData,
      id: dataid,
      body: inputData
    }
  })
    .then(function (data) {
    alert("succes")
    location.reload();
    });
})


$(document).on("click", ".note-delete", function () {
  var dataid = $(this).data("id")
  console.log(dataid)
  $.ajax({
    type: 'DELETE',
    url: "/delete/" + dataid,
    data: {
      id: dataid,
    }
  })
    .then(function (data) {
    alert("success")
    location.reload()
    
    });
})

$(document).on("click", ".close", function(){
  location.reload()

})
