import { Component } from '@angular/core';

//--------------------------------------------------------------------------------------------------------------------//
// IMPORTS:
//--------------------------------------------------------------------------------------------------------------------//
import { SharedPropertiesService } from '@shared/services/shared-properties.service';   // Shared Properties
import { SharedFunctionsService } from '@shared/services/shared-functions.service';         // Shared Functions
//--------------------------------------------------------------------------------------------------------------------//

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sirius-web';

  //Inject services to the constructor (Create first actionProp):
  constructor(
    public sharedProp       : SharedPropertiesService,
    public sharedFunctions  : SharedFunctionsService
  ) {}
}
