import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UserItemComponent } from './users-list/user-item/user-item.component';
import { UsersRoutingModule } from './user-routing.module';
import { UsersComponent } from './users.component';
import { AddOrModifyComponent } from './add-or-modify/add-or-modify.component';
import { SharedModule } from './../shared/shared.module';
import { UsersService } from './users.service'

@NgModule({
  declarations: [
    UsersListComponent,
    UserItemComponent,
    UsersComponent,
    AddOrModifyComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }