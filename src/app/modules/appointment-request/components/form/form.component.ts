import { Component, OnInit } from '@angular/core';

//--------------------------------------------------------------------------------------------------------------------//
// IMPORTS:
//--------------------------------------------------------------------------------------------------------------------//
import { Router } from '@angular/router';                                               // Router
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';            // Reactive form handling tools
import { SharedPropertiesService } from '@shared/services/shared-properties.service';   // Shared Properties
import { SharedFunctionsService } from '@shared/services/shared-functions.service';     // Shared Functions
import { ValidateDocumentsService } from '@shared/services/validate-documents.service'; // Validate documents service
import { UsersAuthService } from '@auth/services/users-auth.service';                   // Users Auth Service
import {                                                                                // Enviroment
  app_setting,
  modalities_list,
  force_origin,
  ISO_3166,
  document_types,
  gender_types,
  CKEditorConfig
} from '@env/environment';
import * as customBuildEditor from '@assets/plugins/customBuildCKE/ckeditor';               // CKEditor
//--------------------------------------------------------------------------------------------------------------------//

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public modalitiesList : any = modalities_list;
  public settings       : any = app_setting;
  public country_codes  : any = ISO_3166;
  public document_types : any = document_types;
  public genderTypes    : any = gender_types;

  //Initializate validation vars:
  public registered_doc_type  : boolean = false;
  public validation_result    : boolean = false;
  public disabled_save_button : boolean = true;
  public genderCheckErrors    : boolean = false;

  //Create CKEditor validator:
  public anamnesisValidator = true;
  public indicationsValidator = true;
  
  //Create CKEditor component and configure them:
  public customEditor = customBuildEditor;
  public editorConfig = CKEditorConfig;

  //Define Formgroup (Reactive form handling):
  public form!: FormGroup;
  public loginForm!: NgForm;

  //Define form_action:
  public form_action: any;

  //Re-define method in component to use in HTML view:
  public getKeys: any;

  //Set Reactive form:
  private setReactiveForm(fields: any): void{
    this.form = this.formBuilder.group(fields);
  }

  //Inject services, components and router to the constructor:
  constructor(
    public formBuilder      : FormBuilder,
    private router          : Router,
    public sharedProp       : SharedPropertiesService,
    private sharedFunctions : SharedFunctionsService,
    private sharedValidate  : ValidateDocumentsService,
    private userAuth        : UsersAuthService,
  ){
    //Pass Service Method:
    this.getKeys = this.sharedFunctions.getKeys;

    //Set Reactive Form (First time):
    this.setReactiveForm({
      urgency               : ['false', [Validators.required]],
      anamnesis             : ['', [Validators.required]],
      indications           : ['', [Validators.required]],
      
      //Study:
      study : this.formBuilder.group({
        modality            : ['', [Validators.required]]
      }),

      //Patient:
      patient: this.formBuilder.group({
        'doc_country_code'  : [ this.settings.default_country, [Validators.required]],
        'doc_type'          : [ this.settings.default_doc_type, [Validators.required]],
        'document'          : [ '', [Validators.required]],
        'name_01'           : [ '', [Validators.required]],
        'name_02'           : [ '', []],
        'surname_01'        : [ '', [Validators.required]],
        'surname_02'        : [ '', []],
        'gender'            : [ '', [Validators.required]],
        'birth_date'        : [ '', [Validators.required]],
        'phone_numbers[0]'  : [ '', [Validators.required]],
        'phone_numbers[1]'  : [ '', []],
        'email'             : [ '', [Validators.required]]
      }),
      
      //Extra data:
      extra: this.formBuilder.group({
        'physician_prof_id' : [ '', [Validators.required]],
        'physician_id'      : [ '', [Validators.required]],
        'physician_name'    : [ '', [Validators.required]],
        'physician_contact' : [ '', [Validators.required]]
      })
    });
  }

  ngOnInit(): void {}

  onLogin(){
    this.userAuth.userSignin('machine_user');
  }

  async onSubmit(){
    //Check gender mat-opetion errors (mat-option validate but does not show validation error):
    if(this.form.controls['patient'].value.gender !== '' && this.form.controls['patient'].value.gender !== undefined) {
      this.genderCheckErrors = false;
    } else {
      this.genderCheckErrors = true;
    }

    //Validate CKEditor anamnesis (min length 10 + 7 chars [<p></p>]):
    if(this.form.value.anamnesis.length < 17){
      this.anamnesisValidator = false;
    } else {
      this.anamnesisValidator = true;
    }

    //Validate CKEditor indications (min length 10 + 7 chars [<p></p>]):
    if(this.form.value.indications.length < 17){
      this.indicationsValidator = false;
    } else {
      this.indicationsValidator = true;
    }

    //Validate fields:
    if(this.form.valid){  
      //Create save object to preserve data types in form.value (Clone objects with spread operator):
      let saveData = { ...this.form.value };

      //Data normalization - Booleans types (mat-option cases):
      if(typeof saveData.urgency != "boolean"){ saveData.urgency = saveData.urgency.toLowerCase() == 'true' ? true : false; }

      //Data normalization - Dates types:
      //datetimeFulCalendarFormater
      //saveData.patient.birth_date = this.sharedFunctions.setDatetimeFormat(this.form.value.patient.birth_date);

      //Data normalization - Phone numbers to array:
      saveData.patient['phone_numbers'] = [];
      saveData.patient['phone_numbers'].push(this.form.value.patient['phone_numbers[0]']);
      if(this.form.value.patient['phone_numbers[1]'] != undefined && this.form.value.patient['phone_numbers[1]'] != '') { saveData.patient['phone_numbers'].push(this.form.value.patient['phone_numbers[1]']); }

      //Force Imaging and Referring data:
      if(force_origin.organization !== undefined && force_origin.organization !== null && force_origin.organization !== ''){
        saveData['imaging'] = { 'organization' : force_origin.organization };
        saveData['referring'] = { 'organization' : force_origin.organization };
      }
      if(force_origin.branch !== undefined && force_origin.branch !== null && force_origin.branch !== ''){
        saveData['imaging'] = { 'branch' : force_origin.branch };
        saveData['referring'] = { 'branch' : force_origin.branch };
      }
      
      //Delete temp values:
      delete saveData.patient['phone_numbers[0]'];
      delete saveData.patient['phone_numbers[1]'];

      //Check optional empty fields:
      if (saveData.patient.name_02 === null || saveData.patient.name_02 === undefined || saveData.patient.name_02 === '') { delete saveData.patient.name_02; }
      if (saveData.patient.surname_02 === null || saveData.patient.surname_02 === undefined || saveData.patient.surname_02 === '') { delete saveData.patient.surname_02; }

      //Authenticate and save data:
      await this.userAuth.userSignin('machine_user', (signinRes) => {
        //Save data:
        this.sharedFunctions.save('insert', 'appointment_requests', '', saveData, [], (saveRes) => {
          //Check operation status:
          if(saveRes.success === true){
            //Send snakbar message and redirect to start page.
            this.sharedFunctions.sendMessage('¡Solicitud enviada satisfactoriamente!');
            this.router.navigate(['/start']);
          } else {
            //Send snakbar message:
            this.sharedFunctions.sendMessage(saveRes.message);
          }
        });
      });
    }
  }

  onCancel(){
    //Redirect to the start page:
    this.router.navigate(['/start']);
  }

  validateDocument(){
    //Get validation result:
    const result = this.sharedValidate.validate(this.form.value.patient.doc_country_code, this.form.value.patient.doc_type, this.form.value.patient.document);

    //Set validation result in component vars:
    this.registered_doc_type = result.registered_doc_type;

    //Check that the type of document is registered:
    if(result.registered_doc_type === true){
      this.validation_result = result.validation_result;

      //Enable and disable save button:
      if(result.validation_result === true){
        this.disabled_save_button = false;
      } else {
        this.disabled_save_button = true;
      }
    } else {
      //Enable save button (Document type not registered):
      this.disabled_save_button = false;
    }
  }
}
