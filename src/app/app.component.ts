import {Component, OnInit} from '@angular/core';
import { Car } from './domain/car';
import { CarService} from './services/carservice';
import { Response } from './domain/jsonResponse';
import  { Page } from './domain/page';
import { Responses } from './domain/responses';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [CarService]
})
export class AppComponent implements OnInit{

    private page: number = 0;
    private myCars: Array<any>;
    private pages: Array<number>;
       
    car: Car = new PrimeCar();    
    cars: Car[];
    cols: any[];
    totalRecords: number;
    loading: boolean;

    constructor(private carService: CarService) { }
    
    ngOnInit() {
       this.getAllMyCars();

        this.cols = [
            { field: 'vin', header: 'Vin' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];
    }

    getAllMyCars() {
        this.carService.getMyCars(this.page).subscribe(
            data=> {
              //  console.log(data);
              this.myCars = data['content'];
              this.pages = new Array(data['totalPages']);
            },
            (error)=> {
                console.log(error.error.message);
            }
        );
    }

    setPage(i, event:any) {
        event.preventDefault();
        this.page = i;
        this.getAllMyCars();
    }


    patientFilterModel: Page = {PageSize: 0, RowNumber: 0, OrderColumn: '', OrderBy: ''};
    patientModel : Responses = {content: [], total: 0};
    paitientListing
    
    loadPatientListing(event) {
        console.log(event);
        this.patientFilterModel.PageSize = event.rows;
        this.patientFilterModel.RowNumber = event.first/20;
        this.patientFilterModel.OrderColumn = event.sortField;

        if (event.sortOrder == 1) {
            this.patientFilterModel.OrderBy = "asc";
        }
        else {
            this.patientFilterModel.OrderBy = "desc";
        }
        this.carService.getAllPageCars(this.patientFilterModel).subscribe(
            data => {
                console.log(data);
                this.patientModel.content = data;
                this.totalRecords = data.length;
            },
            error => {
                this.loading = false;
            }
        );
    }
}

export class PrimeCar implements Car {
    
    constructor(public vin?, public year?, public brand?, public color?) {}
}
