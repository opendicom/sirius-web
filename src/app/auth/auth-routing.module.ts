import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from '@app/auth/components/signin/signin.component';
import { AuthorizeComponent } from '@app/auth/components/authorize/authorize.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: SigninComponent },
      { path: 'authorize', component: AuthorizeComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
