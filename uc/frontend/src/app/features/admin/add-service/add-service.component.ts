import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '@core/services/service.service';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models';

@Component({
  standalone: false,
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  serviceForm: FormGroup;
  categories: Category[] = [];
  loading = false;
  imagePreviewUrl: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0],
      duration: [30, [Validators.required, Validators.min(15)]],
      image: ['', [Validators.required]],
      features: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
      }
    });
  }

  onImageUrlChange(): void {
    const imageUrl = this.serviceForm.get('image')?.value;
    if (imageUrl && imageUrl.startsWith('http')) {
      this.imagePreviewUrl = imageUrl;
      this.selectedFile = null;
      this.selectedFileName = '';
    } else {
      this.imagePreviewUrl = '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Clear the URL field since we're using file upload
      this.serviceForm.patchValue({ image: file.name });
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300/6e45e2/ffffff?text=Invalid+Image+URL';
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.loading = true;

      // If file is selected, upload it first
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        this.serviceService.uploadImage(formData).subscribe({
          next: (response: any) => {
            // Use the uploaded image URL
            const serviceData = {
              ...this.serviceForm.value,
              image: response.imageUrl,
              features: this.serviceForm.value.features.split(',').map((f: string) => f.trim())
            };
            this.createService(serviceData);
          },
          error: (error) => {
            alert('Error uploading image: ' + error.message);
            this.loading = false;
          }
        });
      } else {
        // Use the provided URL
        const serviceData = {
          ...this.serviceForm.value,
          features: this.serviceForm.value.features.split(',').map((f: string) => f.trim())
        };
        this.createService(serviceData);
      }
    }
  }

  private createService(serviceData: any): void {
    this.serviceService.createService(serviceData).subscribe({
      next: () => {
        alert('Service added successfully!');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        alert('Error adding service: ' + error.message);
        this.loading = false;
      }
    });
  }
}
