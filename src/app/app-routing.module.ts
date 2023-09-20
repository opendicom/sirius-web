import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Auth Guard:
import { AuthGuard } from '@guards/auth.guard';

//Shared components:
import { StartPageComponent } from '@shared/components/start-page/start-page.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  // Start Page:
  { path: 'start', component: StartPageComponent },
  { path: '', redirectTo: 'start', pathMatch: 'full' }, // Redirection from main page to start.

  // Patient Signin:
  { path: 'signin', loadChildren: () => import('@auth/auth.module').then( m => m.AuthModule ) },
  
  // Appointment request form:
  { path: 'appointment-request', loadChildren: () => import('@modules/appointment-request/appointment-request.module').then( m => m.AppointmentRequestModule ) },

  //Patient results:
  { path: 'patient-results', loadChildren: () => import('@modules/patient-results/patient-results.module').then( m => m.PatientResultsModule ), canActivate: [AuthGuard] },

  // Not Found Page (404 Not Found):
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
