import { AppState } from '../../app/app.global';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, MenuController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AlertService } from '../../providers/alert/alert';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-world-map',
  templateUrl: 'world-map.html',
})
export class WorldMapPage {

  // @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  map: any;
  mapElement: any;
  mapInitialised: boolean = false;
  markers = new Map<string, any>();
  mapsUrl = 'https://maps.google.com/maps/api/';
  apiKey: string = "AIzaSyAssj0h93YuqFKmm1xGLkb5-NXc12sLL2Y";
  myLocation: any;
  users = [];
  lightSideCount: any;
  darkSideCount: any;

  constructor(public navParams: NavParams,
    public renderer: Renderer,
    public global: AppState,
    public platform: Platform,
    public connectivityService: ConnectivityProvider,
    public menu: MenuController,
    public geolocation: Geolocation,
    public firebaseData: FirebaseDataProvider,
    public alertCtrl: AlertService,
    public storage: Storage,) {
      menu.swipeEnable(false, 'menu');
      this.loadGoogleMaps();
  }

  ionViewDidLoad() {
    this.markers = new Map();
    this.users = [];
    this.loadGoogleMaps();
  }

  requestUserInfo(){
    this.centerToMyLocation();
  }

 
  loadGoogleMaps() {
    this.addConnectivityListeners();
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        if(!document.body.children['googleMaps']){
          let script = document.createElement("script");
          script.id = "googleMaps";
          script.src = `${this.mapsUrl}js?v=3&key=${this.apiKey}&callback=mapInit`;

          document.body.appendChild(script);
        }
      }
    }
    else {
      if (this.connectivityService.isOnline()) {
        this.initMap();
        this.enableMap();
      }
      else {
        this.disableMap();
      }
    }
  }

  initMap() {
    this.mapInitialised = true;

    let darkMapStyles = [ { "elementType": "geometry", "stylers": [ { "color": "#212121" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#212121" } ] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [ { "color": "#757575" } ] }, { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.business", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#181818" } ] }, { "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1b1b1b" } ] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [ { "color": "#2c2c2c" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#8a8a8a" } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#373737" } ] }, { "featureType": "road.arterial", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#3c3c3c" } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [ { "color": "#4e4e4e" } ] }, { "featureType": "road.local", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#000000" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#3d3d3d" } ] } ];
    let lightMapStyles = [ { "elementType": "geometry", "stylers": [ { "color": "#1d2c4d" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#8ec3b9" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#1a3646" } ] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#64779e" } ] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] }, { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [ { "color": "#334e87" } ] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#283d6a" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#6f9ba5" } ] }, { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "poi.business", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#3C7680" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#304a7d" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#2c6675" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#255763" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#b0d5ce" } ] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [ { "color": "#023e58" } ] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#283d6a" } ] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#3a4762" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#0e1626" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#4e6d70" } ] } ]

    let mapOptions = {
      center: null,
      stylers: lightMapStyles,
      // styles: this.global.get('side') === 'light' ? lightMapStyles : darkMapStyles,
      zoom: 4,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.myLocation = latLng;
      mapOptions.center = latLng;
      this.mapElement = document.getElementById('map');
      this.map = new google.maps.Map(this.mapElement, mapOptions);
      this.watchForChanges();
      setImmediate(this.requestUserInfo(),300);
    }, error => {
      mapOptions.center = new google.maps.LatLng(10.762622, 106.660172);
      this.mapElement = document.getElementById('map');
      this.map = new google.maps.Map(this.mapElement, mapOptions);
      this.watchForChanges();
      setImmediate(this.requestUserInfo(),300);
    });
  }

  disableMap() {
    if (this.pleaseConnect) {
      this.renderer.setElementStyle(this.pleaseConnect.nativeElement, 'display', 'block');
    }
  }

  enableMap() {
    if (this.pleaseConnect) {
      this.renderer.setElementStyle(this.pleaseConnect.nativeElement, 'display', 'none');
    }
  }

  addConnectivityListeners() {
    this.connectivityService.watchOnline().subscribe(() => {
      console.log("online");
      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    });

    this.connectivityService.watchOffline().subscribe(() => {
      console.log("offline");
      this.disableMap();
    });
  }

  watchForChanges() {
    // this.firebaseData.watchForUpdates().subscribe((updatedUser: any) => {
    // });
  }

  centerToMyLocation() {
    if (this.myLocation) {
      this.map.setZoom(13);
      this.map.panTo(this.myLocation);
      this.addMarker(this.myLocation, "My Location");
    } else {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.myLocation = latLng;
        this.map.setZoom(13);
        this.map.panTo(latLng);
        this.addMarker(this.myLocation, "My Location");
      }).catch(error => {
        console.log('geolocation error', error);
      });
    }
  }

  addMarker(position, name) {
    let marker = new google.maps.Marker({
          clickable: true,
          position: position,
          animation: google.maps.Animation.DROP,
          map: this.map
        });

    let infowindow = new google.maps.InfoWindow({
      content: name
    });

    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });
  }
}
