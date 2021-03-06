import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations'
import { DataService } from "../data.service";
import { Subscription } from 'rxjs/Subscription';

class Film{
  constructor( public name:string, public duration:number){}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations:[
    trigger('films', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        
        query(':enter', stagger('300ms',[
          animate('.6s ease-in', keyframes([
            style({ opacity:  0, transform: 'translateY(-75%)', offset:   0}), 
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3}), 
            style({ opacity:  1, transform:    'translateY(0)', offset:   1}), 
          ]))
        ]), {optional: true}),
        
        query(':leave', stagger('300ms',[
          animate('.6s ease-in', keyframes([
            style({ opacity:  1, transform: 'translateY(0)', offset:   0}), 
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3}), 
            style({ opacity:  0, transform:    'translateY(-75%)', offset:   1}), 
          ]))
        ]), {optional: true}),
      ])
    ]),
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  
  itemCount: number;
  btnText: string = "Add filme";
  filmNameText: string = null
  filmDurationText: number = null
  totalDuration: number = 0
  films: Film[]
  sub: Subscription
  
  
  constructor(private mData : DataService) { }
  
  ngOnInit() {
    this.sub = this.mData.films.subscribe(res => {
      this.films = res;
      this.itemCount = this.films.length
    });

    // this.mData.changeFilm(this.films)
    //this.mData.addFilm(this.films)
    //this.itemCount = this.films.length;
  }   

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  private resetInputs(){
    this.filmNameText = null
    this.filmDurationText = null
  }
  
  addItem() {
    if (this.filmNameText != null && this.filmDurationText != null) {
      let film = new Film(this.filmNameText,this.filmDurationText)
      // this.films.push(film)
      // this.itemCount = this.films.length
      // this.mData.changeFilm(this.films)
      this.mData.addFilm(film)
      this.totalDuration += film.duration;
      this.mData.totalDuration  = this.totalDuration
      this.resetInputs()
      console.log(this.mData.totalDuration)
      
    }
  }
  
  removeItem(i){
    this.totalDuration -= this.films[i].duration;
    this.mData.totalDuration  = this.totalDuration
    this.films.splice(i,1)
    this.itemCount = this.films.length
    // this.mData.changeFilm(this.films)
    this.mData.addFilm(this.films)
  }
  
}
