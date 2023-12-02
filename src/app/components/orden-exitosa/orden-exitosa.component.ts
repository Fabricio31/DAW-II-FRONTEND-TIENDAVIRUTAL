import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router  } from '@angular/router';

@Component({
  selector: 'app-orden-exitosa',
  templateUrl: './orden-exitosa.component.html',
  styleUrls: ['./orden-exitosa.component.css']
})
export class OrdenExitosaComponent implements OnInit {

  userEmail: string = '';
  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userEmail = params.get('email') || '';
    });
   
  }

  redirectToOrderHistory() {
    this.router.navigate(['/order-history']);
  }

}
