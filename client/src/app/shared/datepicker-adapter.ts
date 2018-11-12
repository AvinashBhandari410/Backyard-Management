import { NgbDateAdapter,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {  Injectable } from '@angular/core';
/**
* NgbDateAdapter implementation that allows using native javascript date as a user date model.
 */
@Injectable()
export class NgbDateAmericanFormatAdapter extends NgbDateAdapter<string> {
    /**
     * Converts native date to a NgbDateStruct
     */
    fromModel(date: string): NgbDateStruct {

        if(!date)
        return null
        let dateArr=date.split("/")

        return {
            day: parseInt(dateArr[1]),
            month: parseInt(dateArr[0]),
            year: parseInt(dateArr[2])
        };
    };

    toModel(date: NgbDateStruct): string {
        return date.month+"/"+date.day+"/"+date.year
    }
}
