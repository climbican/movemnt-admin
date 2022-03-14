import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {CrudService} from '../../../provider/crud.service';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {first} from 'rxjs/operators';
// toaster stuffs
import {ToasterConfig} from 'angular2-toaster';
import {BodyOutputType} from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
} from '@nebular/theme';

@Component({
  selector: 'ngx-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss'],
})
export class AddEquipmentComponent implements OnInit {
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  loading: boolean;
  submitted: boolean;
  equipmentForm: FormGroup;
  fileData: any;
  previewUrl: any;
  // toaster vars
  formErrors: any;
  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 12000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'primary';
  // title and content
  title = '';
  content = ``;
  // types of status styles
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  constructor(private formBuilder: FormBuilder,
              private route: Router,
              private loadingScreen: LoadingScreenService,
              private crud: CrudService,
              private toasterService: NbToastrService) {
    this.loading = false;
    this.submitted = false;
  }

  ngOnInit() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.equipmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
      category: ['', [Validators.minLength(3), Validators.maxLength(25)]],
      mediaLink: [''],
      description: [''],
      imageFile: [''],
    });
  }
  /**
   * @desc fetch form values for validation and that kind of junk
   */
  get f() {
    return this.equipmentForm.controls;
  }

  /**
   * @desc Submit form
   */
  submitAddNewEquipment() {
    this.submitted = true;
    this.loading = true;

    if (this.equipmentForm.invalid) {
      this.loadingScreen.stopLoading();
      if (this.equipmentForm.invalid) {
        Object.keys(this.equipmentForm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.equipmentForm.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors.forEach(keyError => {
              this.showToast('warning', 'Form Field Error', 'field: ' +  key + ' Issue: ' + keyError);
            }));
          }
        });
        return;
      }
    }
    this.crud.add(this.equipmentForm.value, 'equipment', 'add')
        .pipe(first())
        .subscribe( res => {
          if (res.status === 200) {
            this.equipmentForm.reset();
            this.loadingScreen.stopLoading();
            this.route.navigate(['pages/equipment/list']);
          }
          else if (res.status === 401) {
            this.route.navigateByUrl('/login');
          }
          else {
            this.loadingScreen.stopLoading();
          }
        }),
        error => {
          this.loadingScreen.stopLoading();
          this.loading = false;
        };
  }

  /**
   * @desc toaster service function
   * @param type
   * @param title
   * @param body
   */
  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    const titleContent = title ? `. ${title}` : '';

    this.index += 1;
    this.toasterService.show(
        body,
        `${titleContent}`,
        config);
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      // The next two lines set the value and open the preview
      this.fileData = <File>event.target.files[0];
      this.preview();
      reader.onload = () => {
        this.equipmentForm.patchValue({
          imageFile: reader.result,
        });
      };
    }
  }
  /*
   * @desc preview the image, not quit optimal but it works well
   */
  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  removeImage() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.fileData = null;
    this.fileInput.nativeElement.value = '';
  }
}
