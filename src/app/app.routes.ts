import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VenuesComponent } from './venues/venues.component';


export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    { path: 'venues', component: VenuesComponent },
];
