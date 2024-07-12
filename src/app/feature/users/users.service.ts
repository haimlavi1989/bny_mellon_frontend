import { Injectable } from '@angular/core';
import { User } from './user.model';
import { DataService } from '../shared/services/data.service';
import { tap, catchError, map } from 'rxjs/operators';
import { Subject, Observable, of, throwError } from 'rxjs';

interface UserResponse {
  users: User[];
  totalItems: number;
}

// This class will hold & manage Users data CRUD
@Injectable()
export class UsersService {

  public usersChanged = new Subject<User[]>();
  private users: User[] = [];
  private resource: string = `users`;
  totalItems = 0;

  constructor(
    private dataService: DataService,
  ) {
  }

  setUsers(users: User[]) {
    this.users = users;
    this.usersChanged.next([...this.users]);
  }

  getUsers(page = 1, limit = 2): Observable<UserResponse> {
    // Check if users are already cached
    if (this.users.length > 0) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = this.users.slice(startIndex, endIndex);
      if (paginatedUsers.length > 0) {
        return of({ users: paginatedUsers, totalItems: this.totalItems }); // Return cached data
      }
    }
    // Fetch data from the server if no data available or client requested different page
    const resource = this.resource + `?page=${page}&limit=${limit}`;
    return this.dataService.getAll(resource).pipe(
      tap((response: any) => {
        // Update cache with fetched data
        this.users = [...this.users, ...response.data];
        this.totalItems = response.fullResoults;
      }),
      map(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = this.users.slice(startIndex, endIndex);
        return { users: paginatedUsers, totalItems: this.totalItems }; // Return paginated data
      }),
      catchError((error) => {
        console.error(error);
        return of({ users: [], totalItems: 0 });
      })
    );
  }

  getUser(id: string): Observable<User> {
    // Check if the user is already cached
    const cachedUser = this.users.find(user => user.id === id);
    if (cachedUser) {
      return of(cachedUser);
    }

    // If user is not cached, fetch all users and find the user
    return this.getUsers().pipe(
      map(() => {
        const user = this.users.find(user => user.id === id);
        if (!user) {
          throw new Error(`User with ID ${id} not found.`);
        }
        return user;
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  createUser(userResource: User): Observable<User> {
    return this.dataService.create(this.resource, userResource).pipe(
      map((response: any) => response.data),
      catchError((error: any) => {
        console.error('Error creating user:', error);
        return throwError(() => new Error(error));
      }),
      tap((userObj: any) => {
        this.users = [userObj, ...this.users];
        this.usersChanged.next([...this.users]);
      }),
    );
  }

  updateUser(id: string, newUser: User) {
    const userIndex = this.users.findIndex(user => user.id === id);
    return this.dataService.update(this.resource, newUser).pipe(
      catchError((error: any) => {
        console.error('Error updating user:', error);
        return throwError(() => new Error(error));
      }),
      tap((response: any) => {
        if (response.status) {
          this.users[userIndex] = newUser;
          this.usersChanged.next([...this.users]);
        }
      }),
    );
  }

  deleteUser(userID: string): Observable<any> {
    return this.dataService.delete(this.resource, userID).pipe(
      catchError((error: any) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error(error));
      }),
      tap(() => {
        // If successful, also delete the record from the local
        this.deleteLocalUser(userID);
      })
    );
  }

  private deleteLocalUser(userID: string) {
    const userIndex = this.users.findIndex(user => user.id === userID);
    if (userIndex !== -1) {
      const updatedUsers = this.users.filter(user => user.id !== userID); // Using filter for immutability
      this.users = updatedUsers;
      this.usersChanged.next([...this.users]);
    } else {
      console.error(`User with ID ${userID} not found.`);
    }
  }
}
