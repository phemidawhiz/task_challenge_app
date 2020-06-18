import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UIService } from './shared/ui.service';
import { Subscription } from 'rxjs';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'ns-app',
  moduleId: module.id,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(RadSideDrawerComponent, {static: false}) drawerComponent: RadSideDrawerComponent;
  activeChallenge = '';
  private drawerSub: Subscription;
  private drawer: RadSideDrawer

  constructor(private uiService: UIService, private changeDetectorRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.drawerSub = this.uiService.drawerState.subscribe(() => {
      if(this.drawer) {
        this.drawer.toggleDrawerState();
      }
      
    });
    console.log("toggle side drawer");
  }

  onLogout() {
    this.uiService.toggleDrawer();
  }

  ngOnDestroy() {
    if(this.drawerSub) {
      this.drawerSub.unsubscribe();
    }
  }


  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
    this.changeDetectorRef.detectChanges();
  }

  onChallengeInput(challengeDescription: string) {
    this.activeChallenge = challengeDescription;
    console.log('onChallengeInput: ', challengeDescription);
  }
}
