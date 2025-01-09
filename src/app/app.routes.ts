import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueDetailsComponent } from './venues/venue-details/venue-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ListVenueComponent } from './list-venue/list-venue.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './core/guards/auth.guard'; // Path to your auth guard

export const routes: Routes = [
    { path: 'home', component: HomepageComponent },
    {
        path: 'venues',
        component: VenuesComponent, canActivate: [authGuard],       
        children: [
            { path: ':venueId', component: VenueDetailsComponent, canActivate: [authGuard] },
        ]
      },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'list-venue', component: ListVenueComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: 'create-event', component: CreateEventComponent, canActivate: [authGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},

];

