import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from "./../users/users.service";
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from './../users/user.model'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  menuToggle : boolean = false;
  private usersChangedSubscription: Subscription | undefined;
  usersLength = 0;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
      // Keep geting users changes
      this.usersChangedSubscription = this.usersService.usersChanged.subscribe({
          next: (response: User[]) => {
            console.log(response)
            this.usersLength = response.length;
          },
          error: (error) => {
          }
      });
  }

  handleToggle() {
    this.menuToggle = !this.menuToggle;
  }

  ngOnDestroy() {
    if (this.usersChangedSubscription) {
      this.usersChangedSubscription.unsubscribe();
    }
  }
}
