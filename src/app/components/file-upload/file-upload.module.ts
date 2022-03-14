import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FileUploadComponent} from './file-upload.component';
import { ThemeModule } from '../../@theme/theme.module';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbPopoverModule,
    NbSearchModule,
    NbAlertModule,
    NbCheckboxModule,
} from '@nebular/theme';

@NgModule({
    imports: [
        ThemeModule,
        NbActionsModule,
        NbButtonModule,
        NbCardModule,
        NbIconModule,
        NbPopoverModule,
        NbSearchModule,
        NbAlertModule,
        NbCheckboxModule,
        FormsModule,
    ],
    declarations: [FileUploadComponent],
})
export class FileUploadModule {}
