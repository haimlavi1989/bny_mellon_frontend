import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AddOrModifyComponent } from './add-or-modify/add-or-modify.component';

const routes: Routes = [
    {
        path: '', component: UsersComponent,
        children: [
            { path: '', component: UsersListComponent },
            { path: 'add', component: AddOrModifyComponent },
            { path: 'edit/:id', component: AddOrModifyComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }