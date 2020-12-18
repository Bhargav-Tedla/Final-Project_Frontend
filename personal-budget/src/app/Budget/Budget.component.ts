import { Component, NgZone, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'pb-Budget',
  templateUrl: './Budget.component.html',
  styleUrls: ['./Budget.component.scss']
})
export class BudgetComponent implements OnInit {

  budget:number;
  maxbudget:number;
  title:string;
  showMsg: boolean = false;


  constructor(private _dataService:DataService,private toastr: ToastrService,private router:Router,private ngZone:NgZone) { }

  ngOnInit(): void {
  }

  duplicatebudgettype(){
    this.toastr.error('Budget type already exists. Enter a new name','Error');
  }

  missingDetails(){
    this.toastr.warning('Please enter all the fields','Warning');
  }

  randomColorGen(){
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    console.log(randomColor)
    return randomColor;
  }

  sendExpense(){
    let record = {};

    record['budget'] = this.budget;
    record['maxbudget'] = this.maxbudget;
    record['title'] = this.title.charAt(0).toUpperCase()+this.title.slice(1);
    record['color'] = this.randomColorGen();
    record['username'] = this._dataService.loggedInUserName;

    if(!this.budget || !this.maxbudget || !this.title){
      this.missingDetails();
      return;
    }
    else{
    this._dataService.addBudgetdata(record)
      .subscribe(data =>{
        console.log(data);
        this.budget = null;
        this.maxbudget = null;
        this.title = "";

        this.showMsg = true;
        this.ngZone.run(() => {
          this.router.navigate(['/homepage']);
        });
      },
      err => {
        console.log("Same title already exists");
        this.duplicatebudgettype();
        this.title = "";
      })
  }
}

}
