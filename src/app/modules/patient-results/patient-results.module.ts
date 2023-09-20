import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientResultsRoutingModule } from '@modules/patient-results/patient-results-routing.module';

import { SharedModule } from '@shared/shared.module';
import { SharedMaterialModule } from '@shared/shared-material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PatientResultsRoutingModule,
    SharedModule,
    SharedMaterialModule,
  ]
})
export class PatientResultsModule { }
