


window.onload = function () {

    document.getElementById("weatherSubmit").addEventListener("click", function(event) {
      document.getElementById("weather-container").innerHTML = '<div class="today-container"><div id="weatherResults"></div></div> <div ><h2 style="text-align: center; margin-top: 2rem;">5-Day, 3-Hour Forecast</h2><table id="weather-table"><tr id="table-head" style="text-align:center"><th>Time</th><th >Date</th></tr><tr id="month-day"><td style="border: none; "></td></tr><tr id="time-temp"></tr></table></div>';
      var unsetTimes = new Set();
      let mornEvening = "am";
      for (let i = 0; i < 8; i++ ) {
        if (i == 4) {
          mornEvening = "pm";
        }
        var tod = getHour(i) + ":00 " + mornEvening;
        unsetTimes.add(tod);

        document.getElementById("weather-table").innerHTML += "<tr id='" + tod +"'><td>" + tod + "</td></tr>";
      }

        event.preventDefault();
        const value = document.getElementById("weatherInput").value;
        
        const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=92a80fc565368115ed9b881b1acfd6f8";
        
        fetch(url)
          .then(function(response) {
            return response.json();
          }).then(function(json) {	
            console.log(json);

            let results = "";
            results += '<h2>Current weather in ' + json.name + "</h2>";
            for (let i=0; i < json.weather.length; i++) {
            results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
            }
            results += '<h2>' + json.main.temp + " &deg;F</h2>"
            results += "<p>"
            for (let i=0; i < json.weather.length; i++) {
            results += json.weather[i].description
            if (i !== json.weather.length - 1)
            results += ", "
            }
            results += "</p>";
            document.getElementById("weatherResults").innerHTML = results;
          });

        const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value + ", US&units=imperial" + "&APPID=92a80fc565368115ed9b881b1acfd6f8";
        fetch(url2)
            .then(function(response) {
            return response.json();
            }).then(function(json) {
            console.log(json);
                
                let dateCol = "";
                let timeCol = "";
                let tempCol = "";
                let previousDay = "";
                let dayCounter = 0;
                
                
                
                var skipRow = "";
                for (let i=0; i < json.list.length; i++) {
                  

                    var counterChecker = dayCounter;
                    tempCol = "<td><div style='float: left'>" + json.list[i].main.temp + 
                                          ' &deg;F <img src="http://openweathermap.org/img/w/' +
                                          json.list[i].weather[0].icon + '.png"/> </div> </td>'; 
                    
                    
                    timeCol = moment(json.list[i].dt_txt).format('h:mm a');
                    
                    
                    if (previousDay != moment(json.list[i].dt_txt).format('MMMM Do YYYY')) {
                        previousDay = moment(json.list[i].dt_txt).format('MMMM Do YYYY');
                        ++dayCounter;
                        if (dayCounter == 6) break;
                        var newDay = moment(json.list[i].dt_txt).format('MMMM Do');
                        document.getElementById("month-day").innerHTML += "<td style='color: black; background: white'><strong>" + newDay + "</strong></td>";

                    }

                    
                    
                    if (dayCounter == 1) {
                      unsetTimes.delete(timeCol);
                    }

                   
                    
                      if (dayCounter == 2) {
                        
                        unsetTimes = Array.from(unsetTimes);
                        for (var j = 0; j < unsetTimes.length; j++) {
                          
                          
                          if (timeCol == unsetTimes[j]) {
                            
                            tempCol = "<td></td>" + tempCol;
                          }
                          
                        }
                        
                      }
                      
                    
                    addTemp(timeCol, tempCol);

                }
                
                    //for every unique hour, add a temperature to the table at id time==time.
                      //if the value of the <tr> is "" and counter is equal to 1, then add a quick <td></td> before the new <td> addition
                      //addTemp(id, temp text)
                    //when a new day, increment counter and add to id="month-day"
                    //when counter gets to six, quit.


            });

          
      });

}

function addTemp(id, tempInfo) {
  document.getElementById(id).innerHTML += tempInfo;
}


function getHour(input) {
  if (input == 0 || input == 4) {
    return 12;
  }
  else if (input == 1 || input == 5) {
    return 3;
  }
  else if (input == 2 || input == 6) {
    return 6;
  }
  if (input == 3 || input == 7) {
    return 9;
  }
}