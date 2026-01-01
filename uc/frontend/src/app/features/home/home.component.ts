import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@core/services/category.service';
import { ServiceService } from '@core/services/service.service';
import { Category, Service } from '@core/models';

interface QuickCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface FeaturedCard {
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

interface TrendingStory {
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredServices: Service[] = [];
  loading = true;

  quickCategories: QuickCategory[] = [
    { id: 'home-decor', name: 'Home & Decor', icon: 'chair', color: '#4A90E2' },
    { id: 'renovation', name: 'Renovation', icon: 'construction', color: '#E94B3C' },
    { id: 'appliance', name: 'Appliance', icon: 'kitchen', color: '#F5A623' },
    { id: 'pest-control', name: 'Pest Control', icon: 'pest_control', color: '#50C878' },
    { id: 'moving-storage', name: 'Moving & Storage', icon: 'local_shipping', color: '#9B59B6' },
    { id: 'ac-repair', name: 'AC Repair', icon: 'ac_unit', color: '#3498DB' },
    { id: 'plumbing-electrical', name: 'Plumbing & Electrical', icon: 'plumbing', color: '#E67E22' },
    { id: 'painting', name: 'Painting', icon: 'format_paint', color: '#1ABC9C' }
  ];

  featuredCards: FeaturedCard[] = [
    {
      title: 'Full House Cleaning',
      description: 'At 1999 per month',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      bgColor: '#4A69FF'
    },
    {
      title: 'Plumbings',
      description: 'Starts at ₹199',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop',
      bgColor: '#4A69FF'
    },
    {
      title: 'Carpentry',
      description: 'Starts at ₹149',
      image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=300&h=200&fit=crop',
      bgColor: '#4A69FF'
    }
  ];

  // Placeholder images for different service categories
  private servicePlaceholders = {
    salon: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=140&fit=crop'
    ],
    cleaning: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=140&fit=crop'
    ],
    appliance: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=140&fit=crop'
    ],
    renovation: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1585859196594-2d9e76c5c93b?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=140&fit=crop'
    ],
    plumbing: [
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=140&fit=crop',
      'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=200&h=140&fit=crop'
    ]
  };

  mostBookedServices: Service[] = [];
  salonServices: Service[] = [];
  cleaningServices: Service[] = [];
  applianceServices: Service[] = [];
  renovationServices: Service[] = [];

  trendingStories: TrendingStory[] = [
    {
      title: 'Your Dream Home Makeover Within Your Budget',
      excerpt: 'Transform your space with our expert design tips',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=400&fit=crop'
    },
    {
      title: 'Home Makeover Package',
      excerpt: 'Complete home transformation services',
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=300&h=400&fit=crop'
    },
    {
      title: 'Must Have Tips About Hiring Home Renovators',
      excerpt: 'Expert advice for your next project',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&h=400&fit=crop'
    },
    {
      title: 'A Reverence Puja You Should Perform',
      excerpt: 'Traditional ceremonies for your home',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=400&fit=crop'
    }
  ];

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

  on3DImageError(event: any): void {
    // Fallback 3D images if primary fails
    const fallbackImages = [
      'https://cdni.iconscout.com/illustration/premium/thumb/man-working-on-laptop-9602383-7765493.png',
      'https://cdni.iconscout.com/illustration/premium/thumb/professional-technician-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--mechanic-worker-service-pack-people-illustrations-4404599.png',
      'https://img.icons8.com/3d-fluency/400/000000/worker-male.png',
      'https://via.placeholder.com/350x350/6c5ce7/ffffff?text=Professional+Service'
    ];
    
    const currentIndex = fallbackImages.indexOf(event.target.src);
    if (currentIndex < fallbackImages.length - 1) {
      event.target.src = fallbackImages[currentIndex + 1];
    } else {
      event.target.style.display = 'none';
    }
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
          const services = response.data;
          this.featuredServices = services.slice(0, 6);
          
          // Distribute services across different sections with placeholder images
          this.mostBookedServices = this.assignPlaceholderImages(services.slice(0, 6), 'plumbing');
          this.salonServices = this.assignPlaceholderImages(services.slice(6, 12), 'salon');
          this.cleaningServices = this.assignPlaceholderImages(services.slice(12, 18), 'cleaning');
          this.applianceServices = this.assignPlaceholderImages(services.slice(18, 24), 'appliance');
          this.renovationServices = this.assignPlaceholderImages(services.slice(24, 30), 'renovation');
          
          // If we don't have enough services, create mock ones with placeholder images
          if (this.mostBookedServices.length === 0) {
            this.mostBookedServices = this.createMockServices('Most Booked', 6, 'plumbing');
          }
          if (this.salonServices.length === 0) {
            this.salonServices = this.createMockServices('Salon', 6, 'salon');
          }
          if (this.cleaningServices.length === 0) {
            this.cleaningServices = this.createMockServices('Cleaning', 6, 'cleaning');
          }
          if (this.applianceServices.length === 0) {
            this.applianceServices = this.createMockServices('Appliance', 6, 'appliance');
          }
          if (this.renovationServices.length === 0) {
            this.renovationServices = this.createMockServices('Renovation', 6, 'renovation');
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        // Load mock services with images on error
        this.mostBookedServices = this.createMockServices('Most Booked', 6, 'plumbing');
        this.salonServices = this.createMockServices('Salon', 6, 'salon');
        this.cleaningServices = this.createMockServices('Cleaning', 6, 'cleaning');
        this.applianceServices = this.createMockServices('Appliance', 6, 'appliance');
        this.renovationServices = this.createMockServices('Renovation', 6, 'renovation');
        this.loading = false;
      }
    });
  }

  private assignPlaceholderImages(services: Service[], category: keyof typeof this.servicePlaceholders): Service[] {
    return services.map((service, index) => {
      if (!service.image || service.image.includes('placeholder')) {
        const placeholders = this.servicePlaceholders[category];
        service.image = placeholders[index % placeholders.length];
      }
      return service;
    });
  }

  private createMockServices(prefix: string, count: number, category: keyof typeof this.servicePlaceholders): Service[] {
    const placeholders = this.servicePlaceholders[category];
    const services: Service[] = [];
    
    const categoryNames: { [key: string]: string[] } = {
      salon: ['Hair Cut', 'Hair Spa', 'Facial', 'Makeup', 'Manicure', 'Pedicure'],
      cleaning: ['House Cleaning', 'Deep Cleaning', 'Carpet Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Pest Control'],
      appliance: ['AC Repair', 'Washing Machine', 'Refrigerator', 'Microwave', 'TV Repair', 'Chimney Service'],
      renovation: ['Home Renovation', 'Kitchen Remodel', 'Bathroom Remodel', 'Painting', 'Flooring', 'Carpentry'],
      plumbing: ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'AC Service', 'Appliance Repair']
    };

    const names = categoryNames[category] || [`${prefix} Service`];

    for (let i = 0; i < count; i++) {
      services.push({
        _id: `mock-${category}-${i}`,
        name: names[i % names.length],
        description: `Professional ${names[i % names.length].toLowerCase()} service`,
        price: 299 + (i * 100),
        image: placeholders[i % placeholders.length],
        category: category,
        rating: 4.5,
        reviewCount: 120 + i * 10,
        duration: 60 + (i * 15),
        provider: 'QuickFix',
        featured: true
      } as any);
    }
    
    return services;
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/services'], { queryParams: { category: categoryId } });
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }
}
