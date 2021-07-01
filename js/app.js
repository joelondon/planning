var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Vue.component('icon', VueAwesome);
Vue.component('range-slider', VueRangeSlider);
Vue.component('v-swatches', ['vue-swatches']);

Vue.component('layer-group-control', {
  props: ['layergroup'],
  data: function data() {
    return {
      aVar: 'example'
    };
  },
  components: {
    VSwatches: window['vue-swatches']
  },
  methods: {
    activeChanged: function activeChanged(lyrgrp, lyr) {
      this.$emit('active-changed', lyrgrp, lyr, lyr.active);
    },
    clusterChanged: function clusterChanged(lyr) {
      this.$emit('cluster-changed', lyr, lyr.clustered);
    },
    opacityChanged: function opacityChanged(lyr) {
      this.$emit('opacity-changed', lyr);
    },
    colorChanged: function colorChanged(layer, value) {
      this.$emit('color-changed', layer, value);
    },
    colorChangedSlide: function colorChangedSlide(layer, value) {
      var _this = this;

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        _this.$emit('color-changed', layer, value.hex);
      }, 250);
    },
    requestMoreInfo: function requestMoreInfo(lyr) {
      this.$emit('request-more-info', lyr);
    },
    requestGroupMoreInfo: function requestGroupMoreInfo(lyrgrp) {
      this.$emit('request-group-more-info', lyrgrp);
    },
    groupActiveChanged: function groupActiveChanged(lyrgrp) {
      this.$emit('group-active-changed', lyrgrp, lyrgrp.active);
    },
    legendRollover: function legendRollover(legendItem) {
      var rolloverElementBoundingBox = event.target.getBoundingClientRect();
      var rolloverElementX = rolloverElementBoundingBox.left + rolloverElementBoundingBox.width / 2;
      var rolloverElementY = rolloverElementBoundingBox.top;
      var layerLegendPopup = document.getElementById('legendPopup');
      layerLegendPopup.innerText = legendItem.label;
      layerLegendPopup.style.left = parseInt(rolloverElementX - 30) + 'px';
      layerLegendPopup.style.top = parseInt(rolloverElementY - 22) + 'px';
      layerLegendPopup.style.visibility = 'visible';
    },
    legendRollout: function legendRollout() {
      var layerLegendPopup = document.getElementById('legendPopup');
      layerLegendPopup.style.visibility = 'hidden';
    }
  },
  mounted: function mounted() {
    // console.log("layer-group-control", this.layergroup);
  },

  template: '<div class="layer-control-group" >' + '<div class="layerGroupControl" v-if="layergroup.layers.length>1">' + '<p-check v-model="layergroup.active" @change="groupActiveChanged(layergroup)" class="p-default p-round p-fill" v-bind:class="layergroup.group"></p-check>' + '<b-link href="#" v-b-toggle="\'groupTab_\' + layergroup.id" >{{ layergroup.groupDisplayName }} <icon name="angle-double-down"></icon></b-link>' + '</div>' + '<b-collapse v-bind:visible="((layergroup.layers.length<=1) || ( (layergroup.id == app.appSettings.initPanelOpen_layerGroupID) && (app.appState.initPanelOpened == false) )) ? true : false" v-bind:id="\'groupTab_\' + layergroup.id" role="tabpanel">' + '<div v-if="layergroup.shortDescription" class="shortDescription"><span v-html="layergroup.shortDescription"></span><span v-if="(layergroup.longDescription && layergroup.longDescription !=\'\')">.. <b-link @click="requestGroupMoreInfo(layergroup)">Read More <icon name="info-circle" scale="1"></icon></b-link></span></div>' + //add layer group descritpion
  // + '<div v-if="layergroup.shortDescription" class="shortDescription"><span>Hello</span></div>'
  '<div v-for="layer in layergroup.layers" v-bind:class="{ grouped: layergroup.layers.length>1 }">' + '<div v-if="layer.userControl" class="layer-control" v-bind:class="layer.name">' + '<div class="layer-control-head">' + '<p-check v-model="layer.active" @change="activeChanged(layergroup,layer)" class="p-default p-round p-fill" v-bind:class="layer.name"></p-check>' +
  // + '<p-input type="radio" v-bind:name="layergroup.group" v-model="layer.active" @change="activeChanged(layergroup,layer)" class="p-default p-round p-fill" v-bind:class="layer.name"></p-input>'
  '<b-link href="#" v-b-toggle="\'accTab_\' + layer.id" variant="info"><span v-html="layer.displayName"></span> <icon name="angle-down"></icon></b-link>' + '</div>' + '<b-collapse v-bind:visible="layer.id == app.appSettings.initPanelOpen_layerID ? true : false" v-bind:id="\'accTab_\' + layer.id" accordion="layers-accordion" role="tabpanel" class="control-content">' + '<div v-if="layer.shortDescription" class="shortDescription"><span v-html="layer.shortDescription"></span><span v-if="(layer.longDescription && layer.longDescription !=\'\')">.. <b-link @click="requestMoreInfo(layer)">Read More <icon name="info-circle" scale="1"></icon></b-link></span></div>' + '<div v-if="layer.type==\'point\'" class="cluster-container"><p-check v-model="layer.clustered" @change="clusterChanged(layer)" class="p-default p-round p-thick" v-bind:class="layer.name"><span class="labelText">Cluster Points</span></p-check></div>' + '<div v-if="layer.legendData" class="tileLegendContainer"><div class="legendTitle"><span v-if="layer.esriLegendTitle">{{layer.esriLegendTitle}}</span><span v-else>Legend:</span></div><div class="legendScale"><div class="legendItem" v-for="(legendItem, index) in layer.legendData"><div class="legendItemSymbol" v-bind:style="legendItem.style" @mouseover="legendRollover(legendItem)" @mouseout="legendRollout()"></div><div class="legendItemLabel"><span v-if="(index == 0) || (index <= layer.legendData.length-1)">{{ legendItem.label }}</span></div></div></div><div class="clearFloat"></div></div>' + '<div v-if="layer.opacity!=null" class="range-slider-group"><label class="range-slider-label">Adjust Transparency:</label><div class="range-slider-container"><range-slider class="slider" min="0.00" max="1" step="0.1" v-model="layer.opacity" @change="opacityChanged(layer)"></range-slider></div></div>' + '<div v-if="layer.color!=null" class="range-slider-group"><label class="range-slider-label">Adjust Colour:</label><div class="range-slider-container"><v-swatches v-model="layer.color" shapes="circles" show-border popover-x="left" @input="colorChanged(layer, ...arguments)" row-length="3" close-on-select=false :swatches="layer.swatches"></v-swatches></div></div>' + '<div class="clearFloat"></div>' + '</b-collapse>' + '</div>' + '</div>' + '</b-collapse>' + '</div>'
});

Vue.component('layer-more-info', {
  props: ['modalstate'],
  data: function data() {
    return {};
  },
  methods: {
    anEvent: function anEvent(eventParam) {
      this.$emit('an-event', this.layer, eventParam);
    },
    hideModal: function hideModal() {
      this.modalstate.show = false;
    }
  },
  template: '<b-modal v-model="modalstate.show" id="infoModal" hide-footer scrollable centered size="lg" v-bind:title="modalstate.title">' + '<div v-html="modalstate.content"></div>' +
  // + '<div><b-button size="sm" @click="hideModal"><icon name="times-circle"></icon></b-button></div>'
  '</b-modal>'
});

Vue.component('point-search-dialog', {
  props: ['pointsearchstate'],
  data: function data() {
    return {};
  },
  methods: {
    activeChanged: function activeChanged(lyrgrp, lyr) {
      this.$emit('active-changed', lyrgrp, lyr, lyr.active);
    },
    hideModal: function hideModal() {
      this.pointsearchstate.show = false;
    }
  },
  template: '<b-modal v-model="pointsearchstate.show" id="pointSearchModal" scrollable centered size="lg" v-bind:title="pointsearchstate.title">' + '<div class="row list-head" >' + '<div class="col-6"><strong>Layers found ({{app.appState.pointSearchResults.length}}) :</strong></div>' + '<div class="col-3 text-center"><strong>Display:</strong></div>' + '<div class="col-3 text-center"><strong>Export:</strong></div>' + '</div>' + '<div v-if="app.appState.pointSearchResults.length > 0">' + '<div v-for="(resultGroup,groupIndex) in app.appState.pointSearchResults">' + '<div class="row mb-1 mt-1">' + '<div class="col-6"><b-link v-b-toggle="\'resultGroup_\' + groupIndex" >{{app.appState.pointSearchResults[groupIndex].group}} (x{{resultGroup.results.length}}) <span v-if="resultGroup.containsMissing == true"> <strong>(Contains area(s) of missing data)</strong></span> <icon name="angle-down"></icon></b-link></div>' + '<div class="col-3 text-center"><p-check v-model="resultGroup.layer.active" @change="activeChanged(app.findLayerGroupByID(resultGroup.layer.parentID),resultGroup.layer)" class="checkbox p-default p-round p-fill" ></p-check></div>' + '<div class="col-3 text-center">&nbsp;</div>' + '</div>' + '<div class="row">' + '<div class="col-12"><b-collapse v-bind:id="\'resultGroup_\' + groupIndex" accordion="results-accordion"><b-card>' + '<div class="row list-row" v-for="(result,index) in resultGroup.results">' + '<div class="col-1"><span class="resultTitle">{{index+1}}.</span></div>' + '<div class="col-6"><span class="resultDetail">Site: {{result.sitename}} </span><span class="resultDetail" v-if="result.missing == \'true\'"> <strong>(Area of missing data)</strong></span></div>' + '<div class="col-3 text-center">' +
  // + '<p-check v-model="result.layer.active" @change="activeChanged(app.findLayerGroupByID(result.layer.parentID),result.layer)" class="checkbox p-default p-round p-fill" ></p-check>'
  '</div>' + '<div class="col-2 text-center">' + '<p-check v-model="result.export" class="checkbox p-default p-round p-fill" ></p-check>' + '</div>' + '</div>' + '</b-card></b-collapse></div>' + '</div>' + // /row
  '</div>' + '</div>' + '<div v-else><p>No layers with sites found at that location.</div>' + '<template slot="modal-footer">' + '<div class="row">' + '<div class="col-4"><button v-if="app.appState.pointSearchResults.length > 0" id="hideSearchableLayersBtn" v-on:click="app.hideSearcableLayers" type="button" style="display: inline-block;">Hide All Layers</button></div>' + '<div class="col-4"><button v-if="app.appState.pointSearchResults.length > 0" id="showFoundLayersBtn" v-on:click="app.showFoundLayers" type="button" style="display: inline-block;">Show All Found Layers</button></div>' +
  // + '<div class="col-3">&nbsp;</div>'
  '<div class="col-4"><button v-if="app.appState.pointSearchResults.length > 0" id="exportSelectedLayers" v-on:click="app.exportSelectedLayerSites" type="button" style="display: inline-block;">Export Selected to CSV</button></div>' + '</div>' +
  // + '<div v-else></div>'
  '</template>' + '</b-modal>'
});

var colors = {
  hex: '#194d33',
  hex8: '#194D33A8',
  hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
  hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
  rgba: { r: 25, g: 77, b: 51, a: 1 },
  a: 1
};
var timeout = 250;

var app = new Vue({
  el: '#app',
  watch: {
    'appState.activeLayerCount': function appStateActiveLayerCount() {
      this.checkShowLayerCountAlert();
    }
  },
  data: {
    appSettings: {
      mapMaxZoom: 19,
      mapMinZoom: 10,
      mapInitZoom: 11,
      pointSearchZoom: 14,
      radiusSearchMaxM: 1000,
      radiusSearchMobileMaxM: 200,
      mapCenterLatLng: [51.5005021528, -0.109319755005], // [51.48, 0.05] slightly offset GLA Centroid [51.5005021528, -0.109319755005]
      customTileZBase: 400, // where do tile layers begin in Z (between 400 & 500)
      customShapeZBase: 410, // where do context/shape layers begin in Z (between 400 & 500)
      customClusterPolygonZ: 435, // where do cluster polygons live in Z
      customPointZBase: 440, // where to feature (points & overlayed shapes) layers begin in Z (between 400 & 500),
      defaultIconURL: 'images/marker-default.svg',
      defaultLayerColor: '#000000',
      appInfoTitle: 'About This Map',
      appInfoHTML: "<p>This planning data map provides users with easy access to the latest spatial data about planning policy. The spatial data is grouped under the headings of ‘Protection’ and 'Good Growth' to give users an idea of how planning designations regulate development. The ‘context’ shows relevant strategic policies to provide users a wider picture of the current plans for development in London.</p><p>The data should reflect the currently adopted boundaries and not proposed updates, even if they are in the process of being adopted. All the data has been provided by the London planning authorities and combined into a consistent format by the GLA.</p><p>Please explore the map and give us your ideas about how it can be improved and what information to add next. If there are inaccuracies, omissions or areas which are out of date, please send a list of the layers that need to be updated with the subject “Planning data map”. We will then send a template which you can use to supply us with corrections. The email address is: <a href='mailto:planningdata@london.gov.uk?subject=Planning data map'>planningdata@london.gov.uk</a></p><p>For more information about planning, please see <a href='https://www.london.gov.uk/what-we-do/planning' target='_blank'>www.london.gov.uk/what-we-do/planning</a><p><p>Source: <a href='https://data.london.gov.uk/dataset?q=&tag=planningconstraintsmap' target='_blank'>Click here for planning data</a></p><p>Icons by <a href='https://www.freepik.com/'>Freepik</a> from <a href='https://www.flaticon.com/'>www.flaticon.com</a></p><div class='madeByCIU'><div class='madeByLogoRow'><div class='madeByLogo'></div></div><div class='madeByTextRow'>Map designed and developed by City Intelligence</div></div>",
      selectionErrorTitle: 'No data here',
      selectionErrorHTML: "<p>Sorry, we don't have data for your selected or searched area.</p><p>Please see the 'No Data' layer for all postcodes where we currently have no data.</p>",
      pointSearchTitle: 'Layers with sites found at selected location: ',
      pointSearchServiceURL: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
      sourceDataURL: 'https://www.london.gov.uk/what-we-do/planning',
      dataStoreURL: 'https://data.london.gov.uk/dataset?q=&tag=planningconstraintsmap',
      mapURL: 'https://maps.london.gov.uk/planning/',
      welcomeAlertTitle: 'This map is currently in Beta!',
      welcomeAlertHTML: "<p>This is a beta version of the first open planning data map for London. It contains 16 data sets grouped under the headings of 'Good Growth' and 'Constraints'. You are encouraged to explore the map and give us your ideas about how it can be improved. We are also keen to receive suggestions for what information to add next. Please send your feedback to <a href='mailto:ldd@london.gov.uk?subject=Planning data map'>ldd@london.gov.uk</a></p><p>For more information about planning, please see <a href='https://www.london.gov.uk/what-we-do/planning' target='_blank'>www.london.gov.uk/what-we-do/planning</a><p><p>Data: <a href='https://data.london.gov.uk/dataset?q=&tag=planningconstraintsmap' target='_blank'>Click here for planning data</a></p><div class='madeByCIU'><div class='madeByLogoRow'><div class='madeByLogo'></div></div><div class='madeByTextRow'>Map designed and developed by City Intelligence</div></div>",
      showWelcomeAlert: false, //if set to false, the welcome popup box will be disabled
      layerCountAlertTitle: 'No Active Layers',
      layerCountAlertHTML: '<p>Your map currently has no active layers. Please select context and data layers from the menu.</p>',
      showLayerCountAlert: true,
      features_missingData_property: 'missing',
      features_missingData_value: 'true',
      features_missingData_class: 'missing-data',
      features_missingData_message: 'This feature contains missing data.',
      features_source_property: 'source',
      features_source_message: 'Source: ',
      features_source_linkText: 'Click for more info',
      initPanelOpen_layerGroupID: 201, // value can be null or non-existent, does not persist beyond changing tab
      initPanelOpen_layerID: null // value can be null or non-existent, does not persist beyond changing tab
    },
    appState: {
      appInit: false,
      panelOpen: true,
      initPanelOpened: false, //, does not persist beyond changing tab
      selectedNavGroup: 'councils',
      isEmbed: false,
      lastSearchType: null, // "point"/"polygon"
      pointSearchableLayers: [],
      pointSearchResults: [],
      pointSearchPoint: [],
      pointSearchQueries: [],
      isPointSearch: false,
      isPolygonSearch: false,
      radiusSearchStart: [],
      radiusSearchEnd: [],
      activeLayerCount: 0
    },
    leafletMap: null,
    searchControl: null,
    searchPointMarkerGroup: null,
    searchRadiusPolygonGroup: null,
    searchPolygon: null,
    searchPolygonLatLngs: null,
    layerInfoModal: {
      show: false,
      title: '',
      content: ''
    },
    pointSearchModal: {
      show: false,
      title: ''
    },
    icons: {
      // we must ALWAYS have at least the "default" icon defined
      default: L.icon({
        iconUrl: 'images/marker-default.svg',
        iconSize: [3, 3],
        iconAnchor: [1.5, 1.5],
        popupAnchor: [0, -7.5]
      }),
      pointSearch: L.icon({
        iconUrl: 'images/marker-point-search.svg',
        iconSize: [30, 49],
        iconAnchor: [15, 49],
        popupAnchor: [0, -24]
      }),
      lbs: L.icon({
        iconUrl: 'images/marker-lbs.svg',
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
        popupAnchor: [0, -7.5]
      }),
      wst: L.icon({
        iconUrl: 'images/marker-waste.svg',
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
        popupAnchor: [0, -7.5]
      })
    },

    areaSelectionData: {
      state: {
        selectionType: null
      },
      london: {
        id: 'London',
        name: 'London',
        valid: true,
        superFast: 0,
        ultraFast: 0,
        fullFibre: 0,
        unable2: 0,
        unable5: 0,
        unable10: 0,
        unable30: 0
      },
      borough: {
        id: null,
        name: null,
        valid: false,
        superFast: 0,
        ultraFast: 0,
        fullFibre: 0,
        unable2: 0,
        unable5: 0,
        unable10: 0,
        unable30: 0
      },
      ward: {
        id: null,
        name: null,
        valid: false,
        superFast: 0,
        ultraFast: 0,
        fullFibre: 0,
        unable2: 0,
        unable5: 0,
        unable10: 0,
        unable30: 0
      },
      postcode: {
        id: null,
        name: null,
        valid: false,
        superFast: 0,
        ultraFast: 0,
        fullFibre: 0,
        unable2: 0,
        unable5: 0,
        unable10: 0,
        unable30: 0
      }
    },

    layerGroups: [{
      id: 101,
      group: 'brownfield-land',
      groupDisplayName: 'Brownfield Land Registers',
      navGroup: 'good-growth',
      navGroupOrder: 0,
      active: false,
      layers: [{
        id: 101,
        type: 'shape',
        name: 'brownfield-land',
        displayName: 'Brownfield Land Registers',
        shortDescription: 'Brownfield lands are areas of previously developed land available for residential and mixed-use developments',
        longDescription: '<p>Brownfield lands are areas of previously developed land available for residential and mixed-use developments. All local planning authorities are required to publish a Brownfield Land Register to encourage delivery of housing and investment in the area.<br>Brownfield sites that are below 0.25 hectares may not be shown on the map.</p>',
        z: 1,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.6,
        userControl: true,
        popup: '<p><strong>Brownfield:</strong> <br /> {sitenameaddress}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 103,
      group: 'opportunity-areas',
      groupDisplayName: 'Opportunity Areas',
      navGroup: 'good-growth',
      navGroupOrder: 1,
      active: false,
      layers: [{
        id: 103,
        type: 'shape',
        name: 'opportunity-areas',
        displayName: 'Opportunity Areas',
        shortDescription: 'Opportunity Areas (OAs) are London’s major source of brownfield land which have significant capacity for development',
        longDescription: '<p>Opportunity Areas (OAs) are London’s major source of brownfield land which have significant capacity for development. Development proposals within OAs should conform with strategic directions for the OA(s).</p>',
        z: 43,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 104,
      group: 'town-center-boundaries',
      groupDisplayName: 'Town Center Boundaries',
      navGroup: 'good-growth',
      navGroupOrder: 2,
      active: false,
      layers: [{
        id: 104,
        type: 'shape',
        name: 'town-center-boundaries',
        displayName: 'Town Centres',
        shortDescription: 'Town centres provide a range of commercial, cultural and civic activities, including shopping, leisure, employment, entertainment, culture, and social and community facilities',
        longDescription: '<p>Town centres provide a range of commercial, cultural and civic activities, including shopping, leisure, employment, entertainment, culture, and social and community facilities. Their vitality and viability should be promoted to ensure they retain their importance. There are five broad types of town centres according to their scales and roles: International centres, Metropolitan centres, Major centres, District centres and Neighbourhood and more local centres.</p>',
        z: 4,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.7,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>Classification: {classification} </p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 106,
      group: 'areas-of-intensification',
      groupDisplayName: 'Areas of Intensification',
      navGroup: 'good-growth',
      navGroupOrder: 3,
      active: false,
      layers: [{
        id: 106,
        type: 'shape',
        name: 'areas-of-intensification',
        displayName: 'Areas of Intensification',
        shortDescription: 'Intensification Areas are built up areas with good existing or potential public transport links and can support redevelopment at higher than existing densities',
        longDescription: '<p>Intensification Areas are built up areas with good existing or potential public transport links and can support redevelopment at higher than existing densities. They have significant capacity for new jobs and homes but at a level below that which can be achieved in the Opportunity Areas.</p>',
        z: 6,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.6,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 107,
      group: 'central-activities-zone',
      groupDisplayName: 'Central Activities Zone',
      navGroup: 'good-growth',
      navGroupOrder: 4,
      active: false,
      layers: [{
        id: 107,
        type: 'shape',
        name: 'central-activities-zone',
        displayName: 'Central Activities Zone',
        shortDescription: 'The Central Activities Zone covers London’s geographic, economic and administrative core',
        longDescription: '<p>The Central Activities Zone covers London’s geographic, economic and administrative core. It’s unique combination of uses should be promoted and enhanced while also improving its environment and attractiveness for residents, visitors and businesses alike.</p>',
        z: 7,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 108,
      group: 'shlaa',
      groupDisplayName: 'Strategic Housing Land Availability Assessment',
      navGroup: 'good-growth',
      navGroupOrder: 5,
      active: false,
      layers: [{
        id: 108,
        type: 'shape',
        name: 'shlaa',
        displayName: 'Strategic Housing Land Availability Assessment',
        shortDescription: 'A Strategic Housing Land Availability Assessment (SHLAA) is a technical exercise to determine the quantity and suitability of land potentially available for housing development',
        longDescription: '<p>A Strategic Housing Land Availability Assessment (SHLAA) is a technical exercise to determine the quantity and suitability of land potentially available for housing development. </br> The SHLAA is not a site allocations exercise – the purpose of the SHLAA is to provide a robust indication of aggregate housing capacity at local authority level and across London. Only sites that are already approved or formally allocated for housing are identified on the web map. </br> For more information, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/london-plan/new-london-plan/strategic-housing-land-availability-assessment" target="_blank">https://www.london.gov.uk/what-we-do/planning/london-plan/new-london-plan/strategic-housing-land-availability-assessment</a></p>',
        z: 21,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 102,
      group: 'site-allocations',
      groupDisplayName: 'Site allocations',
      navGroup: 'good-growth',
      navGroupOrder: 6,
      active: false,
      layers: [{
        id: 102,
        type: 'shape',
        name: 'site-allocations',
        displayName: 'Site allocations',
        shortDescription: 'A Site Allocation means that the site is allocation for a particular type of development or use, such as housing, employment and leisure, within a development plan',
        longDescription: '<p>A Site Allocation means that the site is allocation for a particular type of development or use, such as housing, employment and leisure, within a development plan. Allocated sites provide guidelines for planning decisions, help to diversify use of land and promote development at borough level.</p>',
        z: 42,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.4,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 109,
      group: 'mcil2',
      groupDisplayName: "Mayor's Community Infrastructure Levy 2019",
      shortDescription: "The Mayor's Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2",
      longDescription: '<p>The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layer ‘MCIL2 Central London Charging Area’ shows the boundaries of Central London and the Isle of Dogs where MCIL2 applies. The layer ‘MCIL2 Charging Band 1’, ‘MCIL2 Charging Band 2’ and ‘MCIL2 Charging Band 3’ indicate the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
      navGroup: 'good-growth',
      navGroupOrder: 11,
      active: false,
      layers: [{
        id: 109,
        type: 'shape',
        name: 'mcil2',
        displayName: 'MCIL2 Central London Charging Area',
        shortDescription: "The Mayor's Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2",
        longDescription: '<p>The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layer ‘MCIL2 Central London Charging Area’ shows the boundaries of Central London and the Isle of Dogs where MCIL2 applies. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        z: 22,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.9,
        userControl: true,
        //popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 111,
        type: 'shape',
        name: 'mcil2-band',
        displayName: 'MCIL2 Charging Band 1',
        shortDescription: "The Mayor's Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2",
        longDescription: 'The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layers ‘MCIL2 Charging Band 1’, ‘MCIL2 Charging Band 2’ and ‘MCIL2 Charging Band 3’ indicate the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        z: 23,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.9,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>{classification}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 112,
        type: 'shape',
        name: 'mcil2-band2',
        displayName: 'MCIL2 Charging Band 2',
        shortDescription: "The Mayor's Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2",
        // longDescription: '<p>The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layer ‘MCIL2 Charging Bands’ shows the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        longDescription: 'The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layers ‘MCIL2 Charging Band 1’, ‘MCIL2 Charging Band 2’ and ‘MCIL2 Charging Band 3’ indicate the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        z: 24,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.9,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>{classification}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 113,
        type: 'shape',
        name: 'mcil2-band3',
        displayName: 'MCIL2 Charging Band 3',
        shortDescription: "The Mayor's Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2",
        // longDescription: '<p>The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layer ‘MCIL2 Charging Bands’ shows the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        longDescription: 'The Mayor\'s Community Infrastructure Levy 2019 (known as MCIL 2) is used to help finance Crossrail 1 (the Elizabeth Line) and Crossrail 2. It sets a general charge for all development across London as well as specific charges for office, retail and hotel development in Central London and the Isle of Dogs.</p><p>The layers ‘MCIL2 Charging Band 1’, ‘MCIL2 Charging Band 2’ and ‘MCIL2 Charging Band 3’ indicate the three MCIL2 charging bands for all development in London except for office, retail and hotel in Central London and the Isle of Dogs. For more information about the rates, please visit: <a href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy" target="_blank">https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/mayoral-community-infrastructure-levy</a></p>',
        z: 25,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.9,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>{classification}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    },
    //protection layers:
    {
      id: 201,
      group: 'designated-open-space',
      groupDisplayName: 'Designated Open Space',
      shortDescription: 'Designated Open Space includes lands designated as Green Belt, Metropolitan Open Land (MOL) and other public open spaces.',
      longDescription: 'Designated Open Space includes lands designated as Green Belt, Metropolitan Open Land (MOL) and other public open spaces. These lands receive strong protected against development and are a vital component of London’s infrastructure.',
      navGroup: 'protection',
      navGroupOrder: 0,
      active: false,
      layers: [{
        id: 210,
        type: 'shape',
        name: 'dos-green-belt',
        displayName: 'Green Belt',
        shortDescription: 'The Green Belt is established to prevent urban sprawl and protect the natural environment. It separates the urban from the rural.',
        longDescription: '<p>Designated Open Space includes lands designated as Green Belt, Metropolitan Open Land (MOL) and other public open spaces. These lands receive strong protected against development and are a vital component of London’s infrastructure.</br>The Green Belt is established to prevent urban sprawl and protect the natural environment. While the Green Belt separates the urban from the rural, the Metropolitan Open Land (MOL) is strategic open land within the urban area. The Green Belt and the MOL are given the same level of protection. Other public open spaces refer to any other designated open spaces with public value.</p>',
        z: 18,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.6,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 211,
        type: 'shape',
        name: 'dos-mol',
        displayName: 'Metropolitan Open land',
        shortDescription: 'The Metropolitan Open Land (MOL) is strategic open land within the urban area. The Green Belt and the MOL are given the same level of protection.',
        longDescription: '<p>Designated Open Space includes lands designated as Green Belt, Metropolitan Open Land (MOL) and other public open spaces. These lands receive strong protected against development and are a vital component of London’s infrastructure.</br> The Green Belt is established to prevent urban sprawl and protect the natural environment. While the Green Belt separates the urban from the rural, the Metropolitan Open Land (MOL) is strategic open land within the urban area. The Green Belt and the MOL are given the same level of protection. Other public open spaces refer to any other designated open spaces with public value.</p>',
        z: 19,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 212,
        type: 'shape',
        name: 'dos-other',
        displayName: 'Other Open Space',
        shortDescription: 'Other public open spaces refer to any other designated open spaces with public value.',
        longDescription: '<p>Designated Open Space includes lands designated as Green Belt, Metropolitan Open Land (MOL) and other public open spaces. These lands receive strong protected against development and are a vital component of London’s infrastructure.</br>The Green Belt is established to prevent urban sprawl and protect the natural environment. While the Green Belt separates the urban from the rural, the Metropolitan Open Land (MOL) is strategic open land within the urban area. The Green Belt and the MOL are given the same level of protection. Other public open spaces refer to any other designated open spaces with public value.</p>',
        z: 17,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.6,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 202,
      group: 'sinc',
      groupDisplayName: 'Site of Importance for Nature Conservation (SINC)',
      navGroup: 'protection',
      navGroupOrder: 1,
      active: false,
      layers: [{
        id: 202,
        type: 'shape',
        name: 'sinc',
        displayName: 'Site of Importance for Nature Conservation (SINC)',
        shortDescription: 'Sites of Importance for Nature Conservation (SINCs) are sites that are of particular importance to wildlife and biodiversity',
        longDescription: '<p>Sites of Importance for Nature Conservation (SINCs) are sites that are of particular importance to wildlife and biodiversity. SINCs receive a high level of protection from development within the planning system. There are three tiers of SINCs: Sites of Metropolitan Importance, Sites of Borough Importance and Sites of Local Importance.</p>',
        z: 9,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.6,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br><strong>Classification:</strong><br>{classification}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 203,
      group: 'sssi',
      groupDisplayName: 'Sites of Special Scientific Interest (SSSI)',
      navGroup: 'protection',
      navGroupOrder: 2,
      active: false,
      layers: [{
        id: 203,
        type: 'shape',
        name: 'sssi',
        displayName: 'Sites of Special Scientific Interest (SSSI)',
        shortDescription: 'Sites of Special Scientific Interest are protected sites that have features of special interest',
        longDescription: '<p>Sites of Special Scientific Interest are protected sites that have features of special interest, such as wildlife, geology and landform. Owners of SSSI should manage the site properly to conserve its special features.</p>',
        z: 10,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 205,
      group: 'conservation-areas',
      groupDisplayName: 'Conservation Areas',
      navGroup: 'protection',
      navGroupOrder: 3,
      active: false,
      layers: [{
        id: 205,
        type: 'shape',
        name: 'conservation-areas',
        displayName: 'Conservation Areas',
        shortDescription: 'Conservation Areas are areas where extra planning controls apply due to their special architectural and historic interest',
        longDescription: '',
        z: 8,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.7,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null,
        something: true
      }]
    }, {
      id: 217,
      group: 'ancient-woodland',
      groupDisplayName: 'Ancient Woodland',
      navGroup: 'protection',
      navGroupOrder: 3,
      active: false,
      layers: [{
        id: 217,
        type: 'shape',
        name: 'ancient-woodland',
        displayName: 'Ancient Woodland',
        shortDescription: 'Ancient woodland is any area that’s been wooded continuously since at least 1600 AD. There are two categories of ancient woodland',
        longDescription: '<p>Ancient woodland is any area that’s been wooded continuously since at least 1600 AD. There are two categories of ancient woodland:</br>Ancient semi-natural woods: Woods that have developed naturally.</br> Plantations on ancient woodland sites: Woods that have been felled and replanted with conifer or broadleaved trees that retain ancient woodland features.</br>Development resulting in the loss or deterioration of ancient woodland should be refused, unless there are wholly exceptional reasons and a suitable compensation strategy exists.</p>',
        z: 12,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.7,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null,
        something: true
      }]
    }, {
      id: 206,
      group: 'strategic-industrial-location',
      groupDisplayName: 'Strategic Industrial Locations (SILs)',
      navGroup: 'protection',
      navGroupOrder: 4,
      active: false,
      layers: [{
        id: 206,
        type: 'shape',
        name: 'strategic-industrial-location',
        displayName: 'Strategic Industrial Locations (SILs)',
        shortDescription: 'Strategic Industrial Locations (SILs) are London’s main reservoirs of industrial and related capacity',
        longDescription: '<p>Strategic Industrial Locations (SILs) are London’s main reservoirs of industrial and related capacity. There are two types of SILs: Preferred Industrial Locations (PIL) and Industrial Business Parks (IBP). Development proposals within or adjacent to SILs should not compromise the integrity or effectiveness of these locations in accommodating industrial type activities</p>',
        z: 13,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.8,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 207,
      group: 'locally-strategic-industrial-location',
      groupDisplayName: 'Locally Significant Industrial Sites (LSIS)',
      navGroup: 'protection',
      navGroupOrder: 5,
      active: false,
      layers: [{
        id: 207,
        type: 'shape',
        name: 'locally-strategic-industrial-location',
        displayName: 'Locally Significant Industrial Sites (LSIS)',
        shortDescription: 'Locally Significant Industrial (LSIS) Sites are sites that have particular local importance for industrial and related functions',
        longDescription: '<p>Locally Significant Industrial (LSIS) Sites are sites that have particular local importance for industrial and related functions, which complement provision in SILs.</p>',
        z: 14,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 204,
      group: 'flood-risk',
      groupDisplayName: 'Flood Risk',
      navGroup: 'protection',
      navGroupOrder: 6,
      active: false,
      layers: [
      // {
      //   id: 204,
      //   type: 'shape',
      //   name: 'flood-risk',
      //   displayName: 'Flood Risk',
      //   shortDescription: 'This layer shows a set of flood zones that explain the probability of river and sea flooding, ignoring the presence of flood defences',
      //   longDescription: '<p>This layer shows a set of flood zones that explain the probability of river and sea flooding, ignoring the presence of flood defences. There are four tiers of flood zones.<br>Flood zone 1: low probability<br>Flood zone 2: Medium probability<br>Flood zone 3a: High probability<br>Flood zone 3b: Functional floodplains where water has to flow or be stored in times of flood.</p>',
      //   z: 11,
      //   url: 'https://maps.london.gov.uk/gla/rest/services/apps/planning_data_map_03/MapServer/',
      //   appendIDtoURL: true,
      //   active: false,
      //   opacity: 0.75,
      //   userControl: true,
      //   popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
      //   clickCustomFunction: true,
      //   clickZoomToFeature: true,
      //   pointSearchable: true,
      //   layerObject: null
      // },
      {
        id: 2040,
        type: 'tile',
        name: 'flood-risk',
        displayName: 'Flood Risk',
        shortDescription: 'The Flood Zones show the probability of river and sea flooding, ignoring the presence of defences',
        longDescription: '<p>The Flood Zones show the probability of river and sea flooding, ignoring the presence of defences.<br>There are four zones, 1, 2, 3a and 3b, that reflect the annual probability of flooding happening. <br>This map shows all areas with more than a 1 in 1,000 annual probability of either river or sea flooding by combining zones 2, 3a and 3b. <br>If you want to submit a planning application within these zones, you will need to do a flood risk assessment. For a full explanation of when a flood risk assessment is required, visit <a href="https://www.gov.uk/guidance/flood-risk-assessment-for-planning-applications#when-you-need-an-assessment." target="_blank">https://www.gov.uk/guidance/flood-risk-assessment-for-planning-applications#when-you-need-an-assessment.</a><br>To view more detailed information on the flood zones, visit <a href="https://flood-map-for-planning.service.gov.uk/" target="_blank">https://flood-map-for-planning.service.gov.uk/</a>.</p>',
        z: 11,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_04/MapServer/tile/{z}/{y}/{x}',
        //esriLegendTitle: "Legend:",
        //esriLegendJSON: "https://maps.london.gov.uk/gla/rest/services/apps/planning_data_map_02/MapServer/legend?f=pjson",
        appendIDtoURL: false,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 208,
      group: 'safeguarded-wharves',
      groupDisplayName: 'Safeguarded Wharves',
      navGroup: 'protection',
      navGroupOrder: 7,
      active: false,
      layers: [{
        id: 208,
        type: 'shape',
        name: 'safeguarded-wharves',
        displayName: 'Safeguarded Wharves',
        shortDescription: 'Safeguarded Wharves are wharves that are given protected status as working wharves to help the Thames maintain its cargo-handling function',
        longDescription: '<p>Safeguarded Wharves are wharves that are given protected status as working wharves to help the Thames maintain its cargo-handling function. It is not allowed to use safeguarded wharves for non-port activities and all planning applications affecting the wharves must be referred to the Mayor.</p>',
        z: 15,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.7,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>Status: {status}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 213,
      group: 'tpa',
      groupDisplayName: 'Thames Policy Area',
      shortDescription: 'The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames',
      longDescription: '<p>The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames.<br>The Thames Policy Area-Mayor of London Order is the boundary used to define potential strategic importance (PSI) applications referable to the Mayor.<br>The Thames Policy Area-LPA is the TPA boundary defined in local plans. <br>Development proposals within the TPA should be consistent with the published Thames Strategy for the particular area of river concerned</p>',
      navGroup: 'protection',
      navGroupOrder: 8,
      active: false,
      layers: [{
        id: 218,
        type: 'shape',
        name: 'tpa',
        displayName: 'TPA - Mayor of London Order',
        shortDescription: 'The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames',
        longDescription: '<p>The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames. The Thames Policy Area-Mayor of London Order is the boundary used to define potential strategic importance (PSI) applications referable to the Mayor. Development proposals within the TPA should be consistent with the published Thames Strategy for the particular area of river concerned</p>',
        z: 20,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        //popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 219,
        type: 'shape',
        name: 'tpa-lpa',
        displayName: 'TPA - Local Planning Authority',
        shortDescription: 'The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames',
        longDescription: '<p>The Thames Policy Area (TPA) is established in the London Plan to protect the strategic role of the River Thames. The Thames Policy Area-LPA is the TPA boundary defined in local plans. Development proposals within the TPA should be consistent with the published Thames Strategy for the particular area of river concerned</p>',
        z: 29,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 214,
      group: 'listed-buildings',
      groupDisplayName: 'Listed Buildings',
      navGroup: 'protection',
      navGroupOrder: 9,
      active: false,
      layers: [{
        id: 214,
        type: 'point',
        name: 'listed-buildings',
        displayName: 'Listed Buildings',
        icon: 'lbs',
        color: '#C80810',
        shortDescription: 'Listed buildings are structures of special architectural or historic interest. There are three levels of importance',
        longDescription: '<p>Listed buildings are structures of special architectural or historic interest. There are three levels of importance:</br>• Grade I (one) of exceptional interest </br>• Grade II* (two star) particularly important</br>• Grade II (two) of special interest</br>Any works that may affect the character of a listed building require listed building consent from the local planning authority, whether planning permission is also needed or not. More information can be found at <a href="https://historicengland.org.uk/advice/hpg/consent/permissonandhas/" target="_blank">https://historicengland.org.uk/advice/hpg/consent/permissonandhas/</a></p>',
        z: 20,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        clustered: true,
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: false,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 209,
      group: 'office-to-residential',
      groupDisplayName: 'Article 4 Directions: Office to Residential',
      navGroup: 'protection',
      navGroupOrder: 10,
      active: false,
      layers: [{
        id: 209,
        type: 'shape',
        name: 'office-to-residential',
        displayName: 'Article 4 Directions: Office to Residential',
        shortDescription: 'An Article 4 Direction: Office to Residential removes permitted development rights within the designated area',
        longDescription: '<p>An Article 4 Direction: Office to Residential removes permitted development rights within the designated area. This means you will need planning permission from the LPAs for a change of use from office (Use Class B1a) to residential (Use Class C3).</p>',
        z: 16,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    },
    // {
    //   id:213,
    //   group: 'protected-vistas',
    //   groupDisplayName: 'Protected Vistas',
    //   navGroup: 'protection',
    //   navGroupOrder: 10,
    //   active: false,
    //   layers: [
    //     {
    //       id: 213,
    //       type: 'shape',
    //       name: 'protected-vistas',
    //       displayName: 'Protected Vistas',
    //       shortDescription: 'The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF)',
    //       longDescription: '<p>The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF). The London Plan seeks to protect the significant views which help to define London, including the panoramas, linear views and townscape views in this layer.</br> A planning application for a proposal that could affect one of these designated view should be accompanied by an analysis that explains, evaluates and justifies the visual impact on the view. Any planning application that is not consistent with the principles and guidance set out in the London Plan and the LVMF will be refused.</p>',
    //       z: 20,
    //       url: 'https://maps.london.gov.uk/gla/rest/services/apps/planning_data_map_03/MapServer/',
    //       appendIDtoURL: true,
    //       active: false,
    //       opacity: 0.5,
    //       userControl: true,
    //       popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
    //       clickCustomFunction: true,
    //       clickZoomToFeature: true,
    //       pointSearchable: true,
    //       layerObject: null
    //     }
    //   ]
    // },
    {
      id: 213,
      group: 'protected-vistas',
      groupDisplayName: 'Protected Vistas',
      shortDescription: 'The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF)',
      longDescription: '<p>The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF). The London Plan seeks to protect the significant views which help to define London, including the panoramas, linear views and townscape views in this layer.</br> A planning application for a proposal that could affect one of these designated view should be accompanied by an analysis that explains, evaluates and justifies the visual impact on the view. Any planning application that is not consistent with the principles and guidance set out in the London Plan and the LVMF will be refused.</p>',
      navGroup: 'protection',
      navGroupOrder: 11,
      active: false,
      layers: [{
        id: 215,
        type: 'shape',
        name: 'protected-vistas',
        displayName: 'Viewing Corridor',
        shortDescription: 'The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF)',
        longDescription: '<p>The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF). The London Plan seeks to protect the significant views which help to define London, including the panoramas, linear views and townscape views in this layer.</br> A planning application for a proposal that could affect one of these designated view should be accompanied by an analysis that explains, evaluates and justifies the visual impact on the view. Any planning application that is not consistent with the principles and guidance set out in the London Plan and the LVMF will be refused.</p>',
        z: 20,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        //popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>Classification: {classification} </p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 216,
        type: 'shape',
        name: 'protected-vistas-wsca',
        displayName: 'Wider Setting Consultation Area',
        shortDescription: 'The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF)',
        longDescription: '<p>The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF). The London Plan seeks to protect the significant views which help to define London, including the panoramas, linear views and townscape views in this layer.</br> A planning application for a proposal that could affect one of these designated view should be accompanied by an analysis that explains, evaluates and justifies the visual impact on the view. Any planning application that is not consistent with the principles and guidance set out in the London Plan and the LVMF will be refused.</p>',
        z: 29,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>Classification: {classification} </p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }, {
        id: 220,
        type: 'shape',
        name: 'protected-vistas-ext',
        displayName: 'Extension',
        shortDescription: 'The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF)',
        longDescription: '<p>The Protected Vistas are established in the London Plan with more detailed guidance provided in the London View Management Framework (LVMF). The London Plan seeks to protect the significant views which help to define London, including the panoramas, linear views and townscape views in this layer.</br> A planning application for a proposal that could affect one of these designated view should be accompanied by an analysis that explains, evaluates and justifies the visual impact on the view. Any planning application that is not consistent with the principles and guidance set out in the London Plan and the LVMF will be refused.</p>',
        z: 30,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.5,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}<br>Classification: {classification} </p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    },
    // councils
    {
      id: 1,
      group: 'planning_blp_city_of_london_01',
      groupDisplayName: 'planning_blp_city_of_london_01',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 1,
        type: 'shape',
        name: 'planning_blp_city_of_london_01',
        displayName: 'planning_blp_city_of_london_01',
        shortDescription: 'planning_blp_city_of_london_01',
        longDescription: 'planning_blp_city_of_london_01',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_city_of_london_01/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 2,
      group: 'planning_blp_barking_and_daenham_02',
      groupDisplayName: 'planning_blp_barking_and_daenham_02',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 2,
        type: 'shape',
        name: 'planning_blp_barking_and_daenham_02',
        displayName: 'planning_blp_barking_and_daenham_02',
        shortDescription: 'planning_blp_barking_and_daenham_02',
        longDescription: 'planning_blp_barking_and_daenham_02',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_barking_and_daenham_02/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 3,
      group: 'planning_blp_barnet_03',
      groupDisplayName: 'planning_blp_barnet_03ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 3,
        type: 'shape',
        name: 'planning_blp_barnet_03',
        displayName: 'planning_blp_barnet_03n',
        shortDescription: 'planning_blp_barnet_03eas',
        longDescription: 'planning_blp_barnet_03',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_barnet_03/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 4,
      group: 'planning_blp_bexley_04',
      groupDisplayName: 'planning_blp_bexley_04ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 4,
        type: 'shape',
        name: 'planning_blp_bexley_04',
        displayName: 'planning_blp_bexley_04n',
        shortDescription: 'planning_blp_bexley_04eas',
        longDescription: 'planning_blp_bexley_04',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_bexley_04/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 5,
      group: 'planning_blp_brent_05',
      groupDisplayName: 'planning_blp_brent_05London',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 5,
        type: 'shape',
        name: 'planning_blp_brent_05n',
        displayName: 'planning_blp_brent_05on',
        shortDescription: 'planning_blp_brent_05reas',
        longDescription: 'planning_blp_brent_05',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_brent_05/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 6,
      group: 'planning_blp_bromley_06',
      groupDisplayName: 'planning_blp_bromley_06ndon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 6,
        type: 'shape',
        name: 'planning_blp_bromley_06',
        displayName: 'planning_blp_bromley_06',
        shortDescription: 'planning_blp_bromley_06as',
        longDescription: 'planning_blp_bromley_06',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_bromley_06/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 7,
      group: 'planning_blp_camden_07',
      groupDisplayName: 'planning_blp_camden_07ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 7,
        type: 'shape',
        name: 'planning_blp_camden_07',
        displayName: 'planning_blp_camden_07n',
        shortDescription: 'planning_blp_camden_07eas',
        longDescription: 'planning_blp_camden_07',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_camden_07/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 8,
      group: 'planning_blp_croydon_08',
      groupDisplayName: 'planning_blp_croydon_08ndon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 8,
        type: 'shape',
        name: 'planning_blp_croydon_08',
        displayName: 'planning_blp_croydon_08',
        shortDescription: 'planning_blp_croydon_08as',
        longDescription: 'planning_blp_croydon_08',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_croydon_08/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 9,
      group: 'planning_blp_ealing_09',
      groupDisplayName: 'planning_blp_ealing_09ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 9,
        type: 'shape',
        name: 'planning_blp_ealing_09',
        displayName: 'planning_blp_ealing_09n',
        shortDescription: 'planning_blp_ealing_09eas',
        longDescription: 'planning_blp_ealing_09',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_ealing_09/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 10,
      group: 'planning_blp_enfield_10',
      groupDisplayName: 'planning_blp_enfield_10ndon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 10,
        type: 'shape',
        name: 'planning_blp_enfield_10',
        displayName: 'planning_blp_enfield_10',
        shortDescription: 'planning_blp_enfield_10as',
        longDescription: 'planning_blp_enfield_10',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_enfield_10/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 11,
      group: 'planning_blp_greenwich_11',
      groupDisplayName: 'planning_blp_greenwich_11on',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 11,
        type: 'shape',
        name: 'planning_blp_greenwich_11',
        displayName: 'planning_blp_greenwich_11',
        shortDescription: 'planning_blp_greenwich_11',
        longDescription: 'planning_blp_greenwich_11',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_greenwich_11/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 12,
      group: 'planning_blp_hackney_12',
      groupDisplayName: 'planning_blp_hackney_12ndon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 12,
        type: 'shape',
        name: 'planning_blp_hackney_12',
        displayName: 'planning_blp_hackney_12',
        shortDescription: 'planning_blp_hackney_12as',
        longDescription: 'planning_blp_hackney_12',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_hackney_12/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 13,
      group: 'planning_blp_hammersmith_and_fulham_13',
      groupDisplayName: 'planning_blp_hammersmith_and_fulham_13',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 13,
        type: 'shape',
        name: 'planning_blp_hammersmith_and_fulham_13',
        displayName: 'planning_blp_hammersmith_and_fulham_13',
        shortDescription: 'planning_blp_hammersmith_and_fulham_13',
        longDescription: 'planning_blp_hammersmith_and_fulham_13',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_hammersmith_and_fulham_13/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 14,
      group: 'planning_blp_haringey_14',
      groupDisplayName: 'planning_blp_haringey_14don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 14,
        type: 'shape',
        name: 'planning_blp_haringey_14',
        displayName: 'planning_blp_haringey_14',
        shortDescription: 'planning_blp_haringey_14s',
        longDescription: 'planning_blp_haringey_14',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_haringey_14/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 15,
      group: 'planning_blp_harrow_15',
      groupDisplayName: 'planning_blp_harrow_15ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 15,
        type: 'shape',
        name: 'planning_blp_harrow_15',
        displayName: 'planning_blp_harrow_15n',
        shortDescription: 'planning_blp_harrow_15eas',
        longDescription: 'planning_blp_harrow_15',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_harrow_15/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 16,
      group: 'planning_blp_havering_16',
      groupDisplayName: 'planning_blp_havering_16don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 16,
        type: 'shape',
        name: 'planning_blp_havering_16',
        displayName: 'planning_blp_havering_16',
        shortDescription: 'planning_blp_havering_16s',
        longDescription: 'planning_blp_havering_16',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_havering_16/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 17,
      group: 'planning_blp_hillingdon_17',
      groupDisplayName: 'planning_blp_hillingdon_17n',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 17,
        type: 'shape',
        name: 'planning_blp_hillingdon_17',
        displayName: 'planning_blp_hillingdon_17',
        shortDescription: 'planning_blp_hillingdon_17',
        longDescription: 'planning_blp_hillingdon_17',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_hillingdon_17/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 18,
      group: 'planning_blp_hounslow_18',
      groupDisplayName: 'planning_blp_hounslow_18don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 18,
        type: 'shape',
        name: 'planning_blp_hounslow_18',
        displayName: 'planning_blp_hounslow_18',
        shortDescription: 'planning_blp_hounslow_18s',
        longDescription: 'planning_blp_hounslow_18',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_hounslow_18/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 19,
      group: 'planning_blp_islington_19',
      groupDisplayName: 'planning_blp_islington_19on',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 19,
        type: 'shape',
        name: 'planning_blp_islington_19',
        displayName: 'planning_blp_islington_19',
        shortDescription: 'planning_blp_islington_19',
        longDescription: 'planning_blp_islington_19',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_islington_19/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 20,
      group: 'planning_blp_kensington_and_chelsea_20',
      groupDisplayName: 'planning_blp_kensington_and_chelsea_20',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 20,
        type: 'shape',
        name: 'planning_blp_kensington_and_chelsea_20',
        displayName: 'planning_blp_kensington_and_chelsea_20',
        shortDescription: 'planning_blp_kensington_and_chelsea_20',
        longDescription: 'planning_blp_kensington_and_chelsea_20',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_kensington_and_chelsea_20/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 21,
      group: 'planning_blp_kingston_21',
      groupDisplayName: 'planning_blp_kingston_21don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 21,
        type: 'shape',
        name: 'planning_blp_kingston_21',
        displayName: 'planning_blp_kingston_21',
        shortDescription: 'planning_blp_kingston_21s',
        longDescription: 'planning_blp_kingston_21',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_kingston_21/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 22,
      group: 'planning_blp_lambeth_22',
      groupDisplayName: 'planning_blp_lambeth_22ndon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 22,
        type: 'shape',
        name: 'planning_blp_lambeth_22',
        displayName: 'planning_blp_lambeth_22',
        shortDescription: 'planning_blp_lambeth_22as',
        longDescription: 'planning_blp_lambeth_22',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_lambeth_22/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 23,
      group: 'planning_blp_lewisham_23',
      groupDisplayName: 'planning_blp_lewisham_23don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 23,
        type: 'shape',
        name: 'planning_blp_lewisham_23',
        displayName: 'planning_blp_lewisham_23',
        shortDescription: 'planning_blp_lewisham_23s',
        longDescription: 'planning_blp_lewisham_23',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_lewisham_23/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 24,
      group: 'planning_blp_merton_24',
      groupDisplayName: 'planning_blp_merton_24ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 24,
        type: 'shape',
        name: 'planning_blp_merton_24',
        displayName: 'planning_blp_merton_24n',
        shortDescription: 'planning_blp_merton_24eas',
        longDescription: 'planning_blp_merton_24',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_merton_24/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 25,
      group: 'planning_blp_newham_25',
      groupDisplayName: 'planning_blp_newham_25ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 25,
        type: 'shape',
        name: 'planning_blp_newham_25',
        displayName: 'planning_blp_newham_25n',
        shortDescription: 'planning_blp_newham_25eas',
        longDescription: 'planning_blp_newham_25',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_newham_25/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 26,
      group: 'planning_blp_redbridge_26',
      groupDisplayName: 'planning_blp_redbridge_26on',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 26,
        type: 'shape',
        name: 'planning_blp_redbridge_26',
        displayName: 'planning_blp_redbridge_26',
        shortDescription: 'planning_blp_redbridge_26',
        longDescription: 'planning_blp_redbridge_26',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_redbridge_26/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 27,
      group: 'planning_blp_richmond_27',
      groupDisplayName: 'planning_blp_richmond_27don',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 27,
        type: 'shape',
        name: 'planning_blp_richmond_27',
        displayName: 'planning_blp_richmond_27',
        shortDescription: 'planning_blp_richmond_27s',
        longDescription: 'planning_blp_richmond_27',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_richmond_27/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 28,
      group: 'planning_blp_southwark_28',
      groupDisplayName: 'planning_blp_southwark_28on',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 28,
        type: 'shape',
        name: 'planning_blp_southwark_28',
        displayName: 'planning_blp_southwark_28',
        shortDescription: 'planning_blp_southwark_28',
        longDescription: 'planning_blp_southwark_28',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_southwark_28/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 29,
      group: 'planning_blp_sutton_29',
      groupDisplayName: 'planning_blp_sutton_29ondon',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 29,
        type: 'shape',
        name: 'planning_blp_sutton_29',
        displayName: 'planning_blp_sutton_29n',
        shortDescription: 'planning_blp_sutton_29eas',
        longDescription: 'planning_blp_sutton_29',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_sutton_29/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 30,
      group: 'planning_blp_tower_hamlets_30',
      groupDisplayName: 'planning_blp_tower_hamlets_30',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 30,
        type: 'shape',
        name: 'planning_blp_tower_hamlets_30',
        displayName: 'planning_blp_tower_hamlets_30',
        shortDescription: 'planning_blp_tower_hamlets_30',
        longDescription: 'planning_blp_tower_hamlets_30',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_tower_hamlets_30/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 31,
      group: 'planning_blp_waltham_forest_31',
      groupDisplayName: 'planning_blp_waltham_forest_31',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 31,
        type: 'shape',
        name: 'planning_blp_waltham_forest_31',
        displayName: 'planning_blp_waltham_forest_31',
        shortDescription: 'planning_blp_waltham_forest_31',
        longDescription: 'planning_blp_waltham_forest_31',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_waltham_forest_31/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 32,
      group: 'planning_blp_wandsworth_32',
      groupDisplayName: 'planning_blp_wandsworth_32n',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 32,
        type: 'shape',
        name: 'planning_blp_wandsworth_32',
        displayName: 'planning_blp_wandsworth_32',
        shortDescription: 'planning_blp_wandsworth_32',
        longDescription: 'planning_blp_wandsworth_32',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_wandsworth_32/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 33,
      group: 'planning_blp_westminster_33',
      groupDisplayName: 'planning_blp_westminster_33',
      navGroup: 'councils',
      navGroupOrder: 0,
      active: true,
      layers: [{
        id: 33,
        type: 'shape',
        name: 'planning_blp_westminster_33',
        displayName: 'planning_blp_westminster_33',
        shortDescription: 'planning_blp_westminster_33',
        longDescription: 'planning_blp_westminster_33',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_blp_westminster_33/MapServer/0',
        appendIDtoURL: false,
        active: true,
        swatches: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#ffffff'],
        color: '#ffffff',
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    },
    //context layer:
    {
      id: 105,
      group: 'housing-zones',
      groupDisplayName: 'Housing Zones',
      navGroup: 'context',
      navGroupOrder: 0,
      active: false,
      layers: [{
        id: 105,
        type: 'shape',
        name: 'housing-zones',
        displayName: 'Housing Zones',
        shortDescription: 'Housing zones are areas funded by the Mayor and government to attract developers and relevant partners to build new homes.',
        longDescription: 'Housing zones are areas funded by the Mayor and government to attract developers and relevant partners to build new homes.',
        z: 5,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.7,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 304,
      group: 'cez',
      groupDisplayName: 'Creative Enterprise Zones',
      navGroup: 'context',
      navGroupOrder: 1,
      active: false,
      layers: [{
        id: 304,
        type: 'shape',
        name: 'cez',
        displayName: 'Creative Enterprise Zones',
        shortDescription: 'Creative Enterprise Zones are a new Mayoral initiative to designate areas of London where artists and creative businesses can find permanent affordable space to work',
        longDescription: 'Creative Enterprise Zones are a new Mayoral initiative to designate areas of London where artists and creative businesses can find permanent affordable space to work; are supported to start-up and grow; and where local people are helped to learn creative sector skills and find new jobs.',
        z: 45,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.4,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 306,
      group: 'air-quality-focus-areas',
      groupDisplayName: 'Air Quality Focus Areas',
      navGroup: 'context',
      navGroupOrder: 1,
      active: false,
      layers: [{
        id: 306,
        type: 'shape',
        name: 'air-quality-focus-areas',
        displayName: 'Air Quality Focus Areas',
        shortDescription: "Areas designated as an Air Quality Focus Area. Click on an area to read it's Borough Air Quality Action Plan.",
        longDescription: "<p>Areas designated as an <strong>Air Quality Focus Area.</strong> These are locations that not only exceed the EU annual mean limit value for NO2 but are also locations with high human exposure. For more information about action being taken to tackle the pollution in this area please click on an area to read it's Borough Air Quality Action Plan.",
        z: 36,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 0.4,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        //popup: '<p><strong>Air Quality Focus Area:</strong><br>This area is designated an <strong>Air Quality Focus Area.</strong> These are locations that not only exceed the EU annual mean limit value for NO2 but are also locations with high human exposure, based on the latest modelling (LAEI 2016). For more information about action being taken to tackle the pollution in this area please read the <a href="{url}" target="_blank">Borough Air Quality Action Plan</a>.</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 307,
      group: 'waste',
      groupDisplayName: 'Waste Sites',
      navGroup: 'context',
      navGroupOrder: 1,
      active: false,
      layers: [{
        id: 307,
        type: 'point',
        name: 'waste',
        displayName: 'Waste Sites',
        icon: 'wst',
        color: '#764a24',
        shortDescription: 'This layer shows the locations of London’s permitted waste facilities.',
        longDescription: 'This layer shows the locations of London’s permitted waste facilities.',
        z: 37,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        clustered: true,
        opacity: 1,
        userControl: true,
        popup: '<p><strong>{designation}:</strong><br>{sitename}</p>',
        //popup: '<p><strong>Air Quality Focus Area:</strong><br>This area is designated an <strong>Air Quality Focus Area.</strong> These are locations that not only exceed the EU annual mean limit value for NO2 but are also locations with high human exposure, based on the latest modelling (LAEI 2016). For more information about action being taken to tackle the pollution in this area please read the <a href="{url}" target="_blank">Borough Air Quality Action Plan</a>.</p>',
        clickCustomFunction: true,
        clickZoomToFeature: true,
        pointSearchable: true,
        layerObject: null
      }]
    }, {
      id: 305,
      group: 'central-london-boundary',
      groupDisplayName: 'Central London Boundary',
      navGroup: 'context',
      navGroupOrder: 11,
      active: false,
      layers: [{
        id: 305,
        type: 'shape',
        name: 'central-london-boundary',
        displayName: 'Central London Boundary',
        shortDescription: 'Toggle on/off Central London Boundary',
        longDescription: '',
        z: 29,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        //where: 'la_gss_code = null', // initially no feature selection in layer
        active: false,
        opacity: 1,
        userControl: true,
        pointSearchable: false,
        layerObject: null
      }]
    }, {
      id: 301,
      group: 'london-borough',
      groupDisplayName: 'London Borough',
      navGroup: 'context',
      navGroupOrder: 12,
      active: false,
      layers: [{
        id: 301,
        type: 'shape',
        name: 'london-borough',
        displayName: 'London Borough',
        shortDescription: 'Toggle on/off London Borough Boundary',
        longDescription: '',
        z: 2,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        //where: 'la_gss_code = null', // initially no feature selection in layer
        active: false,
        opacity: 1,
        userControl: true,
        pointSearchable: false,
        layerObject: null
      }]
    }, {
      id: 302,
      group: 'planning-authority-boundary',
      groupDisplayName: 'Planning Authority',
      navGroup: 'context',
      navGroupOrder: 13,
      active: false,
      layers: [{
        id: 302,
        type: 'shape',
        name: 'planning-authority-boundary',
        displayName: 'Planning Authority',
        shortDescription: 'Toggle on/off Planning Authority Boundary',
        longDescription: '',
        z: 3,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 1,
        userControl: true,
        pointSearchable: false,
        layerObject: null
      }]
    }, {
      id: 303,
      group: 'greater-london-boundary',
      groupDisplayName: 'Greater London Boundary',
      navGroup: 'context',
      navGroupOrder: 14,
      active: false,
      layers: [{
        id: 303,
        type: 'shape',
        name: 'greater-london-boundary',
        displayName: 'Greater London Boundary',
        shortDescription: 'Toggle on/off Greater London Boundary',
        longDescription: '',
        z: 16,
        url: 'https://gis.london.gov.uk/arcgis/rest/services/apps/planning_data_map_02/MapServer/',
        appendIDtoURL: true,
        active: false,
        opacity: 1,
        userControl: true,
        pointSearchable: false,
        layerObject: null
      }]
    }, {
      id: 0,
      group: 'basemaps',
      groupDisplayName: 'London Basemaps',
      navGroup: 'context',
      navGroupOrder: 15,
      active: false, // if a single layer group, or if inner (multiple) layers are active, set to true
      layers: [{
        id: 1,
        type: 'os-vector-tile',
        name: 'basemap-light',
        displayName: 'Light Basemap',
        shortDescription: 'Lighter London basemap.',
        longDescription: '',
        z: 0,
        // url: 'https://api.os.uk/maps/vector/v1/vts', // new OS Vector Tile api (2021)
        apiKey: 'vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP',
        customStyleUrl: 'data/OS_VTS_3857_Open_Greyscale.json',
        active: false,
        userControl: true,
        radioGroup: 'basemaps',
        layerObject: null
      }, {
        id: 0,
        type: 'os-vector-tile',
        name: 'basemap-dark',
        displayName: 'Dark Basemap',
        shortDescription: 'Darker London basemap',
        longDescription: '',
        z: 0,
        // url: 'https://api.os.uk/maps/vector/v1/vts', // new OS Vector Tile api (2021)
        apiKey: 'vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP',
        customStyleUrl: 'data/OS_VTS_3857_Open_GLA_Dark_Greyscale_GLA_Muted_Buildings.json',
        active: false,
        userControl: true,
        radioGroup: 'basemaps',
        layerObject: null
      }]
    }]
  },
  computed: {
    orderedLayerGroups: function orderedLayerGroups() {
      // using lodash
      return _.orderBy(this.layerGroups, 'navGroupOrder');
    }
  },
  methods: {
    initMap: function initMap() {
      VueAwesome.register({
        iconEnvironment: {
          width: 512,
          height: 512,
          //d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6Zm94.25,348.71a20,20,0,1,1-32.69,23.05l-61.3-86.94L195,377.76a20,20,0,1,1-32.69-23.05l69.52-98.6-69.52-98.6A20,20,0,0,1,195,134.47l61.3,86.94,61.3-86.94a20,20,0,0,1,32.69,23.05l-69.52,98.6Z'
          d: 'M510.052,291.984c-0.016-0.306-0.045-0.613-0.089-0.919L484.3,112.497c-0.437-3.039-2.245-5.709-4.904-7.242,c-2.658-1.533-5.875-1.761-8.726-0.615l-118.103,47.482c-5.125,2.06-7.608,7.885-5.549,13.009,c2.061,5.126,7.887,7.609,13.01,5.549l106.284-42.731l23.681,164.776c0.013,0.464,0.059,0.93,0.138,1.396,c5.178,30.482-0.491,62.025-15.96,88.819c-17.815,30.856-46.613,52.909-81.092,62.096c-34.488,9.19-70.529,4.409-101.487-13.463,c-0.214-0.124-0.434-0.228-0.653-0.334c6.637-5.044,12.88-10.505,18.703-16.347l117.078-31.371,c5.336-1.429,8.502-6.914,7.072-12.249c-1.429-5.335-6.917-8.502-12.248-7.072l-90.086,24.138,c9.899-14.726,17.643-30.966,22.935-48.341l80.372-21.535c5.336-1.429,8.502-6.914,7.072-12.249,c-1.429-5.335-6.917-8.502-12.248-7.072l-59.138,15.846l22.238-38.519l46.995-12.592c5.336-1.429,8.502-6.914,7.072-12.249,c-1.43-5.335-6.917-8.502-12.248-7.072l-27.675,7.416l21.28-36.859c2.762-4.784,1.123-10.9-3.66-13.661,c-4.784-2.762-10.9-1.123-13.661,3.66l-21.28,36.858l-7.416-27.675c-1.43-5.335-6.915-8.502-12.248-7.072,c-5.336,1.429-8.502,6.914-7.072,12.249l12.592,46.995l-13.012,22.538c0.384-32.013-7.807-63.649-24.224-92.083,c-20.673-35.806-53.298-63.614-91.906-78.346c-0.063-0.027-0.128-0.054-0.192-0.081l-45.252-18.366,c-5.122-2.077-10.95,0.389-13.027,5.506c-2.077,5.119,0.388,10.951,5.506,13.028l44.84,18.198c0.203,0.093,0.41,0.179,0.62,0.259,c34.489,13.061,63.643,37.85,82.089,69.801c21.472,37.192,27.136,80.543,15.948,122.071,c-10.321,38.306-33.847,70.82-66.707,92.544l-16.784-29.07l36.387-135.796c1.43-5.336-1.736-10.819-7.072-12.249,c-5.339-1.429-10.818,1.737-12.248,7.072L239.125,367.97l-37.026-64.131l25.244-94.208c1.43-5.336-1.736-10.819-7.072-12.249,c-5.337-1.43-10.818,1.737-12.248,7.072l-20.066,74.888l-29.187-50.553l15.203-56.735c1.43-5.336-1.736-10.819-7.072-12.249,c-5.338-1.429-10.818,1.737-12.248,7.072l-10.027,37.415l-27.65-47.892c-2.761-4.783-8.878-6.423-13.661-3.66,c-4.784,2.761-6.423,8.878-3.66,13.661l27.65,47.891l-37.414-10.025c-5.337-1.43-10.818,1.737-12.248,7.072,c-1.43,5.336,1.736,10.819,7.072,12.249l56.734,15.203l29.187,50.553l-74.886-20.065c-5.337-1.43-10.818,1.737-12.248,7.072,c-1.43,5.336,1.736,10.819,7.072,12.249l94.206,25.243l37.026,64.131l-116.475-31.209c-5.338-1.43-10.818,1.737-12.248,7.072,c-1.43,5.336,1.736,10.819,7.072,12.249l135.795,36.386l16.782,29.067c-75.574,37.666-168.581,10.538-211.238-63.345,c-18.646-32.296-25.478-70.316-19.237-107.057c0.085-0.496,0.13-0.991,0.138-1.484L50.952,60.908l66.251,26.889,c5.123,2.078,10.95-0.388,13.027-5.506c2.077-5.119-0.388-10.951-5.506-13.028L46.632,37.567,c-2.849-1.155-6.075-0.937-8.741,0.594c-2.667,1.531-4.481,4.205-4.919,7.251L2.408,258.086c-0.049,0.337-0.079,0.675-0.093,1.01,c-6.638,40.917,1.104,83.157,21.853,119.095c33.413,57.875,94.294,90.246,156.878,90.245c27.641,0,55.609-6.339,81.693-19.56,l12.291,21.288c1.853,3.208,5.214,5.002,8.671,5.002c1.696,0,3.416-0.432,4.991-1.341c4.784-2.761,6.423-8.878,3.66-13.661,l-4.557-7.894c22.098,11.472,46.201,17.341,70.592,17.341c13.29,0,26.666-1.737,39.843-5.248,c39.65-10.566,72.773-35.932,93.264-71.423C509.083,362.476,515.655,326.672,510.052,291.984z'
        },
        iconCommercial: {
          width: 512,
          height: 512,
          //d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6ZM391.25,169.52,236,389.76a20,20,0,0,1-27.87,4.82L114.4,328.52a20,20,0,0,1,23.05-32.69l77.34,54.54,143.77-203.9a20,20,0,0,1,32.69,23.05Z'
          //d:'M446,47.432V30c0-16.542-13.458-30-30-30H96C79.458,0,66,13.458,66,30v17.432C0.773,167.896,0.003,164.319,0,169.989,c0,0.004,0,0.007,0,0.011v20c0,17.333,10.022,33.453,26,42.62V502c0,5.522,4.478,10,10,10h440c5.522,0,10-4.478,10-10V232.62,c15.817-9.159,26-25.469,26-42.62v-20c0-0.004,0-0.007,0-0.011C511.997,164.258,510.591,166.721,446,47.432z M485.088,160h-61.88,L389.875,60h40.213L485.088,160z M346,180h60v10c0,16.542-13.458,30-30,30s-30-13.458-30-30V180z M344.471,160L327.805,60h40.987,l33.333,100H344.471z M86,30c0-5.514,4.486-10,10-10h320c5.514,0,10,4.486,10,10v10c-9.522,0-330.404,0-340,0V30z M326,180v10,c0,16.542-13.458,30-30,30s-30-13.458-30-30v-10H326z M266,160V60h41.529l16.667,100H266z M187.805,160l16.667-100H246v100,H187.805z M246,180v10c0,16.542-13.458,30-30,30s-30-13.458-30-30v-10H246z M109.874,160l33.333-100h40.988l-16.667,100H109.874z,M166,180v10c0,16.542-13.458,30-30,30s-30-13.458-30-30v-10H166z M81.912,60h40.213L88.792,160h-61.88L81.912,60z M20,190v-10h66,v10c0,15.701-15.729,30-33,30c-4.354,0-8.866-0.945-13.066-2.742C28.011,212.187,20,201.232,20,190z M206,492H106v-86h100V492z,M206,386H106v-86h100V386z M466,492H226V290c0-5.522-4.478-10-10-10H96c-5.522,0-10,4.478-10,10v202H46V239.511,c2.318,0.315,4.653,0.489,7,0.489c13.161,0,26.465-5.214,36.498-14.306c2.219-2.01,4.217-4.16,6.01-6.413,C104.602,231.822,119.36,240,136,240c16.339,0,30.87-7.878,40-20.035C185.13,232.122,199.661,240,216,240s30.87-7.878,40-20.035,C265.13,232.122,279.661,240,296,240s30.87-7.878,40-20.035C345.13,232.122,359.661,240,376,240,c16.64,0,31.398-8.178,40.492-20.719c1.793,2.253,3.791,4.402,6.01,6.413C432.535,234.786,445.839,240,459,240,c2.342,0,4.677-0.168,7-0.485V492z M492,190c0,11.548-8.309,22.629-20.674,27.575c-4.044,1.61-8.19,2.425-12.326,2.425,c-17.271,0-33-14.299-33-30v-10h66V190z'
          //d:'M16.4,432.1c0,51.2,38.9,93.8,91.3,106.2v361.5H46.9c-16.8,0-30.4,12.3-30.4,27.5c0,15.2,13.7,27.5,30.4,27.5h912.7c16.9,0,30.4-12.3,30.4-27.5c0-15.2-13.6-27.5-30.4-27.5h-60.9V538.3c52.4-12.3,91.3-55,91.3-106.2v-27.5H16.4V432.1L16.4,432.1z M396.2,541.3c60.9-6.1,107-52.6,107-109.2c0,60.8,54.5,110,121.7,110c67.3,0,121.7-49.3,121.7-110c0,51.2,38.9,93.8,91.3,106.2v361.5H396.8 M351.1,538.3v361.5H168.6V538.3c52.4-12.3,91.3-55,91.3-106.2C259.8,483.3,298.7,525.9,351.1,538.3 M868.3,142.4H138.1L10,362.4h973.6L868.3,142.4L868.3,142.4z M273.5,203.5l-60.9,110c-2.7,4.8-8.1,7.6-13.7,7.6c-2.3,0-4.6-0.4-6.8-1.4c-7.5-3.4-10.6-11.7-6.8-18.4l60.8-110c3.8-6.8,12.9-9.5,20.4-6.2C274.2,188.5,277.2,196.8,273.5,203.5 M395.2,203.5l-56.5,110c-2.7,4.8-8.1,7.6-13.7,7.6c-2.3,0-4.6-0.4-6.8-1.4c-7.5-3.4-10.6-11.7-6.8-18.4l56.5-110c3.8-6.8,12.9-9.5,20.4-6.2C395.9,188.5,398.9,196.8,395.2,203.5 M682.4,319.5c-2.4,1.2-4.9,1.7-7.4,1.7c-5.4,0-10.6-2.6-13.3-7.1l-55.9-110c-4-6.7-1.3-15.1,6.1-18.7c7.3-3.6,16.7-1.3,20.7,5.4l55.8,110C692.4,307.5,689.8,315.9,682.4,319.5 M814.2,319.8c-2.1,1-4.4,1.4-6.8,1.4c-5.6,0-10.9-2.8-13.5-7.6l-60.9-110c-3.8-6.8-0.7-15,6.8-18.4c7.4-3.4,16.6-0.7,20.4,6.2l60.9,110C824.8,308.1,821.9,316.4,814.2,319.8 M261.3,718.4v-57.3c-8.1-4.4-13.8-12-13.8-21.1c0-13.7,12.4-24.8,27.5-24.8c15.2,0,27.5,11.1,27.5,24.8c0,9.1-5.6,16.7-13.8,21.1v57.3c8.1,4.4,13.8,11.9,13.8,21.1c0,13.7-12.2,24.8-27.5,24.8c-15.1,0-27.5-11.1-27.5-24.8C247.6,730.4,253.3,722.8,261.3,718.4 M138.1,72.7c0-15.2,13.7-27.5,30.4-27.5h669.3c16.9,0,30.4,12.3,30.4,27.5c0,15.2-13.5,27.5-30.4,27.5H168.5C151.8,100.3,138.1,87.9,138.1,72.7L138.1,72.7z'
          d: 'M448,80H64L0,144v16v64c0,35.344,28.688,64,64,64v160c-35.313,0-64,28.656-64,64h512c0-35.344-28.625-64-64-64V288,c35.375,0,64-28.656,64-64v-64v-16L448,80z M384,224c0,17.656-14.375,32-32,32s-32-14.344-32-32v-64h64V224z M192,224,c0,17.656-14.344,32-32,32c-17.625,0-32-14.344-32-32v-64h64V224z M224,160h64v64c0,17.656-14.344,32-32,32,c-17.625,0-32-14.344-32-32V160z M32,224v-64h64v64c0,17.656-14.344,32-32,32C46.375,256,32,241.656,32,224z M96,448V279.125,c6.063-3.531,11.438-7.938,16-13.188C123.75,279.343,140.813,288,160,288c19.25,0,36.281-8.656,48-22.062,C219.75,279.343,236.813,288,256,288c11.75,0,22.562-3.375,32-8.875V448H96z M416,448h-96V279.125c9.438,5.5,20.312,8.875,32,8.875,c19.25,0,36.312-8.656,48-22.062c4.625,5.25,9.938,9.655,16,13.188V448z M480,224c0,17.656-14.375,32-32,32s-32-14.344-32-32v-64,h64V224z M448,64H64V0h384V64z M368,352c0,8.844-7.125,16-16,16c-8.812,0-16-7.156-16-16s7.188-16,16-16,C360.875,336,368,343.156,368,352z'
        },
        iconHousing: {
          width: 512, //512,
          height: 512, //512,
          //d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6ZM440.44,266H422s0,.1,0,.14V303a18.5,18.5,0,0,1-37,0V266.14s0-.1,0-.14h-12.2s0,.1,0,.14V376.81a18.5,18.5,0,1,1-37,0V266.14s0-.1,0-.14h-12.2s0,.1,0,.14v73.78a18.5,18.5,0,0,1-37,0V266.14s0-.1,0-.14h-12.2s0,.1,0,.14V432a18.5,18.5,0,0,1-37,0V266.14s0-.1,0-.14h-166a10,10,0,0,1,0-20H90s0-.1,0-.14V190.52a18.5,18.5,0,1,1,37,0v55.33s0,.1,0,.14h12.2s0-.1,0-.14v-93a18.5,18.5,0,0,1,37,0v93s0,.1,0,.14h12.2s0-.1,0-.14V80a18.5,18.5,0,0,1,37,0V245.86s0,.1,0,.14H440.44a10,10,0,0,1,0,20Z'
          //d: 'M481.708,220.456l-228.8-204.6c-0.4-0.4-0.8-0.7-1.3-1c-5-4.8-13-5-18.3-0.3l-228.8,204.6c-5.6,5-6,13.5-1.1,19.1,c2.7,3,6.4,4.5,10.1,4.5c3.2,0,6.4-1.1,9-3.4l41.2-36.9v7.2v106.8v124.6c0,18.7,15.2,34,34,34c0.3,0,0.5,0,0.8,0s0.5,0,0.8,0h70.6,c17.6,0,31.9-14.3,31.9-31.9v-121.3c0-2.7,2.2-4.9,4.9-4.9h72.9c2.7,0,4.9,2.2,4.9,4.9v121.3c0,17.6,14.3,31.9,31.9,31.9h72.2,c19,0,34-18.7,34-42.6v-111.2v-34v-83.5l41.2,36.9c2.6,2.3,5.8,3.4,9,3.4c3.7,0,7.4-1.5,10.1-4.5,C487.708,233.956,487.208,225.456,481.708,220.456z M395.508,287.156v34v111.1c0,9.7-4.8,15.6-7,15.6h-72.2c-2.7,0-4.9-2.2-4.9-4.9,v-121.1c0-17.6-14.3-31.9-31.9-31.9h-72.9c-17.6,0-31.9,14.3-31.9,31.9v121.3c0,2.7-2.2,4.9-4.9,4.9h-70.6c-0.3,0-0.5,0-0.8,0,s-0.5,0-0.8,0c-3.8,0-7-3.1-7-7v-124.7v-106.8v-31.3l151.8-135.6l153.1,136.9L395.508,287.156L395.508,287.156z'
          d: 'M506.552,317.933c-9.739-14.312-29.351-18.1-43.707-8.452l-65.34,43.728l-0.19-136.11l22.7,21.265c4.827,4.521,11.121,7.009,17.729,7.009c0.012,0,0.026,0,0.039,0c7.134-0.01,14.022-3,18.898-8.205c4.737-5.057,7.222-11.655,6.996-18.581c-0.226-6.926-3.136-13.349-8.193-18.086l-43.035-40.314c-2.946-2.76-7.571-2.609-10.33,0.337c-2.759,2.946-2.608,7.57,0.337,10.33l43.035,40.314c2.208,2.068,3.478,4.872,3.577,7.895c0.098,3.023-0.986,5.904-3.055,8.111c-2.16,2.306-5.09,3.578-8.252,3.582c-0.006,0-0.011,0-0.017,0c-2.883,0-5.63-1.086-7.737-3.06c-0.001-0.001-0.001-0.001-0.001-0.001L259.124,67.616c-2.816-2.637-7.198-2.633-10.007,0.014L78.679,228.188c-2.201,2.074-5.079,3.16-8.103,3.076c-3.024-0.09-5.831-1.353-7.905-3.556c-2.074-2.201-3.167-5.079-3.076-8.102c0.09-3.024,1.353-5.831,3.554-7.905L246.326,39.143c4.342-4.091,11.154-4.101,15.507-0.021L369,139.514c2.945,2.759,7.57,2.609,10.33-0.337c2.759-2.946,2.608-7.57-0.337-10.33L271.827,28.455c-9.973-9.344-25.576-9.323-35.523,0.049l-58.639,55.24l-0.016-9.853c-0.004-3.106-1.218-6.024-3.417-8.216c-2.195-2.189-5.109-3.394-8.209-3.394c-0.006,0-0.011,0-0.017,0l-41.947,0.059c-3.106,0.004-6.023,1.218-8.216,3.417c-2.192,2.199-3.398,5.12-3.393,8.227l0.116,71.087l-59.439,55.993c-5.044,4.751-7.935,11.182-8.142,18.108c-0.207,6.926,2.296,13.518,7.047,18.56c4.75,5.044,11.181,7.936,18.108,8.143c0.265,0.008,0.53,0.012,0.795,0.012c6.635,0,12.918-2.49,17.767-7.06l22.649-21.336l0.09,64.291c-7.328-1.067-14.742-1.627-22.19-1.627H76.746v-4.382c0-14.711-11.969-26.68-26.68-26.68H26.68C11.969,249.092,0,261.06,0,275.772V390.29c0,4.036,3.272,7.308,7.308,7.308s7.308-3.272,7.308-7.308V275.772c0-6.652,5.412-12.064,12.064-12.064h23.385c6.652,0,12.064,5.412,12.064,12.064v11.69v149.796v11.575c0,6.652-5.412,12.064-12.064,12.064H26.68c-6.652,0-12.064-5.412-12.064-12.064v-12.788c0-4.036-3.272-7.308-7.308-7.308S0,432.009,0,436.045v12.788c0,14.711,11.969,26.68,26.68,26.68h23.385c14.711,0,26.68-11.968,26.68-26.68v-0.993l107.024,40.528c0.198,0.075,0.399,0.141,0.603,0.198c4.653,1.314,9.304,1.973,13.896,1.973c2.484,0,4.951-0.193,7.393-0.579l157.281-22.672c0.037-0.005,0.073-0.011,0.11-0.017c13.372-2.135,25.987-7.788,36.48-16.346c0.091-0.074,0.181-0.151,0.268-0.23l101.611-91.388C513.244,348.802,515.453,331.015,506.552,317.933z M163.037,76.902l0.034,20.59l-35.912,33.83l-0.089-54.371L163.037,76.902zM254.141,82.976l128.538,120.412l0.223,159.593l-20.691,13.848L340.3,375.6l-0.579-5.82c-2.039-20.498-17.171-36.987-37.18-40.922l-0.132-94.945c-0.01-7.286-5.942-13.207-13.227-13.207c-0.006,0-0.011,0-0.018,0l-69.654,0.098c-3.533,0.005-6.853,1.385-9.347,3.887c-2.495,2.501-3.866,5.825-3.861,9.357l0.116,82.781c-13.797-3.154-26.971-8.363-39.288-15.568c-1.537-0.899-3.089-1.767-4.654-2.611c-0.61-0.329-1.23-0.638-1.845-0.959c-0.952-0.497-1.902-0.997-2.864-1.474c-0.766-0.38-1.541-0.74-2.313-1.107c-0.819-0.389-1.637-0.782-2.462-1.157c-0.84-0.381-1.687-0.744-2.533-1.11c-0.773-0.334-1.546-0.67-2.324-0.991c-0.87-0.359-1.745-0.704-2.621-1.047c-0.777-0.304-1.555-0.606-2.336-0.898c-0.867-0.324-1.738-0.637-2.611-0.944c-0.819-0.289-1.639-0.571-2.463-0.846c-0.836-0.279-1.674-0.552-2.516-0.817c-0.897-0.283-1.798-0.553-2.7-0.82c-0.775-0.228-1.549-0.456-2.328-0.672c-1.017-0.283-2.039-0.548-3.062-0.81c-0.479-0.123-0.955-0.262-1.437-0.381l-0.113-80.878L254.141,82.976z M287.923,327.029l-61.125-7.037l-5.759-0.663l-0.118-83.911l66.874-0.094L287.923,327.029z M491.673,348.41l-101.511,91.298c-8.459,6.859-18.606,11.396-29.361,13.122l-157.213,22.662c-0.033,0.005-0.065,0.01-0.098,0.015l-0.109,0.017c-4.763,0.754-9.723,0.436-14.744-0.942L76.746,432.21V294.77h12.505c10.645,0,21.218,1.229,31.514,3.616c0.383,0.089,0.765,0.18,1.147,0.272c1.265,0.305,2.527,0.619,3.783,0.959c0.11,0.03,0.219,0.062,0.329,0.092c1.259,0.344,2.513,0.707,3.763,1.086c0.224,0.068,0.449,0.135,0.672,0.204c1.33,0.411,2.654,0.84,3.971,1.29c0.136,0.047,0.271,0.095,0.407,0.142c2.743,0.947,5.459,1.98,8.141,3.098c0.146,0.061,0.292,0.122,0.438,0.184c1.337,0.562,2.666,1.143,3.986,1.747c0.035,0.016,0.071,0.033,0.106,0.05c1.276,0.586,2.543,1.194,3.802,1.819c0.148,0.073,0.297,0.145,0.445,0.219c1.23,0.615,2.45,1.252,3.663,1.904c0.229,0.123,0.457,0.249,0.686,0.373c1.224,0.667,2.441,1.347,3.646,2.052c17.391,10.173,36.323,16.762,56.271,19.585c0.063,0.009,0.125,0.017,0.188,0.024l81.881,9.427c0.453,0.065,0.903,0.14,1.35,0.224c12.054,2.264,21.568,11.171,24.751,22.77c0.472,1.718,0.804,3.496,0.986,5.319l0.325,3.27l-153.46-13.445c-4.018-0.351-7.566,2.622-7.918,6.642c-0.353,4.021,2.622,7.566,6.642,7.918l162.242,14.215c0.039,0.003,0.077,0.002,0.115,0.005c0.038,0.003,0.075,0.009,0.114,0.012l30.597,1.717c0.137,0.008,0.273,0.011,0.409,0.011c0.145,0,0.288-0.023,0.432-0.032c0.163-0.01,0.326-0.016,0.488-0.036c0.218-0.028,0.431-0.075,0.645-0.122c0.153-0.034,0.307-0.059,0.457-0.103c0.234-0.067,0.459-0.158,0.686-0.249c0.122-0.049,0.248-0.086,0.368-0.142c0.341-0.158,0.673-0.34,0.989-0.552l25.972-17.381c0.001-0.001,0.002-0.002,0.003-0.003l76.702-51.332c7.717-5.187,18.251-3.152,23.482,4.536C499.249,333.181,498.062,342.736,491.673,348.41z'
        },
        iconCouncils: {
          width: 48,
          height: 48,
          d: 'M25.4051,9.44786a4.47393,4.47393,0,1,0-4.474-4.47393A4.479,4.479,0,0,0,25.4051,9.44786Zm0-8.17815a3.70422,3.70422,0,1,1-3.70425,3.70422A3.70841,3.70841,0,0,1,25.4051,1.26971ZM12.84984,15.79763A4.47393,4.47393,0,1,0,8.37591,11.3237,4.479,4.479,0,0,0,12.84984,15.79763Zm0-8.17815A3.70422,3.70422,0,1,1,9.14561,11.3237,3.70841,3.70841,0,0,1,12.84984,7.61948Zm.24053,34.0115v5.48417a.38485.38485,0,1,1-.76971,0V41.631a.38485.38485,0,1,1,.76971,0Zm24.866-26.122a4.47393,4.47393,0,1,0-4.47393-4.47393A4.479,4.479,0,0,0,37.95641,15.509Zm0-8.17815a3.70422,3.70422,0,1,1-3.70422,3.70422A3.70841,3.70841,0,0,1,37.95641,7.33083Zm8.34366,15.2739v12.155a2.04293,2.04293,0,0,1-3.31937,1.59669V47.01893a.38485.38485,0,0,1-.76971,0V22.80518a.38485.38485,0,0,1,.76971,0V34.75974a1.27483,1.27483,0,0,0,2.54966,0v-12.155a4.9014,4.9014,0,0,0-4.90877-4.88284H34.85052a4.91689,4.91689,0,0,0-4.4696,2.86486.38544.38544,0,0,1-.01911.04268,4.83277,4.83277,0,0,0-.42007,1.97531v12.155a1.27483,1.27483,0,0,0,2.54966,0V22.80518a.38485.38485,0,1,1,.76971,0V47.01893a.38485.38485,0,0,1-.76971,0V36.35642A2.04293,2.04293,0,0,1,29.172,34.75974v-12.155a5.59928,5.59928,0,0,1,.44173-2.18543L28.941,17.86848a.38485.38485,0,0,1,.74425-.19628l.46522,1.76387a5.70693,5.70693,0,0,1,2.52129-2.051l-.99342-3.48937a3.4646,3.4646,0,0,0-3.27426-2.33118H22.08077a3.46451,3.46451,0,0,0-3.27423,2.33107L17.75286,17.5967a4.23086,4.23086,0,0,1,2.10075,2.40576l.00285.0099.0033.00971.16614.58358.77365-2.93346a.38485.38485,0,0,1,.74425.19628l-1.10468,4.18861,3.14842,11.0588a2.2868,2.2868,0,0,1-2.20091,2.90839,2.38529,2.38529,0,0,1-1.1736-.3125l1.53522,5.82106a.38482.38482,0,0,1-.37212.483H17.04652v5.09932a.38485.38485,0,0,1-.76971,0V41.631a.38486.38486,0,0,1,.38485-.38485h4.215l-4.4145-16.73831-.01708-.063-.00215-.00988-.05714-.21666A.38485.38485,0,0,1,17.13,24.022l.07422.2814,2.66721,9.84254a1.50571,1.50571,0,0,0,.741.91022,1.591,1.591,0,0,0,1.18421.142,1.51812,1.51812,0,0,0,1.05027-1.87264L19.123,20.2454a3.46265,3.46265,0,0,0-1.96517-2.07432l-.01512-.00589a3.45943,3.45943,0,0,0-1.29394-.25086H9.52554A3.46451,3.46451,0,0,0,6.25131,20.2454L2.5271,33.32663a1.51816,1.51816,0,0,0,1.05055,1.87151,1.59158,1.59158,0,0,0,1.18423-.142,1.50747,1.50747,0,0,0,.742-.91379l2.66622-9.839.07422-.28142a.38485.38485,0,1,1,.74425.19628l-.05714.21666-.00215.00988-.01709.06307L4.4977,41.24612h4.215a.38486.38486,0,0,1,.38485.38485v5.48417a.38485.38485,0,1,1-.76971,0V42.01583H3.99819a.38482.38482,0,0,1-.37212-.483l1.53453-5.81842-.02938.017a2.36527,2.36527,0,0,1-1.13638.29418,2.30715,2.30715,0,0,1-.62565-.08649A2.28786,2.28786,0,0,1,1.7865,33.117L5.51459,20.02208l.0033-.0097.00285-.00991a4.23449,4.23449,0,0,1,4.0048-2.85784h6.32327a4.2303,4.2303,0,0,1,1.18428.16924l1.03674-3.64155.00331-.00972.00285-.0099a4.23449,4.23449,0,0,1,4.0048-2.85784h6.32329a4.23454,4.23454,0,0,1,4.0048,2.85782l.0029.01008.00325.00956.98692,3.46655a5.69183,5.69183,0,0,1,1.44858-.18667h5.77108A5.672,5.672,0,0,1,46.30007,22.60474ZM38.05779,36.676V47.067a.38485.38485,0,0,1-.76971,0V36.676a.38485.38485,0,0,1,.76971,0Z'
        },
        iconContext: {
          width: 512,
          height: 512,
          d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6ZM437.91,223.34c-4.37.47-7.14,1.91-11.17,3.37-2.57.93-8.79.34-10.67,2.31-.65.69-1.47,7.72-1.62,9.37-4.79-.4-2.58-6.88-5.93-6.88a.64.64,0,0,1-.28.84.39.39,0,0,1-.1-.3,11.91,11.91,0,0,1-2.61,3.23.42.42,0,0,1,.49.26,3.54,3.54,0,0,1-1-.17,4,4,0,0,0,.83,2.62,15.65,15.65,0,0,1-3-.76c1.15,3,3.58,6.74.49,9s-6.28-1.08-3.3,5.19c-2.05,1.28-4.26,1.5-6.23,3-1.74,1.3-2.14,2.55-4.27,3.53-4.63,2.14-6.82,1.3-8.42-3.28-2.1-6-2.56-9.51-9.16-11.82-4-1.4-11.11-5.47-15.22-5.1-3,.27-4.81,2.72-7.63,3.31-2.35.49-4.4-.63-6.76,0-5.64,1.5-5.17,7.77-9.95,10.05-2.87,1.37-6.11.36-9.12.15s-6.82.86-9.7.16c-1.56-.38-7.77-6.92-8.07-6.62q.28.11.24.53c-7.51-2.41-4.59,8.38-5,11.46-.78,5.68-6.35,4.33-8.13-.19s1.58-11.5-6-12.1c-5.39-.42-7.22,4.37-12.91,2.72-5.24-1.52-11.73-5.09-17.42-3.61-6.54,1.69-4.19,7.56-5.92,12.49-2.16,6.16-6.11,4.37-11.4,4.89-2.75.27-6.8.92-9.26,2.33,0,0-4.6,3.92-3,3.89-1,7-7.91,9.91-13.69,5.17-4.41-3.61-2.37-11.45-7.63-14.15-8-4.12-7.59,6-9.82,9.74-4.22,7.13-7.19-2.67-9.34-5.5-5.05-6.66-8.53-1.44-12.35,2.8-5.12,5.69-10.76,6.84-3.33,13.86,8.42,8-3.35,5.6-7,9.87-4.33,5.11,2.37,10.81,7.18,11.65-2.77-1.78-9.05-5.89-6.71-9.93s10.73-.57,11.39-6.9c.52-5-7.58-5.2-7.22-9.93.21-2.67,3-3.26,4.63-4.85s2.81-4.23,4.48-5.61c5.54-4.58,6.65-.2,9.45,4.6,3.42,5.86,8.32,4.89,10.77-.62,2-4.59,5.65-13.4,9.18-3.89,2.13,5.72,1.74,10.41,8.74,12.92,11.69,4.2,10.57-8.78,18.49-12.08,4.51-1.87,10,.62,14.19-1.91,5.44-3.25,2.68-9,5.42-13.4,5.54-9,19.33,3.25,26.67,1.16,6.46-1.84,7.7-5.78,8.89,3.23.46,3.5.52,5.26,3.36,7.66.56.47,4.08,2,4.16,2.43,11.36,1.76,3.93-13.11,8.11-14,1.12-.24,5.81,5.5,8.22,6,3.8.75,8.54-.39,12.47-.18,5.39.29,9.66.59,13.34-3.9,1.47-1.8,1.93-4.6,4.21-5.73,2-1,4.37-.09,6.44-.42,4.22-.67,5.82-2.76,10.22-1.58,3,.81,9.58,3.4,12.3,5.23,5.88,4,2.15,13.49,10.12,16.14,1.92.64,12.07-2.4,12.85-.43.38,1-1.85,2.31-2,3.07-.25,1.5-.52,4.47-.91,5.86-1.47,5.33-4.91,9.77-9.64,13.46-1.75,1.37-3.94,1.39-5.59,2.67-1.94,1.49-1.85,3.49-2.79,5.51-1.09,2.36-1.65,4.7-4.92,2.39-.73,2.7-.7,5.63-2.45,7.91,1.49,1.81-1.72,6.25,1.35,6.59-.11,1-1.2.73-2,.35.3,1.46,1.22,2.34,1.86,3.61,1.22,2.44,2,5.63,3.45,7.91a44.7,44.7,0,0,1-6.34-.38c3.71,4.58,1.7,10.9,2.11,16.25l-.49-.31c-1.14,2.52-1.32,5-1.84,7.66-.66,3.36-3.17,6.07-3.65,9.3-2-.9-6.49-1.24-7.82,1.21-.67,1.24.25,1.76.06,3-.34,2.12,1.22,3,0,5.25-1.51,2.87-3.59,2-5.86,3.08-7,3.42-13.71,13.82-6.15,20.5-3,2.18-6.89,4.79-10.88,4.27-3-.39-5.21-3.57-8.46-2.24.37-3.38.43-8.36-4.19-8.6-5.41-.28-4.5,8.86-6.62,9.19-3.32.53-3.44-13.47-2.76-16.43-3,.84-2.66-4-3.48-5.95-.91-2.16-5.55-9-7.88-3.88-3.28-5.45-9.18-6.55-13.16-1.66a5.57,5.57,0,0,0-2,.7,4.25,4.25,0,0,0-.28,3.56c-.92,1.78-.12,2.71-2.51,4.33-2.05,1.39-5.08,2.47-5.54-.48a10.56,10.56,0,0,0-4,1.78c-2.45,2.1-1,2.83-2,5.23-.6,1.55-5.9,8-5.19,8.57-1.64,1.29-9.85,8.17-11.13,8-2.61-.38-5.34-7.56-6-9.77-1.19,1.19-2.16,1.19-2.79-.37-2,1.54-6.44.57-4.36-2.1a2.93,2.93,0,0,1,.45-3.65c-1.42-.16-1.58-.78-2.3-1.91a11.93,11.93,0,0,1-.54-3.06c0-.34.75-2.3.83-1.91-.44-2-.73-2.62-2.58-4.6,2.54-1.88-1.23-1.17-1.85-1.71-2-1.7-3.93-4-6.26-5.93-3.2-2.68-4.23-3.57-7.57-2.07a27.52,27.52,0,0,0-3.18,2.12c-.91,1-1.59,3.24-2.31,3.9-1.21,1.1-5.39,2.56-5.77-1.44-.26-2.76,4-3.64,4.41-6.28.3-1.76-2-8.5-2.8-10.14-2-4.3-4.47-5.11-9-5.53,3.77-22.27-19.7,2.18-18.23,4.36A60.26,60.26,0,0,0,175,356.31c-1.43,3-1.38,5.81-3.64,8.44-1,1.15-5.42,5.15-7.35,3.58-1-.79,0-8,0-9.4a18.81,18.81,0,0,1,2.29-9.64c1.41-2.94,1.5-5.68,2.52-8.53,1.17-3.24,4.11-3.73,4.41-7.21.21-2.37-1.49-5.29-2.51-7.4l-.48.33a4.08,4.08,0,0,0-1.66-3.54c-4.1,5-11.18-8.15-14.52-10-4.4-2.49-5-.44-9.36.13-2,.27-6.49-.11-6.41-3.09l1.9,0c-.3-2.68-.65-5.28-3.2-6.67-1.71-.94-4,.33-5.36-.36-1.63-.86-1.38-1.82-2.67-3-4-3.67-3.19-1.5-7.85-1.29-2.58.12-4.8-.58-3.44-3.71a20.11,20.11,0,0,1-3.48-.19,17.71,17.71,0,0,1,.86-3.73,37.12,37.12,0,0,1-4.56,1.45c.38-2.46-.39-5-.8-7.45l-1.47.14c.07-3.54,2.12-3.89-1.95-6-1.89-1-4.87-1.8-6.93-2.61-2.44-1-4.44-1.56-6.72-2.7-1.34-.67-3.21-.68-4.43-1.57,2.37-2.43,2-7.24,3.3-10.29s3.73-5.7,5.22-8.68c.8-1.61,2.13-5.45,1.86-7.49-.37-2.84-2.58-4.56-2.86-7.49-.31-3.21.48-6.27-.09-9.67-.94-5.57.13-8,3.6-12.33,2.34-2.94,2.38-3,2-6-.46-3.64-3.09-6.19-1.94-10.62-7.5-4.12-6.21-15.41-5.93-22.13a62.89,62.89,0,0,0,.19-8.44c-.11-1.27-1.6-4.79-.57-5.85,2.51-2.6,8.52,5.54,10.53,7.34,1.67,1.5,3.69,3.64,6.09,3.71,3.46.1,4.17-3.31,6.81-4.22,5-1.71,12.55,4.27,18,4.05,7.4-.3,13.29-4.52,19.37-8.12,1.73-1,4.87-3.57,6.68-2,2.3-3.38,6.85-7.3,10.87-7,3,.2,5,2.49,8.6,2.09,2.8-.31,5.37-1.55,8.26-1.56,0-2.09,1.87-3.41,3.76-4.08,3.48,5.14,7-4.37,6-7.3a32.43,32.43,0,0,0,8.68-2.83c1.17,2.28,10.57-1.49,8.68-4.79a5.56,5.56,0,0,1,3.3-.76c-.1-.35-.19-.71-.27-1.07a5.42,5.42,0,0,0,2,.7l-.66,1.66a9.76,9.76,0,0,0,3.4,1.4c.79-3.12,3.9-4,6.11-5.9,3.18-2.72,5.4-6.16,5.59-10.44,7.39,2.24,14-.94,21.45-2,8.72-1.18,15.65,4.17,24.26,5,4.57.46,10.42-.27,14.75,1.56,3.06,1.29,3.15.57,3.29,4.7a100.88,100.88,0,0,1-1,19.2,4.19,4.19,0,0,1,2.06-.14c-.32,2.11,2,2.27,3.33,1.79,1.74,2.34,7,2.55,9.61,1.82.7,5.19,0,7.24,3.15,11.35,3.38,4.46,3.53,4.26,8.42,4.54-2.3,9.85,24.2,10.81,19,2.19a9.83,9.83,0,0,1,1.42-.73c1.86,4.27,6.17-1,8.91-.32a.46.46,0,0,1-.28-.51h.22l.34.66c2.71-1.41,4.12-4.47,7.08-5.51,3.42-1.21,7.51.47,11,.58,2.77.09,8.41-2.83,10.22-1,1.93-1.8,4.64-.48,7.06-.77a16.41,16.41,0,0,0,9-4.32c3.07,3,15.42,9.49,15.64,14.15.1,2-2.74,3.95-3.84,5.86,5.68,1.34,6.29,1.25,7.68,6.82.93,3.74,3,6.38,4.8,9.72,1.14,2.06,2.06,6.43,3.89,7.85,2.82,2.2,6.8-.87,9.23,1.4,1,1,1.67,4.24,2.72,5.61,1.82,2.38,3.84,3.2,4.06,6.58C447.14,222.49,440.18,223.09,437.91,223.34Z'
          //d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6ZM179.5,281.5A25.5,25.5,0,1,1,205,256,25.5,25.5,0,0,1,179.5,281.5Zm76.5,0A25.5,25.5,0,1,1,281.5,256,25.5,25.5,0,0,1,256,281.5Zm76.5,0A25.5,25.5,0,1,1,358,256,25.5,25.5,0,0,1,332.5,281.5Z'
        },
        iconInfo: {
          width: 512,
          height: 512,
          d: 'M256,6C117.93,6,6,117.93,6,256S117.93,506,256,506,506,394.07,506,256,394.07,6,256,6Zm30,370a30,30,0,0,1-60,0V226a30,30,0,0,1,60,0ZM256,166a30,30,0,1,1,30-30A30,30,0,0,1,256,166Z'
        },
        iconPointSearch: {
          width: 512,
          height: 512,
          d: 'M244.42,151.9V238H153.87A103.73,103.73,0,0,1,244.42,151.9Zm23.16,0V238h90.56A103.74,103.74,0,0,0,267.58,151.9ZM244.42,357.76V261.18H152.7A103.67,103.67,0,0,0,244.42,357.76Zm23.16,0a103.68,103.68,0,0,0,91.73-96.59H267.58ZM512,256c0,141.39-114.61,256-256,256S0,397.39,0,256,114.61,0,256,0,512,114.61,512,256Zm-71.63-6.4A11.58,11.58,0,0,0,428.79,238H381.54a126.89,126.89,0,0,0-114-109.38V76.8a11.58,11.58,0,0,0-23.16,0v51.84A126.89,126.89,0,0,0,130.47,238H83.2a11.58,11.58,0,0,0,0,23.16h46.35A126.81,126.81,0,0,0,244.42,381V422.4a11.58,11.58,0,1,0,23.16,0V381A126.82,126.82,0,0,0,382.46,261.18h46.33A11.58,11.58,0,0,0,440.37,249.6Z'
        },
        iconRadiusSearch: {
          width: 512,
          height: 512,
          d: 'M256,109c-81.06,0-147,65.94-147,147s65.94,147,147,147,147-65.94,147-147S337.06,109,256,109Zm0,201a54,54,0,1,1,54-54A54,54,0,0,1,256,310ZM256,0C114.62,0,0,114.62,0,256S114.62,512,256,512,512,397.38,512,256,397.38,0,256,0Zm0,429c-95.39,0-173-77.61-173-173S160.61,83,256,83s173,77.61,173,173S351.39,429,256,429Z'
        }
      });

      // init map
      this.leafletMap = L.map('map', {
        crs: L.CRS.EPSG3857,
        editable: true,
        doubleClickZoom: false,
        zoomControl: false,
        maxZoom: this.appSettings.mapMaxZoom,
        minZoom: this.appSettings.mapMinZoom,
        zoom: this.appSettings.mapInitZoom,
        center: this.appSettings.mapCenterLatLng
      });

      L.control.zoom({
        position: 'topleft'
      }).addTo(this.leafletMap);

      this.leafletMap.on('click', function (e) {
        if (app.appState.isPointSearch) {
          // point search
          // if markerGroup exists, clear previous layer(s).
          if (app.searchPointMarkerGroup) {
            app.searchPointMarkerGroup.clearLayers();
          }
          // add layer group to map
          app.searchPointMarkerGroup = L.layerGroup().addTo(app.leafletMap);
          // add marker to layer group
          var searchPointMarker = new L.marker(e.latlng, {
            icon: app.icons.pointSearch
          }).addTo(app.searchPointMarkerGroup).on('click', app.pointSearchMarkerClick);
          // zoom to latlng
          app.leafletMap.setView(e.latlng, Math.max(app.appSettings.pointSearchZoom, app.leafletMap.getZoom()));
          //  begin search for layers (with features) at latlng
          app.mapClickedForLayerSearch(e.latlng);
        } else if (app.appState.isPolygonSearch) {
          // polygon search (with no radius dragging, as on mobile)
          // add group if needed
          if (app.searchRadiusPolygonGroup == null) {
            app.searchRadiusPolygonGroup = L.layerGroup().addTo(app.leafletMap);
          }

          // disable general map dragging
          app.leafletMap.dragging.disable();
          // capture drag start point PX & LatLng
          app.appState.radiusSearchStart = {
            x: e.layerPoint.x,
            y: e.layerPoint.y,
            latlng: e.latlng
          };
          var emulatePXMove = 100;
          var emulateEndLatLng = app.leafletMap.layerPointToLatLng([e.layerPoint.x, e.layerPoint.y + emulatePXMove]);
          // get dist (M) between latlng (clicked) and latlng (test)
          var emulateDistanceM = app.leafletMap.distance(e.latlng, emulateEndLatLng);
          var emulateDistanceMPerPx = emulateDistanceM / emulatePXMove;
          var emulatePXdistance = app.appSettings.radiusSearchMobileMaxM / emulateDistanceMPerPx;

          app.appState.radiusSearchEnd = {
            distancePX: emulatePXdistance,
            distanceM: app.appSettings.radiusSearchMobileMaxM
          };

          if (app.searchPolygon != null) {
            app.searchPolygon.remove();
          }

          var polyCenter = app.appState.radiusSearchStart;
          var polyRadiusPX = app.appState.radiusSearchEnd.distancePX;
          var polyPointCount = 30; // any bigger and query becomes too long
          var polyRadianStep = Math.PI * 2 / polyPointCount;
          app.searchPolygonLatLngs = [];
          var polyFirstPointLatLng = [];
          // with trig, calculate XY pos of points around polyCenter, polyRadiusPX away.
          for (var p = 0; p < polyPointCount; p++) {
            var polyPointX = polyCenter.x + polyRadiusPX * Math.sin(polyRadianStep * p);
            var polyPointY = polyCenter.y + polyRadiusPX * Math.cos(polyRadianStep * p);
            // next convert that px xy into latlng on map
            var polyPointLatLng = app.leafletMap.layerPointToLatLng([polyPointX, polyPointY]);
            // store first point for reuse at end of poly points
            if (p == 0) {
              polyFirstPointLatLng = polyPointLatLng;
            }
            // push lat lng into poly array
            app.searchPolygonLatLngs.push(polyPointLatLng);
          }

          // push last (first) point in, to close shape
          app.searchPolygonLatLngs.push(polyFirstPointLatLng);

          // add layer group to map

          app.searchPolygon = L.polygon(app.searchPolygonLatLngs, {
            color: 'red'
          });
          app.searchPolygon.setStyle({ className: 'radiusSearchCircle' });
          app.searchPolygon.addTo(app.searchRadiusPolygonGroup);

          app.searchPolygon.on('click', app.searchPolygonClicked);
          app.leafletMap.removeEventListener('mousemove');
          app.leafletMap.dragging.enable();
          app.appState.isPolygonSearch = false;
          // begin search request
          app.polygonDrawnForLayerSearch();
        }
      });

      this.leafletMap.on('mousedown', function (e) {
        if (app.appState.isPolygonSearch) {
          // radius search

          // add group if needed
          if (app.searchRadiusPolygonGroup == null) {
            app.searchRadiusPolygonGroup = L.layerGroup().addTo(app.leafletMap);
          }

          // disable general map dragging
          app.leafletMap.dragging.disable();
          // capture drag start point PX & LatLng
          app.appState.radiusSearchStart = {
            x: e.layerPoint.x,
            y: e.layerPoint.y,
            latlng: e.latlng

            // listen for mouse move in this "radius search" interaction
          };app.leafletMap.on('mousemove', function (e, startX, startY) {
            if (app.appState.isPolygonSearch) {
              // calc disance in M
              var distanceM = Math.round(app.leafletMap.distance(app.appState.radiusSearchStart.latlng, e.latlng));
              // update distance calc if <= limit
              if (distanceM <= app.appSettings.radiusSearchMaxM) {
                // get px pos for start and end of drag
                var x0 = app.appState.radiusSearchStart.x;
                var y0 = app.appState.radiusSearchStart.y;
                var x1 = e.layerPoint.x;
                var y1 = e.layerPoint.y;
                // calc distance in px
                var distancePX = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
                // update app variable with end point and distances
                app.appState.radiusSearchEnd = {
                  distancePX: distancePX,
                  distanceM: distanceM
                  // update circle radius
                  //radiusSearchCircle.setRadius(distanceM);

                };if (app.searchPolygon != null) {
                  app.searchPolygon.remove();
                }

                var polyCenter = app.appState.radiusSearchStart;
                var polyRadiusPX = distancePX;
                var polyPointCount = 30; // any bigger and query becomes too long
                var polyRadianStep = Math.PI * 2 / polyPointCount;
                app.searchPolygonLatLngs = [];
                var polyFirstPointLatLng = [];
                // with trig, calculate XY pos of points around polyCenter, polyRadiusPX away.
                for (var p = 0; p < polyPointCount; p++) {
                  var polyPointX = polyCenter.x + polyRadiusPX * Math.sin(polyRadianStep * p);
                  var polyPointY = polyCenter.y + polyRadiusPX * Math.cos(polyRadianStep * p);
                  // next convert that px xy into latlng on map
                  var polyPointLatLng = app.leafletMap.layerPointToLatLng([polyPointX, polyPointY]);
                  // store first point for reuse at end of poly points
                  if (p == 0) {
                    polyFirstPointLatLng = polyPointLatLng;
                  }
                  // push lat lng into poly array
                  app.searchPolygonLatLngs.push(polyPointLatLng);
                }

                // push last (first) point in, to close shape
                app.searchPolygonLatLngs.push(polyFirstPointLatLng);

                // add layer group to map

                app.searchPolygon = L.polygon(app.searchPolygonLatLngs, {
                  color: 'red'
                });
                app.searchPolygon.setStyle({ className: 'radiusSearchCircle' });
                app.searchPolygon.addTo(app.searchRadiusPolygonGroup);
              }
            }
          });
        }
      });

      this.leafletMap.on('mouseup', function (e) {
        if (app.appState.isPolygonSearch) {
          // radius search
          app.searchPolygon.on('click', app.searchPolygonClicked);
          app.leafletMap.removeEventListener('mousemove');
          app.leafletMap.dragging.enable();
          app.appState.isPolygonSearch = false;
          // begin search request
          app.polygonDrawnForLayerSearch();
        }
      });
    },
    initApp: function initApp() {
      this.appState.appInit = true;
    },
    initLayers: function initLayers() {
      var _this2 = this;

      // setup layer to parent group references
      this.setLayersParentGroup();

      // create special pane, to hold all cluster polygon highlights, beneath points, above shapes
      this.leafletMap.createPane('cluster-polygons');
      this.leafletMap.getPane('cluster-polygons').style.zIndex = this.appSettings.customClusterPolygonZ;

      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this

        // loop through layers array, initialising specifically, or as generic feature layer
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this

          switch (layer.name) {
            default:
              // default base/shape/point layer

              switch (layer.type) {
                case 'base':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customTileZBase + layer.z;
                  layer.layerObject = L.tileLayer(layer.url, {
                    pane: layer.name,
                    attribution: 'Map tiles by <a href="https://ordnancesurvey.co.uk">Ordnance Survey</a>',
                    useCache: true,
                    opacity: 1,
                    maxZoom: _this2.appSettings.mapMaxZoom,
                    minZoom: _this2.appSettings.mapMinZoom
                  });

                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    layer.layerObject.setOpacity(layer.opacity);
                  }
                  break;

                case 'tile':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customTileZBase + layer.z;
                  layer.layerObject = L.tileLayer(layer.url, {
                    // crossOrigin: 'use-credentials',
                    pane: layer.name,
                    attribution: '',
                    useCache: true,
                    opacity: 1,
                    maxZoom: _this2.appSettings.mapMaxZoom,
                    minZoom: _this2.appSettings.mapMinZoom
                  });

                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    layer.layerObject.setOpacity(layer.opacity);
                  }

                  // get layer legend JSON (if needed)
                  _this2.requestEsriLayerLegendJSON(layer);

                  break;

                case 'esriimage':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customTileZBase + layer.z;
                  layer.layerObject = L.esri.imageMapLayer({
                    url: layer.url,
                    // crossOrigin: 'use-credentials',
                    pane: layer.name,
                    attribution: '',
                    useCache: false,
                    opacity: 1,
                    maxZoom: _this2.appSettings.mapMaxZoom,
                    minZoom: _this2.appSettings.mapMinZoom
                  });

                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    layer.layerObject.setOpacity(layer.opacity);
                  }
                  break;

                case 'shape':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customShapeZBase + layer.z;
                  _this2.leafletMap.getPane(layer.name).class = layer.name;

                  var whereStr = null;
                  if (layer.where != '' && layer.where != null) {
                    whereStr = layer.where;
                  }

                  // alllowing layer ids to be appended to end of URL for shape layers
                  var layerURL = layer.url;
                  if (layer.appendIDtoURL == true) {
                    layerURL += layer.id;
                  }

                  layer.layerObject = L.esri.featureLayer({
                    pane: layer.name,
                    url: layerURL,
                    where: whereStr,
                    style: function style(feature) {
                      // init additional class string for any added classes needed on feature
                      var additonalClassString = '';
                      // check for missing data flagged in feature
                      if (feature.properties[app.appSettings.features_missingData_property] == app.appSettings.features_missingData_value) {
                        additonalClassString += ' ' + app.appSettings.features_missingData_class;
                      }

                      feature.properties.sitename;
                      return {
                        color: layer.color ? layer.color : '#fff',
                        fillColor: layer.color ? layer.color : '#fff',
                        weight: 1.5,
                        opacity: 1,
                        fillOpacity: layer.opacity ? layer.opacity : 1,
                        className: layer.name + additonalClassString // layer name and added class strings
                      };
                    }
                  });
                  // check for popup
                  if (layer.popup) {
                    layer.layerObject.bindPopup(function (e) {
                      return L.Util.template(app.getLayerPopup(layer, e.feature.properties), e.feature.properties);
                    });
                  }
                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    // setting containing pane opacity, not features diectly
                    _this2.leafletMap.getPane(layer.name).style.opacity = layer.opacity;
                  }

                  // generic custom click handler
                  if (layer.clickCustomFunction) {
                    layer.layerObject.on('click', function (e) {
                      app.layerCustomClickHandler(layer, e);
                    });
                  }

                  if (layer.clickZoomToFeature) {
                    layer.layerObject.on('click', function (e) {
                      // var boundsCenter = e.layer._bounds.getCenter();
                      app.leafletMap.fitBounds(e.layer._bounds);
                    });
                  }

                  break;

                case 'geojson':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customShapeZBase + layer.z;
                  _this2.leafletMap.getPane(layer.name).class = layer.name;

                  var whereStr = null;
                  if (layer.where != '' && layer.where != null) {
                    whereStr = layer.where;
                  }

                  // init geojson layer with null, so we can add options for pane and style
                  layer.layerObject = L.geoJSON(null, {
                    pane: layer.name,
                    style: function style(feature) {
                      // init additional class string for any added classes needed on feature
                      var additonalClassString = '';

                      // check for missing data flagged in feature
                      if (feature.properties[app.appSettings.features_missingData_property] == app.appSettings.features_missingData_value) {
                        additonalClassString += ' ' + app.appSettings.features_missingData_class;
                      }

                      return {
                        color: '#000',
                        weight: 1.5,
                        opacity: 1,
                        fillOpacity: 0.0,
                        className: layer.name + additonalClassString
                      };
                    }
                  });
                  // check for popup
                  if (layer.popup) {
                    layer.layerObject.bindPopup(function (e) {
                      return L.Util.template(app.getLayerPopup(layer, e.feature.properties), e.feature.properties);
                    });
                  }
                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    // setting containing pane opacity, not features diectly
                    _this2.leafletMap.getPane(layer.name).style.opacity = layer.opacity;
                  }

                  // generic custom click handler
                  if (layer.clickCustomFunction) {
                    layer.layerObject.on('click', function (e) {
                      app.layerCustomClickHandler(layer, e);
                    });
                  }

                  if (layer.clickZoomToFeature) {
                    layer.layerObject.on('click', function (e) {
                      // var boundsCenter = e.layer._bounds.getCenter();
                      app.leafletMap.fitBounds(e.layer._bounds);
                    });
                  }

                  break;

                case 'point':
                  var markerHtmlStyle = 'background-image: url(' + _this2.getLayerIconUrl(layer) + '); background-repeat: no-repeat background-size: contain;';
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customPointZBase + layer.z;

                  var whereStr = null;
                  if (layer.where != '' && layer.where != null) {
                    whereStr = layer.where;
                  }

                  // alllowing layer ids to be appended to end of URL for point layers
                  var layerURL = layer.url;
                  if (layer.appendIDtoURL == true) {
                    layerURL += layer.id;
                  }

                  layer.layerObject = L.esri.Cluster.featureLayer({
                    clusterPane: layer.name,
                    url: layerURL,
                    where: whereStr,
                    singleMarkerMode: false, // false to prevent single item clusters
                    pointToLayer: function pointToLayer(geojson, latlng) {
                      return L.marker(latlng, {
                        pane: layer.name,
                        icon: app.getLayerIcon(layer)
                      });
                    },
                    iconCreateFunction: function iconCreateFunction(cluster) {
                      return L.divIcon({
                        html: '<div style="' + markerHtmlStyle + '; margin-left: -10px; margin-top: -10px; ">\n            <span> ' + cluster.getChildCount() + '</span></div>',
                        className: 'marker-cluster',
                        popupAnchor: [0, -15]
                      });
                    },
                    polygonOptions: {
                      pane: 'cluster-polygons',
                      fillColor: _this2.getLayerColor(layer),
                      // color: this.getLayerColor(layer),
                      weight: 0,
                      opacity: 0,
                      fillOpacity: 0.5
                    }
                  });
                  // check for popup
                  if (layer.popup) {
                    layer.layerObject.bindPopup(function (e) {
                      return L.Util.template(app.getLayerPopup(layer, e.feature.properties), e.feature.properties);
                    });
                  }

                  // set opacity if specific setting configured
                  if (layer.opacity != null && layer.opacity >= 0) {
                    // setting containing pane opacity, not features diectly
                    _this2.leafletMap.getPane(layer.name).style.opacity = layer.opacity;
                  }

                  // generic custom click handler
                  if (layer.clickCustomFunction) {
                    layer.layerObject.on('click', function (e) {
                      app.layerCustomClickHandler(layer, e);
                    });
                  }

                  if (layer.clickZoomToFeature) {
                    layer.layerObject.on('click', function (e) {
                      app.leafletMap.setView(e.latlng, 14);
                    });
                  }

                  break;

                case 'os-vector-tile':
                  _this2.leafletMap.createPane(layer.name);
                  _this2.leafletMap.getPane(layer.name).style.zIndex = _this2.appSettings.customTileZBase + layer.z;

                  var apiKey = layer.apiKey; //'vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP';
                  var customStyleURL = layer.customStyleUrl; //'data/OS_VTS_3857_Open_GLA_Dark_Greyscale_GLA_Muted_Buildings.json';
                  var serviceUrl = layer.url; //""

                  if (customStyleURL != '' && customStyleURL != null) {
                    // setup layer using custom style json
                    layer.layerObject = L.mapboxGL({
                      style: customStyleURL,
                      transformRequest: function transformRequest(url) {
                        if (!/[?&]key=/.test(url)) url += '?key=' + apiKey;
                        return {
                          url: url + '&srs=3857'
                        };
                      }
                    });
                  } else {
                    if (serviceUrl != '' && serviceUrl != null) {
                      // setup layer using direct service url
                      layer.layerObject = L.mapboxGL({
                        style: serviceUrl + '/resources/styles?key=' + apiKey,
                        transformRequest: function transformRequest(url) {
                          return {
                            url: url += '&srs=3857'
                          };
                        }
                      });
                    }
                  }

                  break;

                default:
                // no default layer.type behaviour
              } // end default/layer.type swithc
          } // end switch
        }); // /layer init loop
      }); // /layerGroups loop

      // call function to refresh leaflet layout, now all data loaded and DOM rendered.
      this.postLoadLeafletRefresh();
    },
    postLoadLeafletRefresh: function postLoadLeafletRefresh() {
      setTimeout(function () {
        app.leafletMap.invalidateSize();
      }, 350);
    },
    requestEsriLayerLegendJSON: function requestEsriLayerLegendJSON(lyr) {
      // if layer has esriLegendJSON and is a tile layer, request JSON from service
      if (lyr) {
        if (lyr.type == 'tile' && lyr.esriLegendJSON != null && lyr.esriLegendJSON != '') {
          var request = lyr.esriLegendJSON;
          axios.get(request).then(function (response) {
            app.esriTileLegnedJSON_loaded(lyr, response);
          });
        }
      }
    },
    esriTileLegnedJSON_loaded: function esriTileLegnedJSON_loaded(lyr, tileServiceResponse) {
      // get the legend data from service response

      var legendData = [];
      if (tileServiceResponse.data.layers) {
        // check for good repsonse from service legend request
        // get legend array
        legendData = tileServiceResponse.data.layers[0].legend;
        if (legendData.length > 0) {
          // set/reset layer's legendData to []
          lyr.legendData = [];
          // parse each JSON item into local array
          for (var l = 0; l < legendData.length; l++) {
            var legendItem = {
              style: 'background: url(data:image/png;base64,' + legendData[l].imageData + ') no-repeat left center; background-size:cover;',
              label: legendData[l].label.replace(/ /g, '')
            };
            lyr.legendData.push(legendItem);
          }
        }
      }
    },
    layerGroupActiveChanged: function layerGroupActiveChanged(lyrgrp, isActive) {
      lyrgrp.active = isActive;
      this.updateGroupLayersView(lyrgrp);
      this.updateLayersView(); // group update
    },
    updateGroupLayersView: function updateGroupLayersView(lyrgrp) {
      var groupLayersState = null; // null, "active", "inactive", "mixed"

      // establish if layers in group are all active, inactive, or mixed
      lyrgrp.layers.forEach(function (layer, index) {
        // using arrow here to keep app scope for this
        if (layer.active) {
          if (groupLayersState == null) {
            groupLayersState = 'active'; // set group state as active
          } else if (groupLayersState == 'active') {
            groupLayersState = 'active'; // keep group state as active
          } else if (groupLayersState == 'inactive') {
            groupLayersState = 'mixed';
          }
        } else if (!layer.active) {
          if (groupLayersState == null) {
            groupLayersState = 'inactive'; // set group state as inactive
          } else if (groupLayersState == 'active') {
            groupLayersState = 'mixed'; // mixed layer activity
          } else if (groupLayersState == 'inactive') {
            groupLayersState = 'inactive'; // keep group as inactive
          }
        }
      });

      // switch on layers according to toggle request (lyrgroup.active) and the group's status
      lyrgrp.layers.forEach(function (layer, index) {
        if (lyrgrp.active) {
          if (groupLayersState == 'inactive') {
            layer.active = true;
          } else {
            // do nothing as, either already all active, or mixed, so no layer updates
          }
        } else if (!lyrgrp.active) {
          if (groupLayersState == 'active') {
            layer.active = false;
          } else {
            // do nothing as, either already all inactive, or mixed, so no layer updates
          }
        }
      });
    },
    layerActiveChanged: function layerActiveChanged(lyrgrp, lyr, isActive) {
      console.log(lyr);
      lyr.active = isActive;
      // need to decide if 'parent' group of layer should be active, as result of child layer activation
      if (isActive && !lyrgrp.active) {
        this.layerGroupActiveChanged(lyrgrp, true); // this will activate group and in turn updateLayersView
      } else {
        this.applyRadioGroupToLayerChange(lyr, isActive);
        this.updateLayersView();
      }
    },
    applyRadioGroupToLayerChange: function applyRadioGroupToLayerChange(lyr, isActive) {
      if (isActive) {
        // if made active
        if (lyr.radioGroup) {
          // if has a radioGroup defined
          var selectedLayerGroup = lyr.radioGroup;
          var selectedLayerID = lyr.id;
          // find all layers with same radio group (in whatever other group they may live in)
          this.layerGroups.forEach(function (layerGroup, index) {
            // using arrow here to keep app scope for this
            // loop through layers array, collectin references of matching radioGroup
            layerGroup.layers.forEach(function (layer, index) {
              // using arrow here to keep app scope for this
              if (layer.radioGroup == selectedLayerGroup && layer.id != selectedLayerID) {
                // if should have layer, but no on -> add
                layer.active = false;
              }
            });
          });
        }
      }
    },
    updateLayersView: function updateLayersView() {
      var _this3 = this;

      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        // loop through layers array, checking if they should be displayed still, and if they already are/not
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layerGroup.active && layer.active && !_this3.leafletMap.hasLayer(layer.layerObject)) {
            // if should have layer, but no on -> add
            layer.layerObject.addTo(_this3.leafletMap);
          } else if (!layer.active && _this3.leafletMap.hasLayer(layer.layerObject) || !layerGroup.active) {
            // if shouldn't have layer, but IS on -> remove
            layer.layerObject.removeFrom(_this3.leafletMap);
          }
        });
      });
      // update active layers count
      this.updateActiveLayerCount();
    },
    navGroupSelected: function navGroupSelected(grp, force) {
      if (grp != null) {
        if (force) {
          this.appState.selectedNavGroup = grp;
        } else {
          if (grp != this.appState.selectedNavGroup) {
            this.appState.selectedNavGroup = grp; // switch to new group
          } else {
            this.appState.selectedNavGroup = null; // toggle off re-selected group
          }
        }
      }

      // toggle off appState.initPanelOpened, as user is now navigating away from init view of menus
      this.toggleInitPanelOpened();
    },
    toggleInitPanelOpened: function toggleInitPanelOpened() {
      // toggle off appState.initPanelOpened, as user is now navigating away from init view of menus
      if (this.appState.initPanelOpened == false) {
        this.appState.initPanelOpened = true;
      }
    },
    initSearch: function initSearch() {
      //       var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();
      //       this.searchControl = L.esri.Geocoding.geosearch({
      //         providers: [arcgisOnline],
      //         expanded: true,
      //         collapseAfterResult: false,
      //         zoomToResult: true,
      //         useMapBounds: false,
      //         placeholder: 'Location search',
      //         searchBounds: L.latLngBounds([51.155231611562265, -0.802001953125], [51.795027225829145, 0.4998779296875])
      //       }).addTo(this.leafletMap);

      //       this.searchControl.on('results', function (data) {
      //         if (data.results.length > 0) {
      //           app.leafletMap.setView(data.results[0].latlng, 16);
      //         }
      //       });

      var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();
      this.searchControl = BootstrapGeocoder.search({
        providers: [arcgisOnline],
        expanded: true,
        collapseAfterResult: false,
        zoomToResult: false,
        useMapBounds: false,
        inputTag: 'address-search',
        placeholder: 'Location Search',
        searchBounds: L.latLngBounds([51.155231611562265, -0.802001953125], [51.795027225829145, 0.4998779296875])
      }).addTo(this.leafletMap);

      this.searchControl.on('results', function (data) {
        if (data.results.length > 0) {
          var latlng = data.results[0].latlng;
          // if markerGroup exists, clear previous layer(s).
          if (app.searchPointMarkerGroup) {
            app.searchPointMarkerGroup.clearLayers();
          }
          // add layer group to map
          app.searchPointMarkerGroup = L.layerGroup().addTo(app.leafletMap);
          // add marker to layer group
          var searchPointMarker = new L.marker(latlng, {
            icon: app.icons.pointSearch
          }).addTo(app.searchPointMarkerGroup).on('click', app.pointSearchMarkerClick);
          app.leafletMap.setView(latlng, 15);
        }
      });
    },
    layerClusterChanged: function layerClusterChanged(lyr, isClustered) {
      // this.updateLayersView();
      if (lyr) {
        var layercluster = lyr.layerObject.cluster;
        if (layercluster) {
          if (isClustered) {
            layercluster.enableClustering();
          } else {
            layercluster.disableClustering();
          }
        }
      }
    },
    updateLayersCluster: function updateLayersCluster() {
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        // loop through layers array, checking if they are "points", and if should be clustered or not
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layer.type == 'point') {
            var layercluster = layer.layerObject.cluster;
            if (layercluster) {
              if (layer.clustered) {
                // if should have layer, but no on -> add
                layercluster.enableClustering();
              } else {
                // if shouldn't have layer, but IS on -> remove
                layercluster.disableClustering();
              }
            }
          }
        });
      });
    },
    layerRequestMoreInfo: function layerRequestMoreInfo(lyr) {
      // set modal info title to selected layer title
      this.layerInfoModal.title = lyr.displayName;
      // set modal info description to selected layer long description
      this.layerInfoModal.content = lyr.longDescription;
      // set info modal show state to ture, to invoke display
      // show will be set back (by modal component) to false on close
      this.layerInfoModal.show = true;
    },
    layerRequestGroupMoreInfo: function layerRequestGroupMoreInfo(lyrgroup) {
      // set modal info title to selected layergroup title
      this.layerInfoModal.title = lyrgroup.groupDisplayName;
      // set modal info description to selected lyrgroup long description
      this.layerInfoModal.content = lyrgroup.longDescription;
      // set info modal show state to ture, to invoke display
      // show will be set back (by modal component) to false on close
      this.layerInfoModal.show = true;
    },
    layerOpacityChanged: function layerOpacityChanged(lyr) {
      if (lyr.opacity != null && lyr.opacity >= 0) {
        if (lyr.type == 'shape' || lyr.type == 'point') {
          // adjust style of comntaining pane
          this.leafletMap.getPane(lyr.name).style.opacity = lyr.opacity;
        } else {
          // adjust layer directly (as supported by esri/leaflet)
          lyr.layerObject.setOpacity(lyr.opacity);
        }
      }
    },
    layerColorChanged: function layerColorChanged(layer, hex) {
      // document
      //   .querySelectorAll('.leaflet-' + layer.name + '-pane svg path')
      //   .forEach(el => (el.style.fill = value))
      layer.layerObject.setStyle({
        color: hex,
        fillColor: hex
      });
    },
    togglePanelOpen: function togglePanelOpen() {
      this.appState.panelOpen = !this.appState.panelOpen;
    },
    appRequestMoreInfo: function appRequestMoreInfo() {
      // set modal info title to appInfoTitle
      this.layerInfoModal.title = this.appSettings.appInfoTitle;
      // set modal info description to appInfoHTML
      this.layerInfoModal.content = this.appSettings.appInfoHTML;
      // set info modal show state to ture, to invoke display
      // show will be set back (by modal component) to false on close
      this.layerInfoModal.show = true;
    },
    appRequestSelectionError: function appRequestSelectionError() {
      // set modal info title to appInfoTitle
      this.layerInfoModal.title = this.appSettings.selectionErrorTitle;
      // set modal info description to appInfoHTML
      this.layerInfoModal.content = this.appSettings.selectionErrorHTML;
      // set info modal show state to ture, to invoke display
      // show will be set back (by modal component) to false on close
      this.layerInfoModal.show = true;
    },
    refreshMap: function refreshMap() {
      // simply reload the page (easiest  way of restoring init state)
      window.location.href = window.location.href;
    },
    expandToParent: function expandToParent() {
      // reload the page, but in parent "frame"
      window.parent.location.href = window.location.href;
    },
    panelContentScrollEvent: function panelContentScrollEvent() {
      // detecting panel content scrolling, to remove legendpopup (mostly for monbile device, as they have no "roll out" event on legenditems)
      if (document.getElementById('legendPopup') && document.getElementById('legendPopup').style.visibility == 'visible') {
        document.getElementById('legendPopup').style.visibility = 'hidden';
      }
    },
    layerCustomClickHandler: function layerCustomClickHandler(layer, e) {
      var clickedFeatureProps = e.layer.feature.properties;
      // here we decide what to do with click based on layer name
      if (layer.name == 'wards') {
        this.updateFeatureSelectionData('ward', clickedFeatureProps.ward_gss_code);
      } else if (layer.name == 'boroughs') {
        this.updateFeatureSelectionData('borough', clickedFeatureProps.la_gss_code);
      }
      // perhaps an entirely different action for other layers needing custom clicks
      // ..
      // if(layer.name == "exchanges") {
      //   console.log("custom click here");
      // }
    },
    updateFeatureSelectionData: function updateFeatureSelectionData(type, id) {
      // update selection data "state", so we know what we'll be requesting.
      this.areaSelectionData.state.selectionType = type;

      // what series of request(s) do we need to invoke (borough, ward & borough, pcode & ward & borough... )
      if (this.areaSelectionData.state.selectionType == 'ward') {
        // invalidate current postcode below this ward level
        app.areaSelectionData.postcode.valid = false;
        // ward id
        this.areaSelectionData.ward.id = id;
        // & request data
        this.requestData_ward();
      } else if (this.areaSelectionData.state.selectionType == 'borough') {
        // invalidate current ward and postcode below this borough level
        app.areaSelectionData.ward.valid = false;
        app.areaSelectionData.postcode.valid = false;
        // boro id
        this.areaSelectionData.borough.id = id;
        // & request data
        this.requestData_borough();
      }
    },
    mapClickedForLayerSearch: function mapClickedForLayerSearch(clickedLatLng) {
      this.beginProximityLayerSearch(clickedLatLng, 0);
    },
    polygonDrawnForLayerSearch: function polygonDrawnForLayerSearch() {
      // zoom map to bounds of drawn search area
      // super important, so that layers with MANY points aren't accidentally ALL switched on when zoomed out
      this.leafletMap.fitBounds(app.searchPolygon.getBounds());

      var currentExtent = L.esri.Util.boundsToExtent(this.leafletMap.getBounds()); // leaflet bounds to eris extent
      var currentExtentQueryString = currentExtent.xmin + '%2C' + currentExtent.ymin + '%2C' + currentExtent.xmax + '%2C' + currentExtent.ymax;
      var currentWindowWidth = this.leafletMap.getSize().x;
      var currentWindowHeight = this.leafletMap.getSize().y;
      var dpi = 96;
      // var zoomDif = (this.leafletMap.getZoom() - this.appSettings.mapMinZoom) + 1;
      var identifyTolerancePX = 0;

      // reset point search results, groiup tracking
      this.appState.pointSearchResults = [];
      var lastResultGroup = '';
      var groupsCount = -1;
      // track success of async queries
      var queriesComplete = 0;

      // create esriGeometryPolygon from drawn polygon (app.appState.searchPolygon)
      var esriSearchPolygon = { rings: [[]]
        // push each [lng,lat] into esriSearchPolygon ring
      };for (var p = 0; p < app.searchPolygonLatLngs.length; p++) {
        var polyPoint = [app.searchPolygonLatLngs[p].lng, app.searchPolygonLatLngs[p].lat];
        esriSearchPolygon.rings[0].push(polyPoint);
      }

      for (var q = 0; q < this.appState.pointSearchQueries.length; q++) {
        // for each service query

        var layersQueryStr = '&layers=all';

        if (this.appState.pointSearchQueries[q].type == 'feature') {
          layersQueryStr += ':' + encodeURIComponent(this.appState.pointSearchQueries[q].ids);
        }

        // using "identify" search of entire map service
        var request = this.appState.pointSearchQueries[q].url + 'identify?geometry=' + JSON.stringify(esriSearchPolygon) + '&geometryType=esriGeometryPolygon&sr=4326' + layersQueryStr + '&layerDefs=&time=&layerTimeOptions=&tolerance=' + identifyTolerancePX + '&mapExtent=' + currentExtentQueryString + '&imageDisplay=' + currentWindowWidth + '%2C' + currentWindowHeight + '%2C' + dpi + '&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&returnUnformattedValues=false&returnFieldName=false&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=pjson';

        // console.log(request)
        axios.get(request, {
          params: {
            pointSearchQueryID: q
          }
        }).then(function (response) {
          var pointSearchQueryID = response.config.params.pointSearchQueryID;
          var pointSearchQueryLayerType = app.appState.pointSearchQueries[pointSearchQueryID].type;
          if (response.data.error || response.data.results.length <= 0) {
            console.log('Error: No data for selection or invalid query !');
          } else {
            // response OK

            for (var r = 0; r < response.data.results.length; r++) {
              var LayerID = response.data.results[r].layerId;
              var foundLayer = app.findLayerByID(LayerID);
              // check for "tile", so we look for layer in result differently
              // tile querys will only ever be a single layer (0), so need to ignore ID passed back in results
              // use the id in the original pointSearchQueries instead
              if (pointSearchQueryLayerType == 'tile') {
                foundLayer = app.findLayerByID(app.appState.pointSearchQueries[pointSearchQueryID].ids);
              }

              // new group?
              if (response.data.results[r].attributes.designation != lastResultGroup) {
                //new group

                // build new group container obj
                var groupObj = {
                  group: response.data.results[r].attributes.designation,
                  layer: foundLayer,
                  containsMissing: false,
                  results: []
                  // push new group into results array
                };app.appState.pointSearchResults.push(groupObj);
                // update last
                lastResultGroup = response.data.results[r].attributes.designation.toString();
                // increment groups count
                groupsCount++;
              }

              // check for, and log existence of missing data in group
              if (response.data.results[r].attributes[app.appSettings.features_missingData_property] == app.appSettings.features_missingData_value) {
                groupObj.containsMissing = true;
              }

              var resultObj = {
                layer: foundLayer,
                sitename: response.data.results[r].attributes.sitename,
                designation: response.data.results[r].attributes.designation,
                missing: response.data.results[r].attributes.missing,
                export: true

                // add result into current group
              };app.appState.pointSearchResults[groupsCount].results.push(resultObj);
            }
          }
          // log complete
          queriesComplete++;

          if (queriesComplete >= app.appState.pointSearchQueries.length) {
            // show point search modal
            app.pointSearchModal.title = app.appSettings.pointSearchTitle;
            app.pointSearchModal.show = true;

            // cancel search mode
            app.appState.isPolygonSearch = false;
          }
        });
      }
    },
    beginProximityLayerSearch: function beginProximityLayerSearch(clickedLatLng, distancePX) {
      var lat = clickedLatLng.lat;
      var lng = clickedLatLng.lng;
      var currentExtent = L.esri.Util.boundsToExtent(this.leafletMap.getBounds()); // leaflet bounds to eris extent
      var currentExtentQueryString = currentExtent.xmin + '%2C' + currentExtent.ymin + '%2C' + currentExtent.xmax + '%2C' + currentExtent.ymax;
      var currentWindowWidth = this.leafletMap.getSize().x;
      var currentWindowHeight = this.leafletMap.getSize().y;
      var dpi = 96;
      var zoomDif = this.leafletMap.getZoom() - this.appSettings.mapMinZoom + 1;
      var identifyTolerancePX = distancePX; //Math.pow(2,zoomDif) // use this to amplify "identify" px tolerance... later get px distance from radius drawing tool
      // record click lat lng (for use in CSV output later)
      this.appState.pointSearchPoint = clickedLatLng;
      // reset point search results, groiup tracking
      this.appState.pointSearchResults = [];
      var lastResultGroup = '';
      var groupsCount = -1;
      // track success of async queries
      var queriesComplete = 0;

      for (var q = 0; q < this.appState.pointSearchQueries.length; q++) {
        // for each service query

        var layersQueryStr = '&layers=all';

        if (this.appState.pointSearchQueries[q].type == 'feature') {
          layersQueryStr += ':' + encodeURIComponent(this.appState.pointSearchQueries[q].ids);
        }

        // using "identify" search of entire map service
        var request = this.appState.pointSearchQueries[q].url + 'identify?geometry=' + lng + '%2C' + lat + '&geometryType=esriGeometryPoint&sr=4326' + layersQueryStr +
        // tolerance is px integer, map extent needs to be updated to current view, imageDisplay should be current window size
        // +  "&layerDefs=&time=&layerTimeOptions=&tolerance=0&mapExtent=-0.802001953125%2C51.155231611562265%2C0.4998779296875%2C51.795027225829145&imageDisplay=1920%2C1080%2C72&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&returnUnformattedValues=false&returnFieldName=false&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=pjson";
        '&layerDefs=&time=&layerTimeOptions=&tolerance=' + identifyTolerancePX + '&mapExtent=' + currentExtentQueryString + '&imageDisplay=' + currentWindowWidth + '%2C' + currentWindowHeight + '%2C' + dpi + '&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&returnUnformattedValues=false&returnFieldName=false&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=pjson';

        // console.log(request)
        axios.get(request, {
          params: {
            pointSearchQueryID: q
          }
        }).then(function (response) {
          var pointSearchQueryID = response.config.params.pointSearchQueryID;
          var pointSearchQueryLayerType = app.appState.pointSearchQueries[pointSearchQueryID].type;
          if (response.data.error || response.data.results.length <= 0) {
            console.log('Error: No data for selection or invalid query !');
          } else {
            // response OK
            for (var r = 0; r < response.data.results.length; r++) {
              var LayerID = response.data.results[r].layerId;
              var foundLayer = app.findLayerByID(LayerID);
              // check for "tile", so we look for layer in result differently
              // tile querys will only ever be a single layer (0), so need to ignore ID passed back in results
              // use the id in the original pointSearchQueries instead
              if (pointSearchQueryLayerType == 'tile') {
                foundLayer = app.findLayerByID(app.appState.pointSearchQueries[pointSearchQueryID].ids);
              }
              // new group?
              if (response.data.results[r].attributes.designation != lastResultGroup) {
                //new group

                // build new group container obj
                var groupObj = {
                  group: response.data.results[r].attributes.designation,
                  layer: foundLayer,
                  containsMissing: false,
                  results: []
                  // push new group into results array
                };app.appState.pointSearchResults.push(groupObj);
                // update last
                lastResultGroup = response.data.results[r].attributes.designation.toString();
                // increment groups count
                groupsCount++;
              }

              // check for, and log existence of missing data in group
              if (response.data.results[r].attributes[app.appSettings.features_missingData_property] == app.appSettings.features_missingData_value) {
                groupObj.containsMissing = true;
              }

              var resultObj = {
                layer: foundLayer,
                sitename: response.data.results[r].attributes.sitename,
                designation: response.data.results[r].attributes.designation,
                missing: response.data.results[r].attributes.missing,
                export: true

                // add result into current group
              };app.appState.pointSearchResults[groupsCount].results.push(resultObj);
            }
          }
          // log complete
          queriesComplete++;

          if (queriesComplete >= app.appState.pointSearchQueries.length) {
            // show point search modal
            app.pointSearchModal.title = app.appSettings.pointSearchTitle;
            app.pointSearchModal.show = true;

            // cancel search mode
            app.appState.isPointSearch = false;
          }
        });
      }
    },
    downloadData: function downloadData() {
      // build & deliver csv
      var items = [];

      // dataRow(s)
      var exportCount = 0;
      for (var rg = this.appState.pointSearchResults.length - 1; rg >= 0; rg--) {
        // through results groups
        var groupResults = this.appState.pointSearchResults[rg].results;
        for (var r = groupResults.length - 1; r >= 0; r--) {
          // backwards through results
          var resultItem = groupResults[r];
          if (resultItem.export == true) {
            exportCount++;

            var resultLayer = 'Unknown';
            if (resultItem.designation != undefined) {
              resultLayer = String(resultItem.designation).replace(/,/g, ''); // remove any commas
              resultLayer = resultLayer.replace(/(\r\n|\n|\r)/gm, ' '); // remove any linebreaks
            }

            var resultSite = 'Unknown';
            if (resultItem.sitename != undefined) {
              resultSite = String(resultItem.sitename).replace(/,/g, ''); // remove any commas
              resultSite = resultSite.replace(/(\r\n|\n|\r)/gm, ' '); // remove any linebreaks
            }

            var dataRow = { A: resultLayer, B: resultSite };
            items.unshift(dataRow);
          }
        } // result loop
      }

      if (exportCount > 0) {
        var ColHeaders = {
          A: 'Map Layer:',
          B: 'Site:'
        };
        items.unshift(ColHeaders);
      } else {
        items.unshift({ A: 'No data exported!' });
      }

      items.unshift(''); // blank line

      // add date to CSV
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; // months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      var date = year + '/' + month + '/' + day;

      // download date
      var CSVDate = { A: 'Download Date: ' + date };
      items.unshift(CSVDate);

      // source
      var CSVSource = { A: 'Source: ' + this.appSettings.mapURL };
      items.unshift(CSVSource);

      var DocTitle = {};
      if (this.appState.lastSearchType == 'point') {
        DocTitle = {
          A: 'Layers & Sites found at location: [ Lat: ' + this.appState.pointSearchPoint.lat + ' Lng: ' + this.appState.pointSearchPoint.lng + ']'
        };
      } else if (this.appState.lastSearchType == 'polygon') {
        DocTitle = {
          A: 'Layers & Sites found within ~' + this.appState.radiusSearchEnd.distanceM + 'M of location: [ Lat: ' + this.appState.radiusSearchStart.latlng.lat + ' Lng: ' + this.appState.radiusSearchStart.latlng.lng + ']'
        };
      }
      items.unshift(DocTitle);

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = this.convertToCSV(jsonObject);

      var exportedFilenmae = 'SelectedLDNConnectivityData' + '.csv';

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    initPointSearchableList: function initPointSearchableList() {
      var _this4 = this;

      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layer.pointSearchable == true) {
            _this4.appState.pointSearchableLayers.push(layer.id);
          }
        });
      });
      // fiter out dups (just in case ids duped in config) with lodash
      this.appState.pointSearchableLayers = _.uniq(this.appState.pointSearchableLayers);
    },
    initPointSearchQueries: function initPointSearchQueries() {
      var _this5 = this;

      // loop through each layer
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          // if searchable layer
          if (layer.pointSearchable == true) {
            // get layer's root server URL (using our known end string)
            var requestURL = _this5.getURLRoot(layer.url, 'MapServer/');
            // if found a valid "root URL" (that we know we can query)
            if (requestURL != null) {
              // check type of layer
              if (layer.type == 'shape' || layer.type == 'point') {
                // is a "feature"
                // check is already in pointSearchQueries
                var urlInQueriesPos = -1;
                for (var q = 0; q < _this5.appState.pointSearchQueries.length; q++) {
                  if (requestURL == _this5.appState.pointSearchQueries[q].url) {
                    urlInQueriesPos = q;
                    break;
                  }
                }
                // add or update the pointSearchQueries entry
                if (urlInQueriesPos == -1) {
                  // not previously logged
                  var newQueryObj = {
                    url: requestURL,
                    ids: layer.id,
                    type: 'feature'
                  };
                  _this5.appState.pointSearchQueries.push(newQueryObj);
                } else {
                  _this5.appState.pointSearchQueries[urlInQueriesPos].ids += ',' + layer.id;
                }
              } else if (layer.type == 'tile') {
                // is a tile
                // every tile layer needs it's own request, can't do mutli layers
                var newQueryObj = {
                  url: requestURL,
                  ids: layer.id,
                  type: 'tile'
                };
                _this5.appState.pointSearchQueries.push(newQueryObj);
              }
            }
          }
        });
      });
    },
    getURLRoot: function getURLRoot(url, endStr) {
      rtnRoot = null;
      var strFoundPos = url.indexOf(endStr);
      if (strFoundPos != -1) {
        var rtnRoot = url.substring(0, strFoundPos + endStr.length);
      }
      return rtnRoot;
    },
    hideSearcableLayers: function hideSearcableLayers() {
      this.hideAllPointSearchableLayers();
    },
    pointSearchToggle: function pointSearchToggle() {
      // toggle off any pre-existing polygon search
      if (app.appState.isPolygonSearch) {
        app.appState.isPolygonSearch = false;
      }

      // clear previous poly search
      if (app.searchPolygon != null) {
        app.searchPolygon.remove();
        app.searchPolygon = null;
      }

      // toggle state
      this.appState.isPointSearch = !this.appState.isPointSearch;
      // record state of search (for use in export)
      this.appState.lastSearchType = 'point';
    },
    radiusSearchToggle: function radiusSearchToggle() {
      if (app.searchPolygon != null) {
        app.searchPolygon.remove();
        app.searchPolygon = null;
      } else {
        // toggle off any pre-existing point search
        if (app.appState.isPointSearch) {
          app.appState.isPointSearch = false;
        }

        // clear any previous point search
        if (app.searchPointMarkerGroup) {
          app.searchPointMarkerGroup.clearLayers();
        }

        // toggle state
        this.appState.isPolygonSearch = !this.appState.isPolygonSearch;
        // reset last search vars
        app.appState.radiusSearchStart = [];
        app.appState.radiusSearchEnd = [];

        // record state of search (for use in export)
        this.appState.lastSearchType = 'polygon';
      }
    },
    exportSelectedLayerSites: function exportSelectedLayerSites() {
      this.downloadData();
    },
    showFoundLayers: function showFoundLayers() {
      this.showAllFoundLayers();
    },
    checkShowWelcomeAlert: function checkShowWelcomeAlert() {
      if (this.appSettings.showWelcomeAlert) {
        // set modal info title
        this.layerInfoModal.title = this.appSettings.welcomeAlertTitle;
        // set modal info description to selected layer long description
        this.layerInfoModal.content = this.appSettings.welcomeAlertHTML;
        // set info modal show state to true, to invoke display
        // show will be set back (by modal component) to false on close
        this.layerInfoModal.show = true;
      }
    },
    checkShowLayerCountAlert: function checkShowLayerCountAlert() {
      if (this.appSettings.showLayerCountAlert) {
        if (this.appState.activeLayerCount <= 0) {
          // set modal info title
          this.layerInfoModal.title = this.appSettings.layerCountAlertTitle;
          // set modal info description to selected layer long description
          this.layerInfoModal.content = this.appSettings.layerCountAlertHTML;
          // set info modal show state to true, to invoke display
          // show will be set back (by modal component) to false on close
          this.layerInfoModal.show = true;
        }
      }
    },
    pointSearchMarkerClick: function pointSearchMarkerClick(e) {
      var latlng = e.latlng;
      this.mapClickedForLayerSearch(latlng);
    },
    searchPolygonClicked: function searchPolygonClicked() {
      this.polygonDrawnForLayerSearch();
    },

    // ---------- utility methods --------------
    getNumMappedToRange: function getNumMappedToRange(n, in_min, in_max, out_min, out_max) {
      return (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
    convertToCSV: function convertToCSV(objArray) {
      // from https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
      var array = (typeof objArray === 'undefined' ? 'undefined' : _typeof(objArray)) != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';

      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          if (line != '') line += ',';

          line += array[i][index];
        }

        str += line + '\r\n';
      }

      return str;
    },
    setIsEmbed: function setIsEmbed() {
      if (window !== window.top) {
        // we are embeded
        this.appState.isEmbed = true;
      }
    },
    findLayerByID: function findLayerByID(layerID) {
      foundLayer = null;
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layer.id == layerID) {
            foundLayer = layer;
          }
        });
      });
      return foundLayer;
    },
    findLayerByName: function findLayerByName(layerName) {
      foundLayer = null;
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layer.name == layerName) {
            foundLayer = layer;
          }
        });
      });
      return foundLayer;
    },
    hideAllPointSearchableLayers: function hideAllPointSearchableLayers() {
      var _this6 = this;

      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        var thisLayerGroup = layerGroup;
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          if (layer.pointSearchable == true) {
            _this6.layerActiveChanged(thisLayerGroup, layer, false);
          }
        });
      });
    },
    showAllFoundLayers: function showAllFoundLayers() {
      var onList = [];
      for (var r = 0; r < this.appState.pointSearchResults.length; r++) {
        // switch on layer pointSearchResults and store ID in "onList" so we only do it once
        // some you can get multiple sites in one layer, so this prvents us turning the smae layer on many times.
        var result = this.appState.pointSearchResults[r];
        // on if not already
        if (onList.indexOf(result.layer.id) == -1) {
          this.layerActiveChanged(this.findLayerGroupByID(result.layer.parentID), result.layer, true);
          onList.push(result.layer.id);
        }
      }
    },
    setLayersParentGroup: function setLayersParentGroup(layerID) {
      // do this once on init of layers to creat upward reference to parent group ID
      // (not ref to parent object itself as the circular reference might open up some kind of JS wormhole :)
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        var layerGroupID = layerGroup.id;
        layerGroup.layers.forEach(function (layer, index) {
          // using arrow here to keep app scope for this
          layer.parentID = layerGroupID;
        });
      });
    },
    findLayerGroupByID: function findLayerGroupByID(layerGroupID) {
      foundLayerGroup = null;
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        if (layerGroup.id == layerGroupID) {
          foundLayerGroup = layerGroup;
        }
      });
      return foundLayerGroup;
    },
    getLayerIcon: function getLayerIcon(lyr) {
      var rtnIcon = this.icons.default;
      // check icon defined in layer
      if (lyr.icon && lyr.icon != '') {
        var iconObj = this.icons[lyr.icon];
        // is defined icon found
        if (lyr.icon != null) {
          rtnIcon = iconObj;
        }
      }
      return rtnIcon;
    },
    getLayerIconUrl: function getLayerIconUrl(lyr) {
      var iconUrl = this.appSettings.defaultIconURL;
      if (lyr) {
        iconUrl = this.getLayerIcon(lyr).options.iconUrl;
      }
      return iconUrl;
    },
    getLayerColor: function getLayerColor(lyr) {
      var rtnCol = this.appSettings.defaultLayerColor;
      // check icon defined in layer
      if (lyr.color && lyr.color != '') {
        rtnCol = lyr.color;
      }
      return rtnCol;
    },
    getLayerPopup: function getLayerPopup(lyr, featureProps) {
      // function to return popup for layer, as either null, leaflet template or custom string/template.
      // featureProps are feature.properties passed in from specific feature click/popup event
      if (lyr.popup != null && lyr.popup != '') {
        if (lyr.popup != 'custom') {
          // init additional (missing data) HTML String for adding to end of layer popup info
          var additonalMissingPopupString = '';
          // check for missing data flagged in feature
          if (featureProps[app.appSettings.features_missingData_property] == app.appSettings.features_missingData_value) {
            additonalMissingPopupString += '<strong>Note: </strong>' + app.appSettings.features_missingData_message;
            additonalMissingPopupString += '<br>';
          }

          // init additional (source url) HTML String for adding to end of layer popup info
          var additonalSourcePopupString = '';
          // check for source data flagged in feature
          if (featureProps[app.appSettings.features_source_property] != undefined && featureProps[app.appSettings.features_source_property] != '') {
            if (featureProps[app.appSettings.features_source_property].indexOf('http') != -1) {
              additonalSourcePopupString += '<strong>' + app.appSettings.features_source_message + '</strong>' + "<a href='" + featureProps[app.appSettings.features_source_property] + "' target='_blank'>" + app.appSettings.features_source_linkText + '</a>';
              additonalSourcePopupString += '<br>';
            }
          }

          // complete additonal string, by encapsulating in <p> if needed
          var additonalString = '';
          if (additonalMissingPopupString != '' || additonalSourcePopupString != '') {
            additonalString = '<p>' + additonalMissingPopupString + additonalSourcePopupString + '</p>';
          }

          return lyr.popup + additonalString;
        } else {
          // custom built template strings for specific layers
          if (lyr.name == 'air-quality-monitoring-sites') {
            // decide on message type for aqms classification (Breathe London vs LAQN/AQE)
            var popupTemplateString = '';
            var pollutantArray = ['a', 'b'];
            var pollutantDelimStr = this.getCommaDelimSentence([featureProps.pollutant_no2, featureProps.pollutant_pm10, featureProps.pollutant_o3, featureProps.pollutant_so2, featureProps.pollutant_pm25, featureProps.pollutant_co]);
            popupTemplateString = '<p><strong>Regulatory Air Quality Monitoring Site </strong><br><strong>{sitename}</strong> monitoring station measures <strong>' + pollutantDelimStr + "</strong>. To find out about the levels of pollution measured at this site please see here: <a href='{url}' target='_blank'>Click here for site data</a></p>";
            return popupTemplateString;
          } else {
            return '<p>Sorry, no information available</p>';
          }
        }
      } else {
        return null;
      }
    },
    updateActiveLayerCount: function updateActiveLayerCount() {
      var count = 0;
      this.layerGroups.forEach(function (layerGroup, index) {
        // using arrow here to keep app scope for this
        if (layerGroup.active == true) {
          layerGroup.layers.forEach(function (layer, index) {
            // using arrow here to keep app scope for this
            if (layer.active == true) {
              count++;
            }
          });
        }
      });
      this.appState.activeLayerCount = count;
    },
    getCommaDelimSentence: function getCommaDelimSentence(valArray) {
      // from an input array of values (could be strings or nulls), build sentence like: "this, that, other & thing"
      // loop & qualify values here!!
      var valString = '';
      for (v = 0; v < valArray.length; v++) {
        if (valArray[v] != null && valArray[v] != '') {
          // add to comma delim string
          valString += valArray[v] + ', ';
        }
      }
      // remove trailing ", " (2 chars)
      valString = valString.slice(0, -2);
      // replace last instance of "," with "&" (so reads better)
      var charReplacement = ' &';
      valString = valString.replace(/,([^,]*)$/, charReplacement + '$1');
      // return string
      return valString;
    },
    roundToTwoDP: function roundToTwoDP(num) {
      return Math.round(num * 100) / 100;
    }
  },
  mounted: function mounted() {
    this.initApp();
    this.initMap();
    this.initLayers();
    this.initPointSearchableList();
    this.initPointSearchQueries();
    this.updateLayersView();
    this.updateLayersCluster();
    this.initSearch();
    this.setIsEmbed();
    this.checkShowWelcomeAlert();
  }
});