# Booking Flow Testing Guide

## Overview
The Urban Company Clone now has complete booking functionality for both **Users** and **Service Providers**.

---

## Demo Credentials

### Admin Account
- **Email:** admin@quickfix.com
- **Password:** Admin@123
- **Access:** Admin Dashboard, Add Services, View All Bookings

### User Account
- **Email:** user@test.com
- **Password:** User@123
- **Access:** Browse Services, Create Bookings, View My Bookings

### Service Provider Account
- **Email:** provider@test.com
- **Password:** Provider@123
- **Access:** Provider Dashboard, Manage Assigned Bookings

---

## Testing the Booking Flow

### For Users (Customer Perspective)

#### Step 1: Login as User
1. Navigate to http://localhost:4200/auth/login
2. Enter credentials: `user@test.com` / `User@123`
3. Click "Login"

#### Step 2: Browse Services
1. Go to Home page (http://localhost:4200/)
2. View featured services in the "Most Popular Services" section
3. Click on any service card to view details

#### Step 3: Book a Service
1. On the service detail page, you'll see:
   - Service image with discount badge
   - Price, rating, duration
   - Service description and features
   - Booking form on the right

2. Fill in the booking form:
   - **Date:** Select future date
   - **Time:** Select preferred time
   - **Street Address:** e.g., "123 Main Street"
   - **City:** e.g., "Mumbai"
   - **State:** e.g., "Maharashtra"
   - **Pincode:** 6-digit code (e.g., "400001")
   - **Landmark:** Optional
   - **Payment Method:** Cash / Card / UPI
   - **Special Instructions:** Optional notes

3. Click "Confirm Booking"
4. You'll be redirected to "My Bookings" page

#### Step 4: View Your Bookings
1. Click "My Bookings" in header OR navigate to http://localhost:4200/bookings
2. See all your bookings with:
   - Service name and image
   - Scheduled date and time
   - Status (pending/confirmed/in-progress/completed)
   - Total amount
   - Address details

#### Step 5: Cancel a Booking
1. On the bookings list, find a booking with status "pending" or "confirmed"
2. Click "Cancel Booking" button
3. Confirm the cancellation
4. Status will change to "cancelled"

---

### For Service Providers

#### Step 1: Login as Provider
1. Navigate to http://localhost:4200/auth/login
2. Enter credentials: `provider@test.com` / `Provider@123`
3. Click "Login"

#### Step 2: Access Provider Dashboard
1. Click on account icon (top right)
2. Select "Provider Dashboard" from dropdown
3. OR navigate directly to http://localhost:4200/provider

#### Step 3: View Dashboard Statistics
The dashboard shows:
- **Total Bookings:** All bookings assigned to you
- **Pending:** Bookings awaiting confirmation
- **Confirmed:** Accepted bookings
- **Completed:** Finished services

#### Step 4: Manage Bookings

**For Pending Bookings:**
1. View booking details (customer name, service, address, phone)
2. Click "Confirm" button to accept the booking
3. Status changes to "confirmed"

**For Confirmed Bookings:**
1. Click "Start" button when you begin the service
2. Status changes to "in-progress"

**For In-Progress Bookings:**
1. Click "Complete" button when service is finished
2. Status changes to "completed"

#### Step 5: View Customer Details
Each booking card displays:
- Customer name and phone number
- Full address with landmark
- Special instructions (if any)
- Service details
- Payment method
- Total amount

---

### For Admins

#### Step 1: Login as Admin
1. Navigate to http://localhost:4200/auth/login
2. Enter credentials: `admin@quickfix.com` / `Admin@123`

#### Step 2: Add New Services
1. Go to Admin Panel (http://localhost:4200/admin)
2. Click "Add Service" button
3. Fill in service details:
   - Service Name
   - Description
   - Category (dropdown)
   - Price
   - Discount Price (optional)
   - Duration in minutes
   - **Image URL:** Paste a valid image URL (e.g., from Unsplash, Imgur, etc.)
   - Features (comma-separated)

4. **Image Preview:** As you type the URL, a preview appears below
5. Click "Add Service"
6. New service appears on home page

#### Example Image URLs:
- https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600
- https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=600
- https://via.placeholder.com/600x400/6e45e2/ffffff?text=My+Service

---

## Complete Test Flow

### Scenario: Complete Booking Lifecycle

1. **Admin adds service with image**
   - Login as admin
   - Add new service with image URL
   - Verify image displays on home page

2. **User books the service**
   - Login as user
   - Browse home page, click on service
   - Fill booking form with complete address
   - Confirm booking
   - Verify booking appears in "My Bookings" with "pending" status

3. **Provider manages booking**
   - Login as provider
   - View booking in dashboard (status: pending)
   - Click "Confirm" → status becomes "confirmed"
   - Click "Start" → status becomes "in-progress"
   - Click "Complete" → status becomes "completed"

4. **User views completed booking**
   - Switch back to user account
   - Check "My Bookings"
   - Verify booking status is "completed"

---

## Image Features

### Automatic Fallback
- If an image URL is broken or invalid, a placeholder appears
- Placeholder uses brand colors (#6e45e2)

### Image Preview in Admin
- Real-time preview when adding services
- Shows exactly how image will appear
- Error handling for invalid URLs

### Home Page Images
- Service cards display images with hover zoom effect
- Category icons in circular badges
- Lazy loading for performance

---

## API Endpoints Being Used

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user/provider bookings
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin only)

---

## Common Issues & Solutions

### Issue: "Please login to book a service"
**Solution:** Make sure you're logged in as a user before booking

### Issue: Image not displaying
**Solution:** 
- Use valid HTTPS image URLs
- Try URLs from: Unsplash, Imgur, or placeholder services
- Check browser console for CORS errors

### Issue: Provider dashboard empty
**Solution:** 
- First create bookings as a user
- Providers only see bookings assigned to them
- Check if backend has assigned serviceProvider field

### Issue: Can't see provider dashboard option
**Solution:** 
- Make sure you're logged in as provider@test.com
- Check user role in the menu dropdown

---

## Next Steps

### Suggested Enhancements:
1. Auto-assign bookings to available providers
2. Real-time notifications for new bookings
3. File upload for service images (instead of URLs)
4. Booking calendar view
5. Payment integration
6. Rating and review system after service completion

---

## Support

For any issues:
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Verify frontend is running on port 4200
4. Check MongoDB connection
5. Re-run seed: `npm run seed` in backend folder

---

**All features are now fully functional! Test the complete flow end-to-end.**
