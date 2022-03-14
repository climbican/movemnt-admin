import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
    FormArray,
  Validators, ValidationErrors,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {RoutineService} from '../routines.service';
import {WorkoutService} from '../../workout/workout.service';
// toaster stuffs
import {ToasterConfig} from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
} from '@nebular/theme';
import {CategoriesService} from '../../../provider/categories.service';

export class Workouts {
  workoutId: number;
  sets: number;
  repsSet: number;
  interval: number;
}

@Component({
  selector: 'ngx-add-task',
  templateUrl: './add-routine.component.html',
  styleUrls: ['./add-routine.component.scss'],
})
export class AddRoutineComponent implements OnInit {
  // IMAGE PARAMS
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('fileInputTwo', {static: false}) fileInputTwo: ElementRef;
  fileData: File = null;
  previewUrl: any = null;
  routineForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  exerciseTypeSelect: any;
  workoutList: Workouts[];
  workoutTypesSelect: any;
  useRepetitionsTitle: string;
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
              private routinesService: RoutineService,
              private workoutsService: WorkoutService,
              private toasterService: NbToastrService,
              private categories: CategoriesService) {
    this.useRepetitionsTitle = 'Reps';
    this.loading = false;
    this.submitted = false;
    this.formErrors = '';
    this.workoutsService.selectListWorkouts(0).subscribe( d => { this.workoutList = d.data; });
    this.categories.getWorkoutTypeCategories('routine').subscribe(w => this.workoutTypesSelect = w.data);
  }

  ngOnInit() {
    this.previewUrl = 'assets/images/no-image-300x300.png';
    this.routineForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(2000)]],
      routineGoal: [0, [Validators.required]],
      experienceLevel: ['', [Validators.required]],
      timeToComplete: ['', [Validators.required]],
      workouts: new FormArray([
        this.formBuilder.group({
          workoutId: ['', [Validators.required]],
          sets: ['', [Validators.required]],
          useRepetitions: ['r', [Validators.required]],
          repsOrTime: ['', [Validators.required]],
          interval: ['', [Validators.required]],
          hasSuperset: [''],
          supersetParentIndex: [null],
        }),
      ]),
      imageFile: [''],
    });
  }

  /**
   * function to get the control values
   */
  get f() {
    return this.routineForm.controls;
  }

  /**
   * format the workout values in an array format
   */
  get g() {
    const retValue = this.f.workouts as FormArray;
    return retValue;
  }
  // SUBMIT ADD TASK
  submitAddRoutine() {
    this.submitted = true;
    this.loading = true;
    if (this.routineForm.invalid) {
      if (this.routineForm.invalid) {
        Object.keys(this.routineForm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.routineForm.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              // console.info('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
              this.showToast('warning', 'Form Field Error', '*field: ' + key + ' Issue: ' + keyError);
            });
          }
        });
      }
      // need a popup to inform the user what the errors are
      return;
    }
    this.routinesService.add(this.routineForm.value)
      .pipe(first())
      .subscribe(res => {
          if (res.status === 200) {
            this.routineForm.reset();
            this.router.navigate(['pages/routines/list']);
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
  /**
   * @desc add workout field set
   */
  addWorkoutFieldSet(index) {
    let supersetParentIndex = 2000;
    if (index < 50){
      supersetParentIndex = index;

      this.g.insert((index + 1),
          this.formBuilder.group({
            workoutId: ['', [Validators.required]],
            sets: ['', [Validators.required]],
            useRepetitions: ['r', [Validators.required]],
            repsOrTime: ['', [Validators.required]],
            interval: ['', [Validators.required]],
            hasSuperset: [''],
            supersetParentIndex: [index],
          }));
    } else {
      this.g.push(this.formBuilder.group({
        workoutId: ['', [Validators.required]],
        sets: ['', [Validators.required]],
        useRepetitions: [1, [Validators.required]],
        repsOrTime: ['', [Validators.required]],
        interval: ['', [Validators.required]],
        hasSuperset: [''],
        supersetParentIndex: [null],
      }));
    }
  }

  isSuperSet(index) {
     return this.g.value[index].supersetParentIndex !== null;
  }

  /**
   * @desc remove workout field set....
   */
  removeWorkoutFieldSet(e) {
    if (this.g.length > 1) {
      if (this.g.value[e].hasSuperset) {
        this.g.removeAt(e);
      }
      this.g.removeAt(e);
    }
    else {
      alert('routine requires at least one workout');
    }
  }

  addRemoveSuperSet(index, checkedValue) {
    if (checkedValue.target.checked) {
      this.addWorkoutFieldSet(index);
    }
    else {
      this.removeWorkoutFieldSet(index + 1);
    }
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.routineForm.reset();
    this.g.clear();
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
        this.routineForm.patchValue({
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
    };
    const titleContent = title ? `. ${title}` : '';

    this.index += 1;
    this.toasterService.show(
        body,
        `${titleContent}`,
        config);
  }
  // change the time reps field to the appropriate title to indicate seconds or reps
  useRepetitionsTitleChange(index, checkedValue) {
    if (checkedValue) {
      this.useRepetitionsTitle = 'Time';
    }
    else {
      this.useRepetitionsTitle = 'Reps';
    }
  }
}
