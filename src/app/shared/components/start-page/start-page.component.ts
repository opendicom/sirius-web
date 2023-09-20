import { Component, OnInit } from '@angular/core';

//--------------------------------------------------------------------------------------------------------------------//
// IMPORTS:
//--------------------------------------------------------------------------------------------------------------------//
import { UsersAuthService } from '@auth/services/users-auth.service';                   // Users Auth Service
import { SharedPropertiesService } from '@shared/services/shared-properties.service';   // Shared Properties
//--------------------------------------------------------------------------------------------------------------------//

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  //Inject services to the constructor:
  constructor(
    private userAuth: UsersAuthService,
    public sharedProp: SharedPropertiesService
  ) {}

  ngOnInit(): void {
    //Logout if is entered in this component:
    this.userAuth.userLogout();

    //Refresh isLoged value not display the toolbar and sidebar:
    this.sharedProp.checkIsLogged();
  }
}
