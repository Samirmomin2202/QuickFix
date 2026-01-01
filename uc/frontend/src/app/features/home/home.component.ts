import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@core/services/category.service';
import { ServiceService } from '@core/services/service.service';
import { Category, Service } from '@core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredServices: Service[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private serviceService: ServiceService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300/6e45e2/ffffff?text=Image+Not+Available';
  }

  loadData(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Error loading categories:', error)
    });

    this.serviceService.getServices({ featured: true }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.featuredServices = response.data.slice(0, 6);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
      }
    });
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/services'], { queryParams: { category: categoryId } });
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }
}
