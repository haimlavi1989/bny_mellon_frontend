import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from './../users.service'
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-add-or-modify',
  templateUrl: './add-or-modify.component.html',
  styleUrl: './add-or-modify.component.scss'
})
export class AddOrModifyComponent implements OnInit, OnDestroy {
  form: any;
  id = '';
  isAddMode = false;
  loading = false;
  submitted = false;
  // Subscription
  private routeSubscription: Subscription | undefined;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private usersService: UsersService
  ) {}

  ngOnInit() {
      this.isAddMode = !this.id;
      this.routeSubscription = this.route.params.subscribe(params => {
        console.log(params)
        this.id = params['id'];
        this.isAddMode = !this.id;
        this.initializeForm();
        if (!this.isAddMode) {
          this.loadUserData();
        }
      });
  }

  loadUserData() {
    this.usersService.getUser(this.id).subscribe({
        next: (userData: any) => {
          this.form.patchValue(userData);
        },
        error: (error) => {
            this.loading = false;
            console.error('Error load user data:', error);
        }
    });
  }
    
  initializeForm() {
     this.form = this.formBuilder.group({
        // title: ['', Validators.required],
        name: ['', Validators.required],
        // firstName: ['', Validators.required],
        // lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: ['123456'],
        passwordConfirm: ['123456']
      }, {});
  }
  onSubmit() {

      this.submitted = true;

      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.createUser();
      } else {
          this.updateUser();
      }
  }

  private createUser() {
        this.loading = true;
        this.usersService.createUser(this.form.value).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (error) => {
                this.loading = false;
                console.error('Error creating user:', error);
            }
        });
  }

  private updateUser() {
    this.loading = true;
    if (!this.id) {
        this.loading = true;
        return;
    }
    const user = this.form.value;
    user.id = this.id;
    delete user.password;
    delete user.passwordConfirm;
    this.usersService.updateUser(this.id, user).subscribe({
        next: (response: any) => {
            this.loading = false;
            this.router.navigate(['../..'], { relativeTo: this.route });
        },
        error: (error) => {
            this.loading = false;
            console.error('Error update user:', error);
        }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
