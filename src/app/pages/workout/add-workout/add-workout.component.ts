import {
  Component,
  OnInit,
  ViewChild,
  ElementRef, Input,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators, ValidationErrors,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize, first, map, timeout} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {WorkoutService} from '../workout.service';
import {CrudService} from '../../../provider/crud.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

import {CategoriesService} from '../../../provider/categories.service';

@Component({
  selector: 'ngx-add-workout',
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.scss'],
})
export class AddWorkoutComponent implements OnInit {
  workoutForm: FormGroup;
  muscleGroups: any;
  workoutTypesSelect: any;
  equipmentList: any;
  loading: boolean;
  submitted: boolean;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('fileInputTwo', {static: false}) fileInputTwo: ElementRef;
  public Editor = ClassicEditor;
  // IMAGE PARAMS
  fileData: File = null;
  fileDataTwo: File = null;
  previewUrl: any = null;
  previewUrlTwo: any = null;
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
              private route: ActivatedRoute,
              private router: Router,
              private workoutService: WorkoutService,
              private crud: CrudService,
              private toasterService: NbToastrService,
              private categories: CategoriesService) { // Workout Types to be removed
    this.loading = false;
    this.submitted = false;
    // populate the muscle group list
    // join the three requests into one to keep it organized
    forkJoin({
      c: this.categories.getWorkoutTypeCategories('workout'),
      mg: this.crud.fetch(0, 'muscleGroup', 'list'),
      e: this.crud.fetch(0, 'equipment', 'list'),
    })
        .pipe(
            timeout(6000),
            map( (combined) => {
              this.workoutTypesSelect = combined.c.data;
              this.muscleGroups = combined.mg.data;
              this.equipmentList = combined.e.data;
            }),
            catchError( error => {
              return of({results: null});
            }),
            finalize( () => {
              // this was the only way to get it to set properly
              setTimeout(() => {
                this.workoutForm.controls.exerciseType.patchValue(1);
                this.workoutForm.controls.mainMuscleGroupId.patchValue(8);
              }, 1000);
            }),
        ).subscribe();
  }

  ngOnInit() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.previewUrlTwo = 'assets/images/no-image-300x300.png';
    this.workoutForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      subTitle: ['', [Validators.minLength(7), Validators.maxLength(75)]],
      imageFile: [''],
      imageFileTwo: [''],
      mediaLink: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      mediaType: ['image', [Validators.required]],
      trainerCreditText: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      ownerLink: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      mainMuscleGroupId: ['', [Validators.required]],
      secondaryMuscleGroupId: [''],
      recommendedInterval: ['90', Validators.max(200)],
      exerciseType: [1],
      equipmentList: [''],
      mechanics: ['isolation'],
      forceType: ['push', [Validators.required]],
      experienceLevel: ['beginner'],
      overviewTitle: ['', [Validators.minLength(5), Validators.maxLength(55)]],
      overviewText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
      instructionTitle: ['', [Validators.minLength(5), Validators.maxLength(55)]],
      instructionText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
      tipsTitle: ['', [Validators.minLength(5), Validators.maxLength(55)]],
      tipsText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  onFileChange(event, whichOne: number) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      // The next two lines set the value and open the preview
      if (whichOne === 1) {
        this.fileData = <File>event.target.files[0];
      } else {
        this.fileDataTwo = <File>event.target.files[0];
      }
      this.preview(whichOne);
      reader.onload = () => {
        if (whichOne ===  1) {
          this.workoutForm.patchValue({
            imageFile: reader.result,
          });
        } else {
          this.workoutForm.patchValue({
            imageFileTwo: reader.result,
          });
        }
      };
    }
  }
  /*
   * @desc preview the image, not quit optimal but it works well
   */
  preview(whichOne: number) {
    // Show preview
    const mimeType = whichOne === 1 ? this.fileData.type : this.fileDataTwo.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    whichOne === 1 ? reader.readAsDataURL(this.fileData) : reader.readAsDataURL(this.fileDataTwo);
    reader.onload = (_event) => {
      if ( whichOne === 1 ) {
        this.previewUrl = reader.result;
      } else { this.previewUrlTwo = reader.result; }
    };
  }

  get f() {
    return this.workoutForm.controls;
  }
  // SUBMIT ADD TASK
  submitAddWorkout() {
    this.submitted = true;
    this.loading = true;
    if (this.workoutForm.invalid) {
      Object.keys(this.workoutForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.workoutForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            this.showToast('warning', 'Form Field Error', 'field: ' +  key + ' Issue: ' + keyError);
          });
        }
      });
      // need a popup to inform the user what the errors are
      return;
    }
    this.workoutService.add(this.workoutForm.value)
      .pipe(first())
      .subscribe(res => {
          if (res.status === 200) {
            this.workoutForm.reset();
            this.router.navigate(['pages/workouts/list']);
          }
          else if (res.status === 401) {
            this.router.navigateByUrl('/login');
          } else {
          }
        },
        error => {
          this.loading = false;
          this.showToast('danger', 'Problem on server side', 'General Error');
        });
  }

  removeImage(imageNumber: number) {
    if (imageNumber === 1) {
      this.previewUrl = 'assets/images/no-image-300x300.png';
      this.fileData = null;
      this.fileInput.nativeElement.value = '';
    } else {
      this.previewUrlTwo = 'assets/images/no-image-300x300.png';
      this.fileDataTwo = null;
      this.fileInputTwo.nativeElement.value = '';
    }
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

