import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '@core/services/service.service';
import { CategoryService } from '@core/services/category.service';
import { Service, Category } from '@core/models';

@Component({
  standalone: false,
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  categories: Category[] = [];
  loading = true;
  selectedCategory: string = 'all';
  searchTerm: string = '';

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Check for category query parameter
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.loadServices();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || response as any;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadServices(): void {
    this.loading = true;
    const params: any = {};
    
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      params.category = this.selectedCategory;
    }
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.serviceService.getServices(params).subscribe({
      next: (response) => {
        this.services = response.data || response as any;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.loadServices();
  }

  onSearch(): void {
    this.loadServices();
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-service.jpg';
  }
}
