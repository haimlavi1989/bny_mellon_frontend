import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './../user.model'
import { UsersService } from "./../users.service";
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit, OnDestroy  {


  isLoadingUsersList = false;
  users: User[] = [];
  // Subscription
  private getUsersSubscription: Subscription | undefined;
  private usersChangedSubscription: Subscription | undefined;
  // Pagination
  public resultPerPageOptions = [3,5];
  public currentResultPerPage = this.resultPerPageOptions[0];
  public numberOfPages = 1;
  public currentPage = 1;

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    if (this.users.length === 0) {
      this.getUsers();
    }

    // Keep geting users changes
    this.usersChangedSubscription = this.usersService.usersChanged.subscribe({
        next: (response: User[]) => {
          console.log('user list usersChangedSubscription', response)
          this.users = response;
        },
        error: (error) => {
        }
    });
  }

  getUsers() {
    this.isLoadingUsersList = true;
    this.getUsersSubscription = this.usersService.getUsers(this.currentPage, this.currentResultPerPage).subscribe({
        next: (response: { users: User[], totalItems: number }) => {
            this.isLoadingUsersList = false;
            this.users = response.users;
            this.numberOfPages = Math.ceil(response.totalItems / this.currentResultPerPage);
        },
        error: (error) => {
            this.isLoadingUsersList = false;
            console.error('Error fetching users:', error);
        }
    });
  }

  ngOnDestroy() {
    if (this.getUsersSubscription) {
      this.getUsersSubscription.unsubscribe();
    }
    if (this.usersChangedSubscription) {
      this.usersChangedSubscription.unsubscribe();
    }
    this.users = [];
  }
}