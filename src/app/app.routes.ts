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
import { authGuard } from './core/guards/auth.guard'; 
import { PaymentSuccessComponent } from './payments/payment-success/payment-success.component';
import { PaymentCancelComponent } from './payments/payment-cancel/payment-cancel.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';

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
    { path: 'payments/success', component: PaymentSuccessComponent },
    { path: 'payments/cancel', component: PaymentCancelComponent },
    { path: 'auth/confirm', component: ConfirmComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];  

