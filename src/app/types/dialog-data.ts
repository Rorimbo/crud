import { User } from './user';

export interface DialogData {
  title: string;
  clientData?: User;
  onSaveClick: any;
}
