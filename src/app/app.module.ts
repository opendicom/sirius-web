import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';

//---------------------------------------------------------------------------------------------------------------------------//
// Import LOCALE_ID to set locale code & language:
//---------------------------------------------------------------------------------------------------------------------------//
import { LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);
//---------------------------------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------------------------------//
// Aditional imports:
//---------------------------------------------------------------------------------------------------------------------------//
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//---------------------------------------------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------------------------------------------//
// Shared Module:
//---------------------------------------------------------------------------------------------------------------------------//
import { SharedModule } from '@shared/shared.module';
import { HttpInterceptorService } from '@shared/services/http-interceptor.service';
//---------------------------------------------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------------------------------------------//
// Auth:
//---------------------------------------------------------------------------------------------------------------------------//
import { AuthModule } from '@auth/auth.module';
//---------------------------------------------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------------------------------------------------------//
// Modules:
//---------------------------------------------------------------------------------------------------------------------------//
import { AppointmentRequestModule } from '@modules/appointment-request/appointment-request.module';
import { PatientResultsModule } from '@modules/patient-results/patient-results.module';
//---------------------------------------------------------------------------------------------------------------------------//


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    // Aditional imports:
    HttpClientModule,

    // Shared Module:
    SharedModule,

    // Auth:
    AuthModule,

    // Modules:
    AppointmentRequestModule,
    PatientResultsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: 'es-AR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
