import { FormControl } from '@angular/forms';

export interface ValidationControlList {
    items: Array<ValidationControlItem>;
}

export interface ValidationControlItem {
    frmCtrl: FormControl;
    section: string;
    field: string;
    filter: string;
    checkValid: boolean;
}
