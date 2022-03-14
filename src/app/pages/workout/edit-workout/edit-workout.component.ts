import {Component, OnInit, KeyValueDiffer} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators, ValidationErrors,
} from '@angular/forms';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
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
  selector: 'ngx-edit-workouts',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.scss'],
})
export class EditWorkoutComponent implements OnInit {
  editWorkoutForm: FormGroup;
  muscleGroups: any;
  workoutTypesSelect: any;
  equipmentList: any;
  loading: boolean;
  submitted: boolean;
  workoutId: number;
  public Editor = ClassicEditor;
  // IMAGE PARAMS
  fileData: File = null;
  fileDataTwo: File = null;
  previewUrl: any = null;
  imageOneId: string = null;
  imageTwoId: string = null;
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
              private loadingScreen: LoadingScreenService,
              private workoutService: WorkoutService,
              private crud: CrudService,
              private toasterService: NbToastrService,
              private categories: CategoriesService) {
    this.loading = false;
    this.submitted = false;
  }

  ngOnInit() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.previewUrlTwo = 'assets/images/no-image-300x300.png';
    this.categories.getWorkoutTypeCategories('workout').subscribe(w => this.workoutTypesSelect = w.data);
    this.crud.fetch(0, 'muscleGroup', 'list')
        .subscribe(c => this.muscleGroups = c.data);
    this.crud.fetch(0, 'equipment', 'list')
        .subscribe(e => {
          this.equipmentList = e.data;
        });
    this.editWorkoutForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      subTitle: ['', [Validators.minLength(7), Validators.maxLength(75)]],
      mediaLink: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      imageFile: [''],
      imageOneId: [''],
      internalLink: [''],
      imageFileTwo: [''],
      imageTwoId: [''],
      mediaType: ['image'],
      trainerCreditText: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      ownerLink: ['', [Validators.minLength(10), Validators.maxLength(155)]],
      mainMuscleGroupId: ['', [Validators.required]],
      secondaryMuscleGroupId: [''],
      recommendedInterval: ['', Validators.max(200)],
      exerciseType: [''],
      equipmentList: [''],
      mechanics: [''],
      forceType: ['', [Validators.required]],
      experienceLevel: ['', [Validators.required]],
      overviewTitle: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      overviewText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
      instructionTitle: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      instructionText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
      tipsTitle: ['', [Validators.minLength(5), Validators.maxLength(50)]],
      tipsText: ['', [Validators.minLength(10), Validators.maxLength(2000)]],
      workoutId: [''],
    });
    // get task info and patch form
    this.route.paramMap.subscribe( params => {
      this.workoutId = parseInt(params.get('id'), 0);
      this.editWorkoutForm.controls.workoutId.patchValue(this.workoutId);
      // mm
      this.workoutService.fetch(this.workoutId)
        .subscribe( (ci) => {
          if (parseInt(ci.status, 0) === 200) {
            // NEEDED TO CONVERT JSON TO ARRAY HERE...
            ci.workoutDetail.secondaryMuscleGroupId = JSON.parse(ci.workoutDetail.secondaryMuscleGroupId);
            // THIIS IS THE SET EQUIPMENT LIST PARAM BEFORE UPLOADING TO SERVER.
            ci.workoutDetail.equipmentList = JSON.parse(ci.workoutDetail.equipmentList);
            this.editWorkoutForm.patchValue(ci.workoutDetail);
            this.editWorkoutForm.controls.recommendedInterval.patchValue(ci.workoutDetail.recommendedInterval.toString());
            this.editWorkoutForm.controls.exerciseType.patchValue(ci.workoutDetail.exerciseType);
            this.editWorkoutForm.controls.experienceLevel.patchValue(ci.workoutDetail.experienceLevel);
            let j = 0;
            for (let i = 0; i < ci.workoutDetail.images.length; i++) {
              if (ci.workoutDetail.images[i].internalLink === 1) {
                if (j === 0) {
                  this.previewUrl = ci.workoutDetail.images[i].previewImage;
                  this.imageOneId = ci.workoutDetail.images[i].id;
                  this.editWorkoutForm.controls.imageOneId.patchValue(ci.workoutDetail.images[i].id);
                } else {
                  this.previewUrlTwo = ci.workoutDetail.images[i].previewImage;
                  this.imageTwoId = ci.workoutDetail.images[i].id;
                  this.editWorkoutForm.controls.imageTwoId.patchValue(ci.workoutDetail.images[i].id);
                }
                j++;
              } else {
                this.editWorkoutForm.controls.mediaLink.patchValue(ci.workoutDetail.images[i].mediaLink);
                this.editWorkoutForm.controls.mediaType.patchValue(ci.workoutDetail.images[i].mediaType);
              }
            }
          } else {
            // console.log('oops there seems to be an issue');
          }
        });
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
          this.editWorkoutForm.patchValue({
            imageFile: reader.result,
          });
        } else {
          this.editWorkoutForm.patchValue({
            imageFileTwo: reader.result,
          });
        }
      };
    }
  }
  // this is a bit messy but it should work
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
    return this.editWorkoutForm.controls;
  }

  /**
   * @desc remove an image
   *
   * TODO: ADD CONFIRM MESSAGE
   * TODO: // NEED TO GIVE FEEDBACK MESSAGE FOR REMOVED IMAGE
   */
  removeImage(imageId, whichOne) {
    if (window.confirm('Are you sure you want to remove the image?')) {
      this.loadingScreen.startLoading();
      this.crud.remove(imageId, 'workout', 'removeImage')
          .subscribe( res => {
            if (res.status === 200) {
              if (whichOne === 1) {
                this.imageOneId = null;
                this.editWorkoutForm.controls.imageOneId.patchValue('');
                this.previewUrl = 'assets/images/no-image-300x300.png';
                // success message
              } else {
                this.imageTwoId = null;
                this.editWorkoutForm.controls.imageTwoId.patchValue('');
                this.previewUrlTwo = 'assets/images/no-image-300x300.png';
                // ooops message
              }
            } else {
              // change this and confirm to dialog windows
              alert('There was an issue removing the image');
            }
            this.loadingScreen.stopLoading();
          });
    }
  }
  /**
   * @desc submit the form
   *
   *
   *
   */
  submitEditWorkout() {
    this.loadingScreen.startLoading();
    this.submitted = true;
    this.loading = true;
    if (this.editWorkoutForm.invalid) {
      this.loadingScreen.stopLoading();
      if (this.editWorkoutForm.invalid) {
        this.loadingScreen.stopLoading();
        Object.keys(this.editWorkoutForm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.editWorkoutForm.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.info('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
      }
      // need a popup to inform the user what the errors are
      return;
    }
    this.workoutService.update(this.editWorkoutForm.value)
      .pipe(first())
      .subscribe(res => {
          if (res.status === 200) {
            this.editWorkoutForm.reset();
            this.loadingScreen.stopLoading();
            this.router.navigate(['pages/workouts/list']);
          } else if (res.status === 401) {
            this.router.navigateByUrl('/login');
          } else {
            this.loadingScreen.stopLoading();
          }
        },
        error => {
          this.loadingScreen.stopLoading();
          this.loading = false;
        });
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
