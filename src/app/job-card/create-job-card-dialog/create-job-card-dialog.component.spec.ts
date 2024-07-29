import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobCardDialogComponent } from './create-job-card-dialog.component';

describe('CreateJobCardDialogComponent', () => {
  let component: CreateJobCardDialogComponent;
  let fixture: ComponentFixture<CreateJobCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateJobCardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
