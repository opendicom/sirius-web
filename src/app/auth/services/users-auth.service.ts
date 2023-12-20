import { Injectable } from '@angular/core';

//--------------------------------------------------------------------------------------------------------------------//
// IMPORTS:
//--------------------------------------------------------------------------------------------------------------------//
import { NgForm } from '@angular/forms';                                                // For bidirectional binding (NgForm).
import { ApiClientService } from '@shared/services/api-client.service';                 // API Client Service
import { SharedFunctionsService } from '@shared/services/shared-functions.service';     // Shared Functions
import { MatSnackBar } from '@angular/material/snack-bar';                              // SnackBar (Angular Material)
import { Router } from '@angular/router';                                               // Router
import { JwtHelperService } from "@auth0/angular-jwt";                                  // JWT Helper Service (Check JWT Expiration)
import { machine_user, entry_page } from '@env/environment';                            // Enviroment
//--------------------------------------------------------------------------------------------------------------------//

//Create helper object:
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UsersAuthService {

  //Inject services to the constructor:
  constructor(
    private router: Router,
    private apiClient: ApiClientService,
    private sharedFunctions: SharedFunctionsService,
    private snackBar: MatSnackBar,
  ) { }


  //--------------------------------------------------------------------------------------------------------------------//
  // USER SIGNIN:
  //--------------------------------------------------------------------------------------------------------------------//
  userSignin(form_data: any, callback = (res: any) => {}): any {
    //Create authentication object:
    let siriusAuth: any = {};

    //Set signinUser:
    let signinUser: any = {};
    if(form_data === 'machine_user'){
      signinUser = machine_user;
    } else {
      signinUser = form_data.value;
    }

    //Create observable obsSignin:
    const obsUserSignin = this.apiClient.sendRequest('POST', 'signin', signinUser);

    //Observe content (Subscribe):
    obsUserSignin.subscribe({
      next: res => {
        //Check operation status:
        if(res.success === true){

          //Check machine_user case:
          if(form_data === 'machine_user'){
            //Set only the token:
            siriusAuth['token'] = res.token;

            //Stringify final authentication object:
            const final_siriusAuth = JSON.stringify(siriusAuth);

            //Crypt stringify object and create local file (1 day token):
            localStorage.setItem('sirius_auth', this.sharedFunctions.simpleCrypt(final_siriusAuth));

            //Execute callback:
            callback(res);
          } else {
            //Set user data into authentication object:
            siriusAuth = res.data;

            //Add token into authentication object:
            siriusAuth.token = res.token;

            //Stringify final authentication object:
            const final_siriusAuth = JSON.stringify(siriusAuth);

            //If user signin with only one permission:
            if(Object.keys(res.data.permissions).length == 1){
              //Check that the user is a patient role:
              if(res.data.permissions[0].role === 9){
                //Crypt stringify object and create local file (1 day token):
                localStorage.setItem('sirius_auth', this.sharedFunctions.simpleCrypt(final_siriusAuth));

                //Send message into screen (Password match - Signin successfully):
                this.snackBar.open(res.message, '', {
                  duration: 2000
                });

                //Redirect to Patient Results Page:
                this.router.navigate(['/patient-results']);
              } else {
                this.sharedFunctions.sendMessage('El acceso a través de este módulo es de uso exclusivo para pacientes.');
              }

            //Multiple permissions:
            } else {
              //Crypt stringify object and create local file (1 minute token):
              localStorage.setItem('sirius_temp', this.sharedFunctions.simpleCrypt(final_siriusAuth));

              //Redirect to Authorize Page:
              this.router.navigate(['/signin/authorize']);
            }
          }
          
        } else {
          //Send message into screen:
          this.userSigninError(res.message);
        }
      },
      error: res => {
        //Send error into screen:
        this.userSigninError(res.error.message);
      }
    });
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------//
  // USER AUTHORIZE:
  //--------------------------------------------------------------------------------------------------------------------//
  userAuthorize(form_data: NgForm): any {
    //Create authentication object:
    let siriusAuth: any = {};

    //Force patient as user role (Sirius web is for patients only):
    form_data.value['role'] = 9;
    
    //Create observable obsUserAuthorize:
    const obsUserAuthorize = this.apiClient.sendRequest('POST', 'signin/Authorize', form_data.value);

    //Observe content (Subscribe):
    obsUserAuthorize.subscribe({
      next: async res => {
        //Check operation status:
        if(res.success === true){
          //Set user data into authentication object:
          siriusAuth = this.sharedFunctions.getUserInfo(true);

          //Initialize domain type and description:
          let domainType = '';
          let domainDescription = '';
          let concession : any = [];

          //Preserve domain type and description:
          await Promise.all(Object.keys(siriusAuth.permissions).map((key) => {
            //If domain and role indicated in form is the same in the permissions object:
            if(siriusAuth.permissions[key].domain == form_data.value.domain && parseInt(siriusAuth.permissions[key].role, 10) == parseInt(form_data.value.role, 10)){
              //Set domain type and description:
              domainType = siriusAuth.permissions[key].type;
              domainDescription = siriusAuth.permissions[key].description;
              concession = siriusAuth.permissions[key].concession;
            }
          }));

          //Delete permissions array:
          delete siriusAuth.permissions;

          //Set selected permision:
          siriusAuth.permissions = [{
            domain: form_data.value.domain,
            type: domainType,
            description: domainDescription,
            role: parseInt(form_data.value.role, 10),
            concession: concession
          }];

          //Add token into authentication object:
          siriusAuth.token = res.token;

          //Stringify final authentication object:
          const final_siriusAuth = JSON.stringify(siriusAuth);

          //Crypt stringify object and create local file (1 day token):
          localStorage.setItem('sirius_auth', this.sharedFunctions.simpleCrypt(final_siriusAuth));

          //Delete temporal token (if exist):
          if(localStorage.getItem('sirius_temp')){
            localStorage.removeItem('sirius_temp');
          }

          //Send message into screen (Password match - Signin successfully):
          this.snackBar.open(res.message, '', {
            duration: 2000
          });

          //Redirect to Patient Results Page:
          this.router.navigate(['/patient-results']);
        } else {
          //Send message into screen:
          this.userSigninError(res.message);
        }
      },
      error: res => {
        //Send error into screen:
        this.userSigninError(res.error.message);
      }
    });
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------//
  // REMOVE TOKEN:
  //--------------------------------------------------------------------------------------------------------------------//
  public removeToken(): void{
    //Check if token exist:
    if(localStorage.getItem('sirius_auth')){
      //Delete token:
      localStorage.removeItem('sirius_auth');
    }

    //Check if temp token exist:
    if(localStorage.getItem('sirius_temp')){
      //Delete token:
      localStorage.removeItem('sirius_temp');
    }
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------//
  // USER LOGOUT:
  //--------------------------------------------------------------------------------------------------------------------//
  userLogout(redirect: boolean = true): void{
    this.removeToken();
    if(redirect === true){
      this.router.navigate(['/' + entry_page]);
    }
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------//
  // USER IS LOGGED:
  //--------------------------------------------------------------------------------------------------------------------//
  userIsLogged(redirect: boolean = true): boolean {
    //Get JWT of localStorage:
    if(localStorage.getItem('sirius_auth')){
      //Get token & check if is expired:
      const jwt_token = this.sharedFunctions.readToken();
      const isExpired = helper.isTokenExpired(jwt_token);

      if (isExpired) {
        this.userLogout(redirect);
        return false;
      } else {
        return true;
      }
    } else {
      this.userLogout(redirect);
      return false;
    }
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------------------------//
  // USER SIGNIN ERROR:
  //--------------------------------------------------------------------------------------------------------------------//
  private userSigninError(message: string): void{
    this.snackBar.open(message, 'ACEPTAR');
    this.removeToken();
  }
  //--------------------------------------------------------------------------------------------------------------------//
}
