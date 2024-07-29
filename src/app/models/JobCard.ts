export interface JobCard {
  id?: number;
  carReceivedDate?: string;
  carMake: string;
  carModel: string;
  customerName: string;
  customerAddress: string;
  customerPhoneNo: string;
  carRegistrationNo: string;
  carMileage: number;
  carVinNo: string;
  jobNumber?: string;
  expectedDeliveryDate: string;
  workItems: WorkItem[];
  fileUploads: FileUpload[];
}

export interface WorkItem {
  workNeeded: string;
  workDescription: string;
}

export interface FileUpload {
  type: string;
  files: File[];
}
