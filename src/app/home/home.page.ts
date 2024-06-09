import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonInfiniteScroll } from '@ionic/angular';
import { FeedService } from '../services/feed.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class Home implements OnInit {

  constructor(private feedService: FeedService) {}
  loading = true;
  originalItems: any[] | undefined;

  items: any[] = [];
  skip = 0;
  limit = 30; 
  latitude = 38.45869687231535;
  longitude = 27.205105572938923;

  ngOnInit() {
    this.getCurrentLocation();
  }


  
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    if (!this.originalItems) {
      this.originalItems = [...this.items];
    }
  
    this.items = this.originalItems.filter((d) => d.title.toLowerCase().indexOf(query) > -1);
    this.items.sort((a, b) => {
      return this.calculateDistance(a.latitude, a.longitude, this.latitude, this.longitude) - this.calculateDistance(b.latitude, b.longitude, this.latitude, this.longitude);
    });
  }
  
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.loadItems();
        },
        (error) => {
          console.error('Error getting location', error);
          this.loadItems();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.loadItems();
    }
  }
  private loadItems() {
    this.loading = true;
    this.feedService.getFeed(this.skip, this.limit, this.latitude, this.longitude).subscribe(
      (data) => {

  

        this.loading = true; 

        this.items = this.items.concat(data.response);
        this.loading = false; 

      },
      (error) => {
        this.loading = false; 
        console.error('Error fetching feed', error);
      }
    );
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.skip += this.limit; 
    this.loadItems(); 
    setTimeout(() => {
      ev.target.complete(); 
    }, 500);
  }



  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const nyc = new google.maps.LatLng(lat1, lon1);
    const london = new google.maps.LatLng(lat2, lon2);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
    const distanceInKm = Number((distance / 1000).toFixed(2));
    return distanceInKm;
  }
  

isWorkingHours(openTime: string, closeTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const openHour = parseInt(openTime.split(':')[0]);
  const openMinutes = parseInt(openTime.split(':')[1]);
  const closeHour = parseInt(closeTime.split(':')[0]);
  const closeMinutes = parseInt(closeTime.split(':')[1]);

  if (closeHour < openHour || (closeHour == openHour && closeMinutes < openMinutes)) {
    return currentHour >= openHour || (currentHour == openHour && currentMinutes >= openMinutes)
     || (currentHour < closeHour || (currentHour == closeHour && currentMinutes < closeMinutes));
  }

  return (currentHour >= openHour && currentHour < closeHour) || (currentHour == closeHour && currentMinutes < closeMinutes);
}

}
