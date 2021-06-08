import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductsServices } from 'src/app/services/products.service';
import {catchError, map, startWith} from 'rxjs/operators';
import {AppDataState, DataStateEnum} from '../../state/product.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$?:Observable<AppDataState<Product[]>>;
  readonly DataStateEnum=DataStateEnum;

  constructor(private productsService: ProductsServices, private router:Router) { }

  ngOnInit(): void {
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
}
