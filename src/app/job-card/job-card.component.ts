import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateJobCardDialogComponent, JobCardDialogData } from './create-job-card-dialog/create-job-card-dialog.component';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent implements OnInit {
  jobCards: any[] = []; // Replace with actual type/interface for job cards
  displayedColumns: string[] = ['carReceivedDate', 'carMake', 'carModel', 'customerName', 'customerPhone', 'currentStatus', 'expectedDeliveryDate', 'actions'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    // Initialize job cards data (replace with actual data retrieval)
    this.jobCards = [
      { carReceivedDate: '2024-07-12', carMake: 'Toyota', carModel: 'Camry', customerName: 'John Doe', customerPhone: '123-456-7890', currentStatus: 'In Progress', expectedDeliveryDate: '2024-07-15' },
      { carReceivedDate: '2024-07-10', carMake: 'Honda', carModel: 'Accord', customerName: 'Jane Smith', customerPhone: '987-654-3210', currentStatus: 'Completed', expectedDeliveryDate: '2024-07-13' }
      // Add more sample data as needed
    ];
  }

  openCreateJobCardDialog(): void {
    const dialogRef = this.dialog.open(CreateJobCardDialogComponent, {
      data: { mode: 'create' } as JobCardDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, e.g., save to the backend
        console.log('Job card created:', result);
      }
    });
  }

  viewJobCard(jobCard: any): void {
    // Implement logic to view job card details
    console.log('View Job Card:', jobCard);
  }

  deleteJobCard(jobCard: any): void {
    // Implement logic to delete job card
    console.log('Delete Job Card:', jobCard);
  }
}
