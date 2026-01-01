import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  features = [
    {
      icon: 'verified_user',
      title: 'Verified Professionals',
      description: 'All our service providers undergo thorough background verification and skill assessment'
    },
    {
      icon: 'schedule',
      title: 'On-Time Service',
      description: 'We value your time. Our professionals arrive on schedule, guaranteed'
    },
    {
      icon: 'price_check',
      title: 'Transparent Pricing',
      description: 'No hidden charges. What you see is what you pay'
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you'
    },
    {
      icon: 'stars',
      title: 'Quality Assurance',
      description: 'We ensure every service meets our high-quality standards'
    },
    {
      icon: 'payment',
      title: 'Secure Payments',
      description: 'Multiple payment options with 100% secure transactions'
    }
  ];

  stats = [
    { count: '50,000+', label: 'Happy Customers' },
    { count: '1,000+', label: 'Verified Professionals' },
    { count: '100+', label: 'Services Offered' },
    { count: '25+', label: 'Cities Covered' }
  ];

  team = [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/200x200?text=RS',
      description: 'Visionary leader with 15+ years in service industry'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image: 'https://via.placeholder.com/200x200?text=PP',
      description: 'Expert in operations management and quality control'
    },
    {
      name: 'Amit Kumar',
      role: 'Technology Director',
      image: 'https://via.placeholder.com/200x200?text=AK',
      description: 'Tech innovator driving digital transformation'
    },
    {
      name: 'Sneha Reddy',
      role: 'Customer Success Lead',
      image: 'https://via.placeholder.com/200x200?text=SR',
      description: 'Passionate about delivering exceptional customer experience'
    }
  ];
}
