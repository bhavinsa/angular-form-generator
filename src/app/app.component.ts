import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { environment } from '../environments/environment';
enum INPUTS {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  formName: string;
  tsCode: string;
  myForm: FormGroup;
  arr: FormArray;
  inputTypesArr: any[];
  preHtmlCode: string;
  postHtmlCode: string;
  mainHtmlcode = '';
  fullHtmlCode: string;
  fullHtmlCodePre: string;
  preTsCode: string;
  postTsCode: string;
  mainTsCode = '';
  fullTsCode: string;
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    console.log('environment' + JSON.stringify(environment));
    this.inputTypesArr = [INPUTS.TEXT, INPUTS.TEXTAREA, INPUTS.SELECT]

    this.myForm = this.fb.group({
      formName: ['', Validators.required],
      arr: this.fb.array([this.createItem()])
    });
  }

  createItem() {
    return this.fb.group({
      labelName: ['', Validators.required],
      inputName: ['', Validators.required],
      inputType: ['', Validators.required]
    });
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  onSubmit() {
    console.log(this.myForm.value);
    if (this.myForm.value) {

      this.preHtmlCode = ` <form class="" (ngSubmit)="on${this.myForm.value.formName}()" #${this.myForm.value.formName}="ngForm">`;

      this.preTsCode = `
          import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
          constructor(private formBuilder: FormBuilder){}

          ${this.myForm.value.formName}: FormGroup;
          this.${this.myForm.value.formName} = this.formBuilder.group({
      `;

      this.myForm.value.arr.map(data => {
        console.log(JSON.stringify(data));
        switch (data.inputType) {
          case INPUTS.TEXT:
            this.mainHtmlcode += `
            <mat-form-field class="example-full-width">
            <input matInput placeholder="${data.labelName}" value="">
            </mat-form-field>
            `;
            this.mainTsCode += `     ${data.inputName} : [''],`;
            break;
          case INPUTS.TEXTAREA:
            this.mainHtmlcode += `
            <mat-form-field class="example-full-width">
            <textarea matInput placeholder="${data.labelName}"></textarea>
            </mat-form-field>
            `;
            this.mainTsCode += `     ${data.inputName} : [''],`;
            break;
          case INPUTS.SELECT:
            this.mainHtmlcode += `
            <mat-form-field>
              <mat-label>${data.labelName}</mat-label>
              <mat-select>
                <mat-option>
                ${data.labelName}
                </mat-option>
              </mat-select>
            </mat-form-field>

              `;
            this.mainTsCode += `${data.inputName} : [''],`;
            break;
          default:
            break;
        }

      });

      this.postHtmlCode = `<p>
          <button type="submit" md-raised-button>Submit</button>
      </p>
    </form>`;

      this.postTsCode = `
        });

      on${this.myForm.value.formName}(){

      }
      `;
    }

    this.fullHtmlCode = this.preHtmlCode + this.mainHtmlcode + this.postHtmlCode;
    // this.fullHtmlCodePre = this.sanitizer.bypassSecurityTrustHtml(this.fullHtmlCode);

    this.fullTsCode = this.preTsCode + this.mainTsCode + this.postTsCode;
  }


  removeItem(index) {
    const control = this.myForm.controls.arr as FormArray;
    control.removeAt(index);
  }

  get checkError() { return this.myForm.controls; }



}
