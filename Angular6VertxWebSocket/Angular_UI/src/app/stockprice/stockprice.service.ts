import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { StockPriceBean } from './StockPriceBean';
import * as Rx from "rxjs/Rx";


@Injectable({
    providedIn: 'root'
  })
  export class StockPriceService {

    constructor(private http: HttpClient) { }   

    stockPriceBeanArray : Observable<StockPriceBean[]>;
    private subject: Rx.Subject<MessageEvent>;
 
    //function
    getStockPrice() : Observable<StockPriceBean[]>{

        let url = "http://localhost:8080/stockprice";
         
        return this.http.get<Array<StockPriceBean>>(url, {responseType : 'json'});
    
     }


      getMessages(): Rx.Subject<MessageEvent> {

      let url = "ws://localhost:8080/eventbus";
      let ws = new WebSocket(url);
  
      let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      });
      let observer = {
        next: (data: Object) => {

          console.log("data="+data);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
          }
        }
      };
      return Rx.Subject.create(observer, observable);
    }
  }  