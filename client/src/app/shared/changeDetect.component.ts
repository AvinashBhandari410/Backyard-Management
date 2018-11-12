// import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// @Component({
//   selector: 'change-detect',
//   template: '{{_data.duration}}  {{_data.distance}}',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ChangeDetectComponent implements OnInit{
//   @Input() changeValue:Observable<any>;
//   _data;
// constructor(private cd: ChangeDetectorRef){

// }

// ngOnInit() {
//     this.changeValue.subscribe(data => {
//         this._data = data;
//         console.log('cld')
//         this.cd.markForCheck();
//     });
// }
// }