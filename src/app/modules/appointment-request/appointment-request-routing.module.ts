import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from '@modules/appointment-request/components/form/form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: FormComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRequestRoutingModule { }
