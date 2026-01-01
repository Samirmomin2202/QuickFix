import { Component, OnInit } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  editingCategory: Category | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  toggleStatus(category: Category): void {
    if (!category._id) return;
    
    const newStatus = !category.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (confirm(`Are you sure you want to ${action} "${category.name}"?`)) {
      this.categoryService.updateCategory(category._id, { isActive: newStatus }).subscribe({
        next: () => {
          category.isActive = newStatus;
          alert(`Category "${category.name}" has been ${newStatus ? 'activated' : 'deactivated'}`);
        },
        error: (error) => {
          alert('Error updating category: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  editCategory(category: Category): void {
    const newName = prompt('Enter new category name:', category.name);
    if (newName && newName.trim() && newName !== category.name) {
      if (!category._id) return;
      
      this.categoryService.updateCategory(category._id, { name: newName.trim() }).subscribe({
        next: (response: any) => {
          category.name = response.data.name;
          category.slug = response.data.slug;
          alert('Category updated successfully!');
        },
        error: (error) => {
          alert('Error updating category: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (!category._id) return;
    
    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      this.categoryService.deleteCategory(category._id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c._id !== category._id);
          alert('Category deleted successfully!');
        },
        error: (error) => {
          alert('Error deleting category: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  onImageSelected(event: any, category: Category): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);

      this.categoryService.uploadImage(formData).subscribe({
        next: (response: any) => {
          if (!category._id) return;
          
          // Update category with new image
          this.categoryService.updateCategory(category._id, { icon: response.imageUrl }).subscribe({
            next: (updateResponse: any) => {
              category.icon = updateResponse.data.icon;
              alert('Category image updated successfully!');
            },
            error: (error) => {
              alert('Error updating category image: ' + (error.error?.message || error.message));
            }
          });
        },
        error: (error) => {
          alert('Error uploading image: ' + (error.error?.message || error.message));
        }
      });
    }
  }
}
