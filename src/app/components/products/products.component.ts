import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductsServices } from 'src/app/services/products.service';
import {catchError, map, startWith} from 'rxjs/operators';
import {ActionEvent, AppDataState, DataStateEnum, ProductActionsTypes} from '../../state/product.state';
import {Router} from '@angular/router';
import {EventDriverService} from '../../state/event.driver.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$?:Observable<AppDataState<Product[]>>;
  readonly DataStateEnum=DataStateEnum;

  constructor(private productsService: ProductsServices, private router:Router, private eventDrivenService:EventDriverService) { }

  ngOnInit(): void {
    this.eventDrivenService.sourceEventSubjectObervable.subscribe((actionEvent:ActionEvent)=>{
      this.onActionEvent(actionEvent);
    });
  }

  onGetAllProducts(){
    console.log("start....");
    this.products$=this.productsService.getAllProducts().pipe(
      map((data)=> {
        console.log(data);
          return({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onGetSelectedProducts() {
    this.products$=this.productsService.getSelectedProducts().pipe(
      map((data)=> {
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onGetAvailableProducts() {
    this.products$=this.productsService.getAvailableProducts().pipe(
      map((data)=> {
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onSearche(dataForm: any) {
    this.products$=this.productsService.searchProducts(dataForm.keyword).pipe(
      map((data)=> {
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onSelect(p: Product) {
    this.productsService.selectProducts(p)
      .subscribe(data=>{
        p.selected=data.selected;
      })
  }

  onDelete(p: Product) {
    let v=confirm("Êtes vous sûre?");
    if(v==true)
    this.productsService.deleteProduct(p)
      .subscribe(data=>{
        this.onGetAllProducts();
      })
  }

  onNewProducts() {
    this.router.navigateByUrl("/newProduct")
  }

  onEdit(p:Product) {
    this.router.navigateByUrl("/editProduct/"+p.id)
  }

  onActionEvent($event: ActionEvent) {
    console.log($event);
    switch ($event.type){
      case ProductActionsTypes.GET_ALL_PRODUCTS:this.onGetAllProducts();break;
      case ProductActionsTypes.GET_SELECTED_PRODUCTS:this.onGetSelectedProducts();break;
      case ProductActionsTypes.GET_AVAILABLE_PRODUCTS:this.onGetAvailableProducts();break;
      case ProductActionsTypes.SEARCH_PRODUCTS:this.onSearche($event.payload);break;
      case ProductActionsTypes.NEW_PRODUCTS:this.onNewProducts();break;
      case ProductActionsTypes.SELECT_PRODUCT:this.onSelect($event.payload);break;
      case ProductActionsTypes.DELETE_PRODUCT:this.onDelete($event.payload);break;
      case ProductActionsTypes.EDIT_PRODUCT:this.onEdit($event.payload);break;

    }
  }
}
