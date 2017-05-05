angular.module('your_app_name.app.filters', [])

.filter('cleanUrl',function() {
  return function(url) {
    if (url) {
      return url.replace('www.', '').replace('https://', '').replace('http://', '');
    }
  }
})
.filter('inArray', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
})
.filter('nearestK', function() {
    return function(input) {
      if (typeof input=="undefined") {
        return;
      }
      else {
        input = input+'';    // make string
        if (input < 1000) {
          return input;		 // return the same number
        }
        if (input < 10000) { // place a comma between
          return input.charAt(0) + ',' + input.substring(1);
        }

        // divide and format
        return (input/1000).toFixed(input % 1000 != 0)+'k';
      }
    }
    })
.filter('notInArray', function($filter){
return function(list, arrayFilter, element){
    if(arrayFilter){
        return $filter("filter")(list, function(listItem){
          for (var i = 0; i < arrayFilter.length; i++) {
              if (arrayFilter[i][element] == listItem[element])
                  return false;
          }
          return true;
        });
    }
};
});
;
