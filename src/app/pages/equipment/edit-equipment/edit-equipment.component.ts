import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {CrudService} from '../../../provider/crud.service';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {Router, ActivatedRoute} from '@angular/router';
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
  selector: 'ngx-edit-equipment',
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.scss'],
})
export class EditEquipmentComponent implements OnInit {
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  fileData: any;
  previewUrl: any;
  equipmentForm: FormGroup;
  equipmentId: number;
  loading: boolean;
  submitted: boolean;
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

  constructor(private crud: CrudService,
              private loadingScreen: LoadingScreenService,
              private formBuilder: FormBuilder,
              private route: Router,
              private activatedRoute: ActivatedRoute,
              private toasterService: NbToastrService) {
    this.loading = false;
    this.submitted = false;
  }

  ngOnInit() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.equipmentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
      category: ['', [Validators.minLength(3), Validators.maxLength(35)]],
      mediaLink: [''],
      description: [''],
      equipmentId: [''],
      imageFile: [''],
    });
    // set the form values including the equipment ID
    this.activatedRoute.paramMap.subscribe(params => {
      this.equipmentId = parseInt(params.get('id'), 0);
      this.crud.fetch(this.equipmentId, 'equipment', 'fetchSingle')
          .subscribe( data => {
            this.equipmentForm.patchValue(data.data);
          });
      this.equipmentForm.controls.equipmentId.patchValue(this.equipmentId);
    });
  }
  // description
  get f () {
    return this.equipmentForm.controls;
  }
  submitUpdateEquipmentEquipment() {
    this.loadingScreen.startLoading();
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
    this.crud.update(this.equipmentForm.value, 'equipment', 'update')
        .pipe(first())
        .subscribe( res => {
          if (res.status === 200) {
            this.equipmentForm.reset();
            this.loadingScreen.stopLoading();
            this.route.navigate(['pages/equipment/list']);
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
}
