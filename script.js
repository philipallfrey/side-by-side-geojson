/* set URL for GeoJSON file */
let geojsonURL = 'https://example.com/path/file.geojson';

/* if your domain sets cross-origin headers you can comment out the following*/
geojsonURL = 'https://cors-anywhere.herokuapp.com/' + geojsonURL;

/* choose property for selector */
const selectorProperty = 'county';

/* setup global variables for features */
let features, currentFeatures, index, popup;

/* disable event listener for our map move changes */
mapleft.un('moveend', onMoveEndleft);

/* add event listeners */
document.addEventListener( 'change', event => {
	if (!event.target.matches('#geojson-selector')) return;
	index = 0;
	currentFeatures = features.filter( feature => event.target.value == feature.properties.county );
	moveToFeature( index );
});

document.addEventListener( 'click', event => {
	if( !event.target.matches('.geojson-button') ) return;
	switch( event.target.dataset.direction ){
		case 'next':
			index = (index + 1) % currentFeatures.length;
			break;

		case 'prev':
			index = (index == 0) && currentFeatures.length - 1 || index - 1;
			break;
	}
	moveToFeature( index );
});

function moveToFeature(index){
	var {geometry: {coordinates: [long, lat] }, properties } = currentFeatures[index];
	let data = document.getElementById('geojson-properties');
	displayProperties( data, properties );
	mapleft.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
}

function displayProperties( element, properties ){
	let markup = '';
	Object.entries( properties ).forEach( ([key, value]) => {
		if( 'geometry' !== key ) markup += '<dt>' + key + '</dt><dd>' + value + '</dd>';
	});
	element.innerHTML = markup;
}


/* add a select interaction for handling clicks on features */
const select = new ol.interaction.Select({});
select.on('select', function(event) {
	popup.setPosition(event.mapBrowserEvent.coordinate);
	let feature = event.selected[0];
	let content = document.getElementById('popup-content');
	displayProperties( content, feature.getProperties() );
});

/* create document fragment for inserting our panel */
let fragment = document.createDocumentFragment();
let wrapper = document.createElement('div');
wrapper.setAttribute('id', 'geojson-panel' );

let markup = '<select id="geojson-selector"><option>All counties</option></select>';
markup += '<button class="geojson-button" data-direction="prev">Previous feature</button>';
markup += '<button class="geojson-button" data-direction="next">Next feature</button>';
markup += '<dl id="geojson-properties"></dl>';
markup += '<div id="popup" class="ol-popup">';
markup += '<a href="#" id="geojson-popup-closer" class="ol-popup-closer"></a>';
markup += '<dl id="popup-content"></dl>';
markup += '</div>';
wrapper.innerHTML = markup;
fragment.appendChild( wrapper );

/* fetch geoJSON file and load */
fetch(geojsonURL)
.then((resp) => resp.json())
.then((data) => {
	/* save data */
	features = data.features;
	currentFeatures = features;
	index = 0;

	/* create dropdown with sorted counties from data */
	let allCounties = features.map( feature => feature.properties[selectorProperty] );
	counties = [...new Set(allCounties)].sort();
	let selector = fragment.getElementById('geojson-selector');
	counties.map( (county) => {
		let option = document.createElement('option');
		option.setAttribute('value', county );
		option.innerText = county;
		selector.appendChild( option );
	});

	/* insert controls into header of page */
	let header = document.getElementById( 'header' );
	let body = document.getElementById('mapViewerSideBySide');
	body.insertBefore( fragment, header );

	/* create layer with markers for all features */
	let vectorSource = new ol.source.Vector({
  	features: (new ol.format.GeoJSON()).readFeatures(data, {featureProjection: 'EPSG:3857'})
	});

	/* create the marker style for layer */
	let iconStyle = new ol.style.Style({
		image: new ol.style.Circle({
			radius: 6,
			fill: new ol.style.Fill({
				color: 'green',
			}),
			stroke: new ol.style.Stroke({
				color: 'white',
				width: 1.5
			})
		})
	});

	/* add the source features to the layer, and apply a style to whole layer */
	let vectorLayer = new ol.layer.Vector({
		source: vectorSource,
		style: iconStyle
	});

	/* add the layer to the left map (adding it to the right map affects the cursor)*/
	mapleft.addLayer( vectorLayer );

	/* add our popup handler */
	mapleft.addInteraction(select);

	/* create an overlay to anchor the popup to the map. */
	const container = document.getElementById('popup');
	popup = new ol.Overlay({
		element: container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});

	mapleft.addOverlay(popup);

	/* add click handler for popup closer */
	const closer = document.getElementById('geojson-popup-closer');
	closer.onclick = function() {
		popup.setPosition(undefined);
		closer.blur();
		return false;
	};

	/* set initial zoom for convenience */
	mapleft.getView().setZoom(15);

	/* message to indicate data are loaded */
	console.log("GeoJSON: data loaded");
})
