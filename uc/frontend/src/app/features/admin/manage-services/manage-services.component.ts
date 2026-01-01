import { Component, OnInit } from '@angular/core';
import { ServiceService } from '@core/services/service.service';
import { CategoryService } from '@core/services/category.service';
import { Service, Category } from '@core/models';

@Component({
  standalone: false,
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.scss']
})
export class ManageServicesComponent implements OnInit {
  services: Service[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        this.services = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
      }
    });
  }

  getCategoryName(category: string | Category): string {
    if (typeof category === 'string') {
      const cat = this.categories.find(c => c._id === category);
      return cat ? cat.name : 'Unknown';
    }
    return category.name;
  }

  onImageSelected(event: any, service: Service): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);

      this.serviceService.uploadImage(formData).subscribe({
        next: (response: any) => {
          if (!service._id) return;
          
          // Update service with new image
          this.serviceService.updateService(service._id, { image: response.imageUrl }).subscribe({
            next: (updateResponse: any) => {
              service.image = updateResponse.data.image;
              alert('Service image updated successfully!');
            },
            error: (error) => {
              alert('Error updating service image: ' + (error.error?.message || error.message));
            }
          });
        },
        error: (error) => {
          alert('Error uploading image: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  editService(service: Service): void {
    const newName = prompt('Enter new service name:', service.name);
    if (newName && newName.trim() && newName !== service.name) {
      if (!service._id) return;
      
      this.serviceService.updateService(service._id, { name: newName.trim() }).subscribe({
        next: (response: any) => {
          service.name = response.data.name;
          alert('Service updated successfully!');
        },
        error: (error) => {
          alert('Error updating service: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  deleteService(service: Service): void {
    if (!service._id) return;
    
    if (confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      this.serviceService.deleteService(service._id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s._id !== service._id);
          alert('Service deleted successfully!');
        },
        error: (error) => {
          alert('Error deleting service: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  toggleFeatured(service: Service): void {
    if (!service._id) return;
    
    const newStatus = !service.isFeatured;
    
    this.serviceService.updateService(service._id, { isFeatured: newStatus }).subscribe({
      next: () => {
        service.isFeatured = newStatus;
        alert(`Service "${service.name}" is now ${newStatus ? 'featured' : 'not featured'}`);
      },
      error: (error) => {
        alert('Error updating service: ' + (error.error?.message || error.message));
      }
    });
  }
}
