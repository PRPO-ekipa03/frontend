import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venues/venue-details/venue-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ListVenueComponent } from './list-venue/list-venue.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateEventComponent } from './create-event/create-event.component';

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    {
        path: 'venues',
        component: VenuesComponent,       
        children: [
            { path: ':venueId', component: VenueDetailsComponent },
        ]
      },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-venue', component: ListVenueComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'create-event', component: CreateEventComponent},


    //{ path: 'venues/:venueId', component: VenueDetailsComponent }, 
];

