import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, ItemDetails } from '../_models/item.model'
import { catchError, tap, map } from 'rxjs/operators'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs'; // convert some data to observables

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private dataUrl: string = 'http://localhost:8000' // Node js server path
  private itemAvailable: boolean
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { }

   // get all items
   getAllItems(itemdata: any): Observable<ItemDetails[]> {
    return this.http.get<ItemDetails[]>(this.dataUrl  + "/item/allItems").pipe(
      catchError(this.handleError('item',itemdata)));
  }

  getAllHomeItems(itemdata: any): Observable<ItemDetails[]> {
    debugger
    return this.http.get<ItemDetails[]>(this.dataUrl  + "/item/allHomeItems");
  }


  getAllUserItems(itemdata: any): Observable<ItemDetails[]> {
    return this.http.get<ItemDetails[]>(this.dataUrl  + "/item/allItems").pipe(
      catchError(this.handleError('item',itemdata)));
  }
  // getAllUserItems(itemdata: any): Observable<ItemDetails[]> {
  //   return this.http.get(this.dataUrl  + "/item/allItems")
  //   .pipe(map((res: Response)=> <any>res.json()))
  //   //catchError(this.handleError('item',itemdata));
  // }
//   getAllUserItems(userItemData: any): Observable<ItemDetails[]> {
//     debugger
//     let existingUserID=userItemData;
//     let item = {
//       userId: existingUserID
//     }
//     debugger
//     console.log(this.dataUrl  + "/item/allUserItems", item);
//    return this.http.get<ItemDetails[]>(this.dataUrl  + "/item/allUserItems", item.userId)
//    .pipe(map(res => res.json().filter(<IUser>(x) => x.id > 2).
//      catchError(this.handleError('item',userItemData))));
//  }



 
//  getAllUserItems(userItemData: any): Observable<ItemDetails[]> {
//   debugger
//   let item = {
//           userId: userItemData
//         }
//   const url = this.dataUrl  + "/item/allUserItems/" + item.userId;
//   return this.http.get(url, this.httpOptions).pipe(
//     tap(this.extractData),
//     catchError(this.handleError('item',userItemData)));
// }

 private extractData(res: Response) {
   debugger
  let body = res;
  return body || { };
}

  // updateBook(updateData): Observable<any> {
  //   return this.http.put(this.dataUrl  + "/item/updateItemStatus", updateData)
  //     .pipe(
  //       catchError(this.handleError('item',updateData)));
  // }

  // // save a item
  // updateItem(_itemId:string,currentStatus:boolean): Observable<Item> {

  //   let item = {
  //     _id: _itemId,
  //     isItem_Approved: currentStatus
  //   }
  //   debugger
  //       return this.http.post<Item>(this.dataUrl + "/item/updateItemStatus", item)
  //     .pipe(tap(data => console.log('data from item save', data)),
  //       catchError(this.handleError('item', {} as Item)));
  // }

  updateItem(_itemId:string,currentStatus:boolean): Observable<any> {
    if(currentStatus)
    {
      currentStatus=false;
    }
    else
    {
      currentStatus= true;
    }
      let item = {
      _id: _itemId,
      isItem_Approved: currentStatus
    }
    return this.http.put(this.dataUrl + "/item/updateItemStatus", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }


  updateItemAvailablity(_itemId:string,isItemSoldout:boolean): Observable<any> {
    if(isItemSoldout)
    {
      isItemSoldout=false;
    }
    else
    {
      isItemSoldout= true;
    }
    debugger
      let item = {
      _id: _itemId,
      isItem_Available: isItemSoldout
    }
    return this.http.put(this.dataUrl + "/item/updateItemAvailablity", item)
      .pipe(
        catchError(this.handleError('item', {} as Item)));
  }
  // save a item
  addItem(itemdata: any): Observable<Item> {

    if(itemdata.isItem_Available=="")
    this.itemAvailable= false;
    else
    this.itemAvailable= itemdata.isItem_Available;
    debugger
    let item = {

      item_name: itemdata.item_name,
      item_number: "ITEM_" + Math.floor(1000 + Math.random() * 9000),
      item_date: new Date().toLocaleDateString("en-US"),
      item_description: itemdata.item_description,
      //item_image: itemdata.item_image,
      item_image: "assets/UCM_logo.png",
      item_cost: itemdata.item_cost,
      item_Location: itemdata.item_Location,
      isItem_Approved: false,
      isItem_Available: this.itemAvailable,
      userId: localStorage.getItem("currentUser")
    }
    debugger
    return this.http.post<Item>(this.dataUrl + "/item/addItem", item)
      .pipe(tap(data => console.log('data from item save', data)),
        catchError(this.handleError('item', {} as Item)));
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
    console.error('handleError catched this error ',error); // log to console instead

    // TODO: better job of transforming error for user consumption
    // this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}



