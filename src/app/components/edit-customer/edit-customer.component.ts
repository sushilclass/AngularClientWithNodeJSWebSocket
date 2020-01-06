import { Component, OnInit, NgZone } from '@angular/core';
import { CustomerService } from '../../shared/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  CustomersList:any = [];
  updateCustomerForm: FormGroup

  constructor(
    private actRoute: ActivatedRoute,
    public customerService: CustomerService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.customerService.GetCustomer(id).subscribe((data)=>{
      this.updateCustomerForm = this.fb.group({
        FirstName: [data.FirstName],
        LastName: [data.LastName]
      })
    })

// ws
    this.customerService._GetByIdCustomer(id).subscribe(data=>{
      this.updateCustomerForm = this.fb.group({
        FirstName: [data.name],
        LastName: [data.price]
      })
    })
  }

  ngOnInit() {
    this.updateForm()
  }

  updateForm(){
    this.updateCustomerForm = this.fb.group({
      FirstName:[''],
      LastName:['']
    })
  }

  submitForm(){
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.customerService.UpdateCustomer(id, this.updateCustomerForm.value).subscribe(res =>{     
      this.ngZone.run(()=>this.router.navigateByUrl('/customer-list'))
    })
  }

  _updateProduct(){
    var id = this.actRoute.snapshot.paramMap.get('id');
    let form = this.updateCustomerForm.value;
    let product = {
      name: form.FirstName,
      price: form.LastName
    };
    this.customerService._UpdateCustomer(id, product).subscribe(data=>{
      console.log("Customer updated");
      this.ngZone.run(()=>this.router.navigateByUrl('/customer-list'))
    })
  }

}
