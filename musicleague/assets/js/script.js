function loadData() {
  var data, i, seasonFilter, seasonCount;
  $.ajax({
    type: "GET",
    url: "assets/lists/ListBySeason.csv",
    dataType: "text",
    success: function(response) {
      data = $.csv.toObjects(response);
      processData(data);
    }
  });
}

function processData(data) {
  // use row without song set to get total season count
  seasonFilter = data.filter(row => row.Song == "");
  if (seasonFilter.length > 0) {
    seasonCount = seasonFilter[0]["Season"];
  }
  else {
    seasonCount = 0;
  }

  // go through the rows and build each season individually
  for (i=1; i<=seasonCount; i++) {
    var season = data.filter(single => single.Season == i);
    season = season.filter(single => single.Song != ""); // filter out the season count
    buildTable(season);
  }
}

function buildTable(data) {
  var season, heading, table, i;
  season = '<div id="season'+data[0]["Season"]+'" class="seasonContainer">';
  heading = '<h2>Season '+data[0]["Season"]+'</h2>';
  table = '<table border="1">\
    <thead>\
      <tr>\
        <th>Song</th>\
        <th>Artist</th>\
        <th>Round Name</th>\
      </tr>\
    </thead>\
    <tbody>';
  for (i=0; i<data.length; i++) {
    table += "<tr>";
    table += "<td>"+data[i]["Song"]+"</td>";
    table += "<td>"+data[i]["Artist"]+"</td>";
    table += "<td>"+data[i]["Round"]+"</td>";
    table += "</tr>";
  }
  table += '</tbody>\
  </table>';
  season += heading + table + '</div>';
  $("#tableContainer").append(season);
}

function searchTables() {
  var filter, container, table, result, tr, td, cell, i, j, k;
  filter = document.getElementById("songSearch").value.toLowerCase();
  container = document.getElementsByClassName("seasonContainer");
  table = document.getElementsByTagName("table");
  for (k=0; k<table.length; k++) {
    container[k].style.display = "none";
    tr = table[k].getElementsByTagName("tr");
    for (i=1; i<tr.length; i++) {
      tr[i].style.display = "none";
      const tdArray = tr[i].getElementsByTagName("td");
      for (j=0; j<tdArray.length; j++) {
        const cellValue = tdArray[j];
        if (cellValue && cellValue.innerHTML.toLowerCase().indexOf(filter) > -1) {
          container[k].style.display = "";
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
}

function clearSearch() {
  $("#songSearch").val("").trigger("onkeyup");
}
