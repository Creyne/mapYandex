//const YANDEX_API = '678422f3-d15f-42ae-b5aa-02f07ead8320';

ymaps.ready(init);

function init(){ 
    var pointsCoord, lineIndex, start, end; 

    var myMap = new ymaps.Map("map", {
        center: [55.00, 83.00],
        zoom: 10
    }); 

    var createGeoPoint = function(str) {
        var myObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: myMap.getCenter(),
            },
            properties: {
                hintContent: str,
                iconContent: str,
            }
        },
        {
            iconImageSize: [10, 10],
            preset: 'islands#nightStretchyIcon',
            draggable: true,
        }
        );
        myObject.events.add('drag', function (e) {
            redrawGeoLine();
        });

            myMap.geoObjects.add(myObject); 
            return myObject;
    };

    var createGeoLine = function() {
        var linecArr = [];
        pointsCoord.forEach(function(element) {
        linecArr.push(Object.values(element)[0].geometry._coordinates);
        });
        var myPolyline = new ymaps.Polyline(linecArr, {
            hintContent: "Маршрут"
        }, 
        {
            draggable: true,
            balloonCloseButton: false,
            strokeColor: "#000000",
            strokeWidth: 4,
            strokeStyle: 'dash',
            strokeOpacity: 0.5
        });
        myMap.geoObjects.add(myPolyline);
        lineIndex = myPolyline;
    };

    var redrawGeoLine = function() {
        if( lineIndex != undefined ) {
            myMap.geoObjects.remove(lineIndex);  
        }
        createGeoLine();
    };

    pointsCoord = [
        { 'Точка маршрута 1': createGeoPoint('Точка маршрута 1')},
    ];
    
    var trail = new Vue({ 
        el: "#list",
        data: {
            newPoint: '',
            points: pointsCoord,
        },
        methods: {
            addPont: function () {
                var nObj = createGeoPoint(this.newPoint);  
                pointsCoord.push({ [this.newPoint] : nObj});
                this.newPoint = '';
                redrawGeoLine();
            },
            delPont: function () {
                var ind = $(event.currentTarget.parentNode.parentNode).index()
                myMap.geoObjects.remove(Object.values(this.points[ind])[0]);
                this.points.splice(ind, 1);
                redrawGeoLine();
                this.newPoint = ' ';
            },
        },
    })

    $( "#sortable" ).sortable().disableSelection();

    $("#sortable").bind( "sortstart", function(event, ui){ 
        let itm = ui.item;
        start = $('li').index(itm);
     });

    $("#sortable").bind( "sortupdate", function(event, ui){
        let itm = ui.item;
        end = $('li').index(itm);
        pointsCoord.splice(end, 0, pointsCoord.splice(start, 1)[0]);
        $("#sortable").sortable("cancel");
        redrawGeoLine();
    });
}

/*const settings = {
  apiKey: '678422f3-d15f-42ae-b5aa-02f07ead8320',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}*/

