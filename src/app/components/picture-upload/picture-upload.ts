import { Component } from '@angular/core';
import { PictureUploadFormelement } from '../picture-upload-formelement/picture-upload-formelement';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';

@Component({
  selector: 'app-picture-upload',
  imports: [ReactiveFormsModule, PictureUploadFormelement, DynamicSkeleton, ValidationFeedback],
  templateUrl: './picture-upload.html',
  styleUrl: './picture-upload.scss',
})
export class PictureUpload extends BaseReactiveForm {}
