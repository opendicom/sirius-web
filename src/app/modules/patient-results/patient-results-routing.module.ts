import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientsComponent } from '@shared/components/patients/patients.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PatientsComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientResultsRoutingModule { }
