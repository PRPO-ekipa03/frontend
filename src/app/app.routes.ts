import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venues/venue-details/venue-details.component';


export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    {
        path: 'venues',
        component: VenuesComponent,        // The parent that shows nav + hero
        children: [
            { path: ':venueId', component: VenueDetailsComponent },
        ]
      },
    //{ path: 'venues/:venueId', component: VenueDetailsComponent }, 
];

