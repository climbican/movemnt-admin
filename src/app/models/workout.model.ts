export class WorkoutModel {
  id: string; // will be encrypted string at a later time...
  title: string;
  subTitle: string;
  mediaLink: string;
  internalLink: string;
  trainerCreditText: string;
  ownerLink: string;
  mainMuscleGroupId: string;
  secondaryMuscleGroupName: string;
  recommendedInterval: number;
  excerciseType: string;
  equipmentType: string;
  mechanics: string;
  forceType: string;
  experienceLevel: string;
  overviewTitle: string;
  overviewText: string;
  instructionTitle: string;
  instructionText: string;
  tipsTitle: string;
  tipsText: string;
  createdOn: string;
}



/**
 array('form_field_name' => 'title', 'db_name' => 'title', 'is_required'=> true),
 array('form_field_name' => 'subTitle', 'db_name' => 'sub_title', 'is_required'=> false),
 array('form_field_name' => 'mediaLink', 'db_name' => 'mediaLink', 'is_required'=> false),
 array('form_field_name' => 'internalLink', 'db_name' => 'internal_link', 'is_required'=> false),
 array('form_field_name' => 'trainerCreditText', 'db_name' => 'trainer_credit_text', 'is_required'=> false),
 array('form_field_name' => 'ownerLink','db_name' => 'owner_link', 'is_required'=> false),
 array('form_field_name' => 'mainMuscleGroupId', 'db_name' => 'main_muscle_group_id', 'is_required'=> true),
 array('form_field_name' => 'secondaryMuscleGroupId', 'db_name' => 'secondary_muscle_group', 'is_required'=> false),
 array('form_field_name' => 'recommendedInterval', 'db_name' => 'recommended_interval', 'is_required'=> false),
 array('form_field_name' => 'exerciseType', 'db_name' => 'exercise_type', 'is_required'=> false),
 array('form_field_name' => 'equipmentType', 'db_name' => 'equipment_type', 'is_required'=> false),
 array('form_field_name' => 'mechanics', 'db_name' => 'mechanics', 'is_required'=> false),
 array('form_field_name' => 'forceType', 'db_name' => 'force_type', 'is_required'=> false),
 array('form_field_name' => 'experienceLevel', 'db_name' => 'experience_level', 'is_required'=> true),
 array('form_field_name' => 'overviewTitle', 'db_name' => 'overview_title', 'is_required'=> false),
 array('form_field_name' => 'overviewText', 'db_name' => 'overview_text', 'is_required'=> false),
 array('form_field_name' => 'instructionTitle', 'db_name' => 'instruction_title', 'is_required'=> false),
 array('form_field_name' => 'instructionText', 'db_name' => 'instruction_text', 'is_required'=> false),
 array('form_field_name' => 'tipsTitle', 'db_name' => 'tips_title', 'is_required'=> false),
 array('form_field_name' => 'tipsText', 'db_name' => 'tips_text', 'is_required'=> false)
 **/
