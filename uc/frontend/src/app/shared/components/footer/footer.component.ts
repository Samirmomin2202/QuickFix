import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>QuickFix</h3>
          <p>Your trusted service marketplace</p>
        </div>

        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/careers">Careers</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>For Customers</h4>
          <ul>
            <li><a routerLink="/services">Browse Services</a></li>
            <li><a routerLink="/help">Help Center</a></li>
            <li><a routerLink="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>For Partners</h4>
          <ul>
            <li><a routerLink="/partner/join">Become a Professional</a></li>
            <li><a routerLink="/partner/resources">Partner Resources</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 QuickFix. Educational Project. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: white;
      padding: 40px 20px 20px;
      margin-top: 60px;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .footer-section {
      h3, h4 {
        margin-bottom: 15px;
        color: #6e45e2;
      }

      p {
        color: #bdc3c7;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 8px;

          a {
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s;

            &:hover {
              color: white;
            }
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #34495e;

      p {
        margin: 0;
        color: #95a5a6;
        font-size: 14px;
      }
    }
  `]
})
export class FooterComponent { }
