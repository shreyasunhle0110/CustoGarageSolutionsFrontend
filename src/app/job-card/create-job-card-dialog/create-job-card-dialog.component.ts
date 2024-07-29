// src/app/job-card/create-job-card-dialog/create-job-card-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobCardService } from '../../services/job-card.service';
import { JobCard } from '../../models/JobCard';
import imageCompression from 'browser-image-compression';

export interface JobCardDialogData {
  mode: 'create' | 'view';
  jobCard?: any; // Replace 'any' with your JobCard model
}

@Component({
  selector: 'app-create-job-card-dialog',
  templateUrl: './create-job-card-dialog.component.html',
  styleUrls: ['./create-job-card-dialog.component.css']
})
export class CreateJobCardDialogComponent implements OnInit {
  jobCardForm: FormGroup;
  mode: 'create' | 'view';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateJobCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobCardDialogData,
    private jobCardService: JobCardService,
  ) {
    this.mode = data.mode;
    this.jobCardForm = this.fb.group({
      customerName: [data.jobCard?.customerName || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]+$')
      ]],
      customerPhoneNo: [data.jobCard?.customerPhoneNo || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      customerAddress: [data.jobCard?.customerAddress || '', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ]],
      carMake: [data.jobCard?.carMake || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      carModel: [data.jobCard?.carModel || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      carMileage: [data.jobCard?.carMileage || '', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]],
      carVinNo: [data.jobCard?.carVinNo || '', [
        Validators.required,
        Validators.pattern('^[A-HJ-NPR-Z0-9]{17}$')
      ]],
      expectedDeliveryDate: [data.jobCard?.expectedDeliveryDate || '', [
        Validators.required,
        this.futureDateValidator
      ]],
      carRegistrationNo: [data.jobCard?.carRegistrationNo || '', [
        Validators.required,
        Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4,5}$')
      ]],
      workItems: this.fb.array([]),
      fileUploads: this.fb.array([])
    });

    if (data.jobCard?.workItems) {
      data.jobCard.workItems.forEach((item: any) => this.addWorkItem(item));
    }

    if (data.jobCard?.fileUploads) {
      data.jobCard.fileUploads.forEach((upload: any) => this.addFileUpload(upload));
    }
  }

  ngOnInit(): void { }

  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    if (inputDate <= today) {
      return { 'invalidDate': true };
    }
    return null;
  }

  get workItems(): FormArray {
    return this.jobCardForm.get('workItems') as FormArray;
  }

  get fileUploads(): FormArray {
    return this.jobCardForm.get('fileUploads') as FormArray;
  }

  addWorkItem(item: any = { workNeeded: '', workDescription: '' }): void {
    this.workItems.push(this.fb.group({
      workNeeded: [item.workNeeded, Validators.required],
      workDescription: [item.workDescription, Validators.required]
    }));
  }

  removeWorkItem(index: number): void {
    this.workItems.removeAt(index);
  }

  addFileUpload(upload: any = { type: '', files: [] }): void {
    this.fileUploads.push(this.fb.group({
      type: [upload.type, Validators.required],
      files: [upload.files, Validators.required]
    }));
  }

  removeFileUpload(index: number): void {
    this.fileUploads.removeAt(index);
  }

  async onSave(): Promise<void> {
    if (this.jobCardForm.valid) {
      const jobCardData = this.jobCardForm.value;

      // Compress photos
      for (const upload of jobCardData.fileUploads) {
        const compressedFiles = await Promise.all(upload.files.map((file: any) => this.compressImage(file)));
        upload.files = compressedFiles;
      }

      // Create object to pass to API
      const jobCard: JobCard = {
        customerName: jobCardData.customerName,
        customerPhoneNo: jobCardData.customerPhoneNo,
        customerAddress: jobCardData.customerAddress,
        carMake: jobCardData.carMake,
        carModel: jobCardData.carModel,
        carMileage: jobCardData.carMileage,
        carVinNo: jobCardData.carVinNo,
        carRegistrationNo: jobCardData.carRegistrationNo,
        expectedDeliveryDate: jobCardData.expectedDeliveryDate,
        workItems: jobCardData.workItems,
        fileUploads: jobCardData.fileUploads.map((upload: { type: any; files: any[]; }) => ({
          type: upload.type,
          files: upload.files.map(file => file.name) // Assuming you store file names
        }))
      };

      // Call the API to save the job card
      if (this.mode === 'create') {
        this.jobCardService.createJobCard(jobCard).subscribe(response => {
          this.dialogRef.close(response);
        });
      } else if (this.mode === 'view') {
        // Update logic if necessary
      }
    }
  }
  private async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isViewMode(): boolean {
    return this.mode === 'view';
  }
}

