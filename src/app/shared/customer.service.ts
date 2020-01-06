import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from './customer';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // BaseUrl
  baseurl = 'http://localhost:3000';
  context = {
          "route": "products",
          "action": ""
        };
  _webSocket:WebSocketSubject<any> = webSocket({url: 'ws://localhost:4000/' + this.context.route});

  constructor(private http: HttpClient) {
    if(this._webSocket)
    {
      console.log("connected");       
    }
   }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  // Error Handling
  errorHandl(error){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      // Get client-side error
      errorMessage = error.error.message;
    }else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;      
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // POST
  CreateCustomer(data): Observable<Customer>{
    return this.http.post<Customer>(this.baseurl + '/customers/',JSON.stringify(data), this.httpOptions)
    .pipe(retry(1), catchError(this.errorHandl))
  }

  // GET
  GetCustomer(_id):Observable<Customer>{
    return this.http.get<Customer>(this.baseurl + '/customers/' + _id)
    .pipe(retry(1), catchError(this.errorHandl))
  }

  // GET
  GetCustomers():Observable<Customer>{
    return this.http.get<Customer>(this.baseurl + '/customers/')
    .pipe(retry(1), catchError(this.errorHandl))
  }

  // PUT
  UpdateCustomer(_id, data):Observable<Customer>{
    return this.http.put<Customer>(this.baseurl + '/customers/' + _id, JSON.stringify(data), this.httpOptions)
    .pipe(retry(1), catchError(this.errorHandl))
  }

  // DELETE
  DeleteCustomer(_id){
    return this.http.delete<Customer>(this.baseurl + '/customers/' + _id, this.httpOptions)
    .pipe(retry(1), catchError(this.errorHandl))
  }


  // GET Customers using WebSocket
  _GetCustomers(): Observable<any>{    
    
       this.context.action = "getAll";
       this._webSocket.next(this.context);    
      return this._webSocket.asObservable();
  }

  // POST
  _CreateCustomer(product): Observable<any>{
    this.context.action = "create";
    this.context['product'] = product;
    this._webSocket.next(this.context);
    return this._webSocket.asObservable();
  }
  
  // DETELE
  _DeleteCustomer(id): Observable<any>{
    this.context.action = "delete";
    this.context['id'] = id;
    this._webSocket.next(this.context);
    return this._webSocket.asObservable();
  }

  // GET BY Id
  _GetByIdCustomer(id): Observable<any>{
    this.context.action = "get";
    this.context['id'] = id;
    this._webSocket.next(this.context);
    return this._webSocket.asObservable();
  }

// UPdate
_UpdateCustomer(id, product): Observable<any>{
    this.context.action = "update";
    this.context['id'] = id;
    this.context['product'] = product;
    this._webSocket.next(this.context);
    return this._webSocket.asObservable();
}
}
