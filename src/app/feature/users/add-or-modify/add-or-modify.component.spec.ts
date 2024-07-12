import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyComponent } from './add-or-modify.component';

describe('AddOrModifyComponent', () => {
  let component: AddOrModifyComponent;
  let fixture: ComponentFixture<AddOrModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddOrModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
