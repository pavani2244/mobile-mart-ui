import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mobile-mart';

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {      
    
  }

}
