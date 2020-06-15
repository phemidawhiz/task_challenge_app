import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-current-challenge',
  templateUrl: './current-challenge.component.html',
  styleUrls: ['./current-challenge.component.css'],
  moduleId: module.id
})
export class CurrentChallengeComponent {

  constructor(private router: Router) { }

  onTap() {
    this.router.navigate(['/edit'])
  }
}
