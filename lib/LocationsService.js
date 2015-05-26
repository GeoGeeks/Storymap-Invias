LocationsService.prototype.constructor = LocationsService;

function LocationsService() {

	var that = this;

	var _arr = [];

	var arraySimbols = ["images/Pin-02.png","images/Pin-03.png","images/Pin-04.png","images/Pin-05.png","images/Pin-06.png","images/Pin-07.png","images/Pin-08.png","images/Pin-09.png", "images/Pin-10.png"];

	var _arrayPoints = [];
	// **********
	// methods...
	// **********

	this.getLocations = function() {
		
		return _arr;
	}

	this.getLocationsPoints = function() {
		
		return _arrayPoints;
	}


	this.getRegisters = function (){
		require([
  			"esri/tasks/query", "esri/tasks/QueryTask"
		], function(Query, QueryTask) {
		  var query = new Query();
		  var queryTask = new QueryTask("http://arcgis-esrico103-624953939.us-east-1.elb.amazonaws.com/arcgis/rest/services/Transporte/Proyectos/MapServer/4");
		  query.where = "1 = 1";
		  query.outSpatialReference = {wkid:102100}; 
		  query.returnGeometry = true;
		  query.outFields = ["RouteId", "RESPONSABLE", "PROYECTO_12_13" , "ITEM", "DEPARTAMEN", "VALOR", "VALOR_1", "FECHA_INICIO_OBRAS", "FECHA_TERMINACIÓN_OBRAS","Ejecución_de_obra", "Semaforo", "ESTADO_ACT", "Tiempor_transcurrido"];
		  query.orderByFields = ["VALOR DESC"];
		  queryTask.execute(query, fillLocations);
		});
	}
	
	// *****************
	// private functions
	// *****************

	fillLocations = function(text) {
		var name,description,rank,city,state,leasable_area,opened,renovated,levels,food_court,website,number_stores,parking_places;
		var pt,pms,attr,graphic;
		
		//var lines = CSVToArray(text)
		//var fields = lines[0];
		//console.log("datos;",fields);
		var values;
		
		for (var i = 0; i <text.features.length; i++) {
			
			values = text.features[i];
			if (values.length == 1) {
				break;
			}

			var semaf = values.attributes.Semaforo;
			if(semaf.search("VERDE") != -1)
				levels = "Verde";
			else if(semaf.search("AMARILLO") != -1)
				levels = "Amarillo";
			else if(semaf.search("ROJO") != -1)
				levels = "Rojo";
			
			var fechaIn = new Date(values.attributes.FECHA_INICIO_OBRAS);
			var theyear = fechaIn.getFullYear();
			var themonth = fechaIn.getMonth()+1;
			var thetoday = fechaIn.getDate();

			opened = thetoday+"/"+themonth+"/"+theyear;



			var fechaFin = new Date(values.attributes.FECHA_TERMINACIÓN_OBRAS);
			theyear = fechaFin.getFullYear();
			themonth = fechaFin.getMonth()+1;
			thetoday = fechaFin.getDate();

			number_stores = thetoday+"/"+themonth+"/"+theyear;;

			name = values.attributes.PROYECTO_12_13;
			description = "Proyecto que incluye el tramo "+values.attributes.RouteId+" y cuyo responsable es "+values.attributes.RESPONSABLE;
			rank = i+1;
			city = values.attributes.DEPARTAMEN;			
			leasable_area = values.attributes.VALOR;
			
			renovated = values.attributes.Ejecución_de_obra;
			//levels = values.attributes.Semaforo;
			food_court = values.attributes.ESTADO_ACT;
			website = "http://www.invias.gov.co/";
			
			parking_places = values.attributes.Tiempor_transcurrido;
			
			pt = values.geometry;
			console.log(i);
			pms = new esri.symbol.PictureMarkerSymbol(arraySimbols[i],21,24);	
			pms.setOffset(0,7);		

			attr = {
				name:name,
				description:description,
				rank:rank,
				city:city,				
				leasable_area:leasable_area,
				opened:opened,
				renovated:renovated,
				levels:levels,
				food_court:food_court,
				website:website,
				number_stores:number_stores,
				parking_places:parking_places
			};
			graphic = new esri.Graphic(pt,pms,attr);		
	
			_arr.push(graphic);
			_arrayPoints.push(new esri.Graphic(pt.getExtent().getCenter(),pms));
	
		}

		$(that).trigger("complete");
		
	}

	this.findGraphic = function(find){
		for (i=0; i<_arrayPoints.length; i++)
			if(find == _arrayPoints[i])
				return _arr[i];
    }

    this.findGraphicPoint = function(find){
		for (i=0; i<_arr.length; i++)
			if(find == _arr[i])
				return _arrayPoints[i];
    }

}