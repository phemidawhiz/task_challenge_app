import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { TodayComponent } from './challenges/today/today.component';
import { CurrentChallengeComponent } from './challenges/current-challenge/current-challenge.component';
import { ChallengeEditComponent } from './challenges/challenge-edit/challenge-edit.component';

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'challenge', component: CurrentChallengeComponent },
    { path: 'edit', component: ChallengeEditComponent },
    { path: 'today', component: TodayComponent } // must omit slash here
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
