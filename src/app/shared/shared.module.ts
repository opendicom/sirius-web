import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from '@shared/shared-routing.module';

// Angular Material Modules and Components:
import { SharedMaterialModule } from '@shared/shared-material.module';

// Shared components:
import { ActionComponent } from '@shared/components/main-structure/action/action.component';
import { FooterComponent } from '@shared/components/main-structure/footer/footer.component';
import { StartPageComponent } from '@shared/components/start-page/start-page.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

//Default patients init:
import { PatientsComponent } from '@shared/components/patients/patients.component';

// Shared pipes:
import { HighlighterPipe } from '@shared/pipes/highlighter.pipe';
import { AccnoDatePipe } from '@shared/pipes/accno_date.pipe';

// Required for bidirectional binding (ngModule):
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import all Input Control directives:
import * as IC from '@shared/directives/input-control.directive';

@NgModule({
  declarations: [
    // Shared components:
    ActionComponent,
    FooterComponent,
    StartPageComponent,
    NotFoundComponent,

    //Default patients init:
    PatientsComponent,

    // Shared pipes:
    HighlighterPipe,
    AccnoDatePipe,

    //Input Control:
    IC.numbersDirective,
    IC.numbersWSDirective,
    IC.numbersWDDirective,
    IC.lettersDirective,
    IC.lettersWSDirective,
    IC.specialCharsDirective,
    IC.specialCharsWSDirective
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Shared components:
    ActionComponent,
    FooterComponent,
    StartPageComponent,
    NotFoundComponent,
    SharedMaterialModule,

    //Default patients init:
    PatientsComponent,
    
    // Shared pipes:
    HighlighterPipe,
    AccnoDatePipe,

    //Input Control:
    IC.numbersDirective,
    IC.numbersWSDirective,
    IC.numbersWDDirective,
    IC.lettersDirective,
    IC.lettersWSDirective,
    IC.specialCharsDirective,
    IC.specialCharsWSDirective
  ]
})
export class SharedModule { }
