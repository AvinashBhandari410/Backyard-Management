import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user.model'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs'; // convert some data to observables

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dataUrl: string = 'http://localhost:8000' // Node js server path
  constructor(private http: HttpClient) { }


  // get all Login
  getLogin(userdata: any): Observable<User[]> {
    return this.http.get<User[]>(this.dataUrl + "/user/login", {}).pipe(
      catchError(this.handleError('login', userdata)));
  }


  // get all items
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.dataUrl + "/user/allUsers");
    //catchError(this.handleError('user')));
  }

  // Get the login details
  login(userdata: any): Observable<User> {

    let user = {
      email_address: userdata.email_address,
      password: userdata.password
    }

    return this.http.post<User>(this.dataUrl + "/user/login", user)
      .pipe(tap(data => console.log('data from user save', data)),
        catchError(this.handleError('user', {} as User)));
  }

  // save a ride
  signUp(userdata: any): Observable<User> {

    let user = {
      full_name: userdata.full_name,
      email_address: userdata.email_address,
      password: userdata.password,
      phone_number: userdata.phone_number,
      address: userdata.address,
      created_date: new Date().toLocaleDateString("en-US")
    }

    return this.http.post<User>(this.dataUrl + "/user/register", user)
      .pipe(tap(data => console.log('data from user save', data)),
        catchError(this.handleError('ride', {} as User)));
  }

  updateStatus(_userId: string, isUserActive: boolean): Observable<any> {
    debugger
    if (isUserActive) {
      isUserActive = false;
    }
    else {
      isUserActive = true;
    }
    let user = {
      _id: _userId,
      is_useractive: isUserActive
    }
    return this.http.put(this.dataUrl + "/user/updateUserStatus", user)
      .pipe(
        catchError(this.handleError('user', {} as User)));
  }

  updateAllUserStatus(currentStatus: boolean): Observable<any> {
    let item = {
      is_useractive: currentStatus
    }
//    debugger
    return this.http.put(this.dataUrl + "/user/updateAllUserStatus", item)
      .pipe(
        catchError(this.handleError('item', {} as User)));
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
      console.error('handleError catched this error ', error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  
}
