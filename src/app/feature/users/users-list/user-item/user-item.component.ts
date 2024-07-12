import { Component, Input } from '@angular/core';
import { User } from '../../user.model';
import { UsersService } from "./../../users.service";

@Component({
  // Selector changed to better support table tag
  selector: '[app-user-item]',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {

  @Input() user: User = new User;
  public isLoadingUser = false;

  constructor(private usersService: UsersService) {}

  deleteUser(id: string) {
    this.isLoadingUser = true;
    this.usersService.deleteUser(id).subscribe({
        next: (response: any) => {
          this.isLoadingUser = false;
        },
        error: (error) => {
          this.isLoadingUser = false;
          console.error('Error deleting user:', error);
        }
    });
  }
}
