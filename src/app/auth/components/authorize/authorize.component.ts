import { Component, OnInit } from '@angular/core';

//--------------------------------------------------------------------------------------------------------------------//
// IMPORTS:
//--------------------------------------------------------------------------------------------------------------------//
import { NgForm } from '@angular/forms';                                                // NgForm (bidirectional binding)
import { UsersAuthService } from '@auth/services/users-auth.service';                   // Users Auth Service
import { SharedPropertiesService } from '@shared/services/shared-properties.service';   // Shared Properties
import { SharedFunctionsService } from '@shared/services/shared-functions.service';     // Shared Functions
import { Router } from '@angular/router';                                               // Router
//--------------------------------------------------------------------------------------------------------------------//

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {
  public userInfo: any;
  public availableDomains: any = {};

  //Inject services to the constructor:
  constructor(
    private router: Router,
    private userAuth: UsersAuthService,
    public sharedProp: SharedPropertiesService,
    private sharedFunctions: SharedFunctionsService
  ) { }

  ngOnInit(): void {
    //Check if temp token exist:
    if(localStorage.getItem('sirius_temp')){

      //Make sure the token is removed:
      if(localStorage.getItem('sirius_auth')){
        localStorage.removeItem('sirius_auth');
      }

      //Set isLogged to false to not display the toolbar and sidebar:
      this.sharedProp.isLogged = false;

      //Get user info (Local file temp):
      this.userInfo = this.sharedFunctions.getUserInfo(true);

      //Set available domains:
      Object.keys(this.userInfo.permissions).forEach((key) => {
        this.availableDomains[this.userInfo.permissions[key].domain] = this.userInfo.permissions[key].description;
      });
    } else {
      //Redirect to signin:
      this.onCancel();
    }
  }

  onSubmit(form_data: NgForm): void {
    //Validate input fields:
    if(form_data.valid){
      //Authorize:
      this.userAuth.userAuthorize(form_data);
    }
  }

  onCancel(): void {
    //Delete token (Temp token 1m):
    this.userAuth.removeToken();

    //Redirect to signin:
    this.router.navigate(['/signin']);
  }

}
