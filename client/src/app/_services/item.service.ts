import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemDetails, ItemInterest } from '../_models/item.model'
import { catchError, tap, map } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs'; // convert some data to observables
import { Mail } from '../_models/mail.model';


//Below code is using for displaying the images from server folder
// https://stackoverflow.com/questions/39007243/cannot-open-local-file-chrome-not-allowed-to-load-local-resource
// 1) Open your terminal and type
// npm install -g http-server
// 2) Go to the root folder that you want to serve you files and type:
// http-server ./
// 3) Read the output of the terminal, something kinda http://localhost:8080 will appear.
// Everything on there will be allowed to be got. Example:


@Injectable({
  providedIn: 'root'

})
export class ItemService {

  private dataUrl: string = 'http://localhost:8000' // Node js server path
  private itemAvailable: boolean
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })

  };
  constructor(private http: HttpClient) { }

  // get all items
  // getAllUserItemHistory(itemdata: any): Observable<ItemDetails[]> {
  //   return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allUserItemHistory").pipe(
  //     catchError(this.handleError('item', itemdata)));
  // }

  getAllUserItemHistory(id: string): Observable<ItemDetails[]> {
    
    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allUserItemHistory/" + id, {}).pipe(
      catchError(this.handleError('item', {} as ItemDetails[])));
  }



  getAllHomeItems(itemdata: any): Observable<ItemDetails[]> {

    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allHomeItems");
  }


  getAllLogInUserHomeItems(id: string): Observable<ItemDetails[]> {
    
    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allLogInUserHomeItems/" + id, {}).pipe(
      catchError(this.handleError('item', {} as ItemDetails[])));
  }

  getAllUserItems(id: string): Observable<ItemDetails[]> {

    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allUserItems/" + id, {}).pipe(
      catchError(this.handleError('item', {} as ItemDetails[])));
  }

  // get all items
  getAllItems(itemdata: any): Observable<ItemDetails[]> {
    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allItems").pipe(
      catchError(this.handleError('item', itemdata)));
  }

  // // upload a file
  // uploadfiles(fileuploads: FileList, itemname: string): Observable<any> {
  //   // let formData=new FormData()
  //   const formData: FormData = new FormData();
  //   for (var i = 0; i < fileuploads.length; i++) {
  //     var file = fileuploads[i]
  //     // Add the file to the request.
  //      formData.append('uploads[]', file, file.name) //keep it same as it is on Node end
  //   }
  //   formData.append('itemname',itemname)

  //  formData.forEach(data=>console.log('form data for each ',data)

  //  )

  //   return this.http.post<any>(this.dataUrl, formData)
  //     .pipe(tap(data => console.log('data from upload service', data)),
  //       catchError(this.handleError('ride', {} as any)));
  // }

  // save a item
  addItem(fileuploads: FileList, itemdata: any): Observable<Item> {


    if (itemdata.isItem_Available == "")
      this.itemAvailable = false;
    else
      this.itemAvailable = itemdata.isItem_Available;

    const formData: FormData = new FormData();
    for (var i = 0; i < fileuploads.length; i++) {
      var file = fileuploads[i]
      // Add the file to the request.
      //formData.append('uploads[]', file, file.name) //keep it same as it is on Node end
      formData.append('item_image', file, file.name) //keep it same as it is on Node end
    }

    formData.append('item_name', itemdata.item_name);
    formData.append('item_number', "ITEM_" + Math.floor(1000 + Math.random() * 9000));
    formData.append('item_date', new Date().toLocaleTimeString("en-US"));
    formData.append('item_description', itemdata.item_description);
    formData.append('item_cost', itemdata.item_cost);
    formData.append('item_Location', itemdata.item_Location);
    formData.append('longitude', itemdata.longitude);
    formData.append('latitude', itemdata.latitude);
    formData.append('isItem_Approved', 'false');
    formData.append('isItem_Available', String(this.itemAvailable));
    formData.append('userId', localStorage.getItem("currentUser"));

    //formData.forEach(data=>console.log('form data for each ',data)
  //  debugger
    return this.http.post<any>(this.dataUrl + "/item/addItem", formData)
      .pipe(tap(data => console.log('data from upload service', data)),
        catchError(this.handleError('ride', {} as any)));

    // debugger
    // let item = {

    //   item_name: itemdata.item_name,
    //   item_number: "ITEM_" + Math.floor(1000 + Math.random() * 9000),
    //   item_date: new Date().toLocaleDateString("en-US"),
    //   item_description: itemdata.item_description,
    //   //item_image: itemdata.item_image,
    //   item_image: "assets/UCM_logo.png",
    //   item_cost: itemdata.item_cost,
    //   item_Location: itemdata.item_Location,
    //   isItem_Approved: false,
    //   isItem_Available: this.itemAvailable,
    //   userId: localStorage.getItem("currentUser")
    // }
    // debugger
    // return this.http.post<Item>(this.dataUrl + "/item/addItem", item)
    //   .pipe(tap(data => console.log('data from item save', data)),
    //     catchError(this.handleError('item', {} as Item)));
  }


  updateItem(_itemId: string, currentStatus: boolean): Observable<any> {
    if (currentStatus) {
      currentStatus = false;
    }
    else {
      currentStatus = true;
    }
    let item = {
      _id: _itemId,
      isItem_Approved: currentStatus
    }
    return this.http.put(this.dataUrl + "/item/updateItemStatus", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }

  updateAllItemStatus(currentStatus: boolean): Observable<any> {
    let item = {
      isItem_Approved: currentStatus
    }
//    debugger
    return this.http.put(this.dataUrl + "/item/updateAllItemStatus", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }



  updateItemAvailablity(_itemId: string, isItemSoldout: boolean): Observable<any> {
    if (isItemSoldout) {
      isItemSoldout = false;
    }
    else {
      isItemSoldout = true;
    }
    let item = {
      _id: _itemId,
      isItem_Available: isItemSoldout
    }
    return this.http.put(this.dataUrl + "/item/updateItemAvailablity", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }


  updateItemSoldOut(_itemId: string, isItemSoldout: boolean): Observable<any> {
    let item = {
      _id: _itemId,
      isItem_Available: isItemSoldout,
      item_updatedDate: new Date().toLocaleTimeString("en-US"),
      item_soldOutDate: Date.now()
    }
    debugger
    return this.http.put(this.dataUrl + "/item/updateItemAvailablity", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }



  getAllRecentSoldOutItems(id: string): Observable<ItemDetails[]> {

    return this.http.get<ItemDetails[]>(this.dataUrl + "/item/allRecentSoldOutItems/" + id, {}).pipe(
      catchError(this.handleError('item', {} as ItemDetails[])));
  }


  // Get the login details
  sendMail(mailHeader: any): Observable<Mail> {

    var mailContent = {
      from: mailHeader.from,
      to: mailHeader.to,
      subject: mailHeader.subject,
      text: mailHeader.text
    }
    return this.http.post<Mail>(this.dataUrl + "/mail/sendMail", mailContent)
      .pipe(tap(data => console.log('data from user save',data)),
        catchError(this.handleError('mail', {} as Mail)));
  }

  /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log('handleError catched this error ', error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateUserItemInterest(itemId: string, isUserInterested: boolean): Observable<any> {

    let itemItemInterest = {
      _id: itemId,
      isItemInterested: isUserInterested
    }
    return this.http.put(this.dataUrl + "/item/updateUserItemInterest", itemItemInterest)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }

  //   deleteUserItemInterest(id:string): Observable<any> {

  //     let itemItemInterest = {
  //     _id: id
  //   }
  //   debugger
  //   return this.http.delete(this.dataUrl + "/item/deleteUserItemInterest/"+ id)
  //     .pipe(
  //       catchError(this.handleError('item', {} as Item)));
  // }


  // update ride status
  deleteUserItemInterest(id: string): Observable<ItemInterest[]> {
    return this.http.get<ItemInterest[]>(this.dataUrl + "/item/deleteUserItemInterest/" + id, {}).pipe(
      catchError(this.handleError('ride', {} as ItemInterest[])));
  }
  addUserItemInterest(itemId: string, isUserInterested: boolean): Observable<any> {

    let itemItemInterest = {
      userId: localStorage.getItem('currentUser'),
      itemId: itemId,
      isItemInterested: isUserInterested
    }
    return this.http.post(this.dataUrl + "/item/addUserItemInterest", itemItemInterest)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }

}



