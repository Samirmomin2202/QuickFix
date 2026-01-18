# How to Seed Database with Sample Data

The chart in the admin dashboard requires booking data to display. Follow these steps to populate the database with sample data:

## Steps to Seed the Database:

### 1. Navigate to Backend Directory
```bash
cd uc/backend
```

### 2. Run the Seed Script
```bash
npm run seed
```

This will:
- Clear existing data
- Create sample users (admin, regular user, service provider)
- Create categories
- Create services
- Create sample bookings with revenue data
- Create sample reviews

### 3. Default Credentials After Seeding

**Admin Account:**
- Email: `admin@quickfix.com`
- Password: `Admin@123`

**User Account:**
- Email: `user@test.com`
- Password: `User@123`

**Service Provider Account:**
- Email: `provider@test.com`
- Password: `Provider@123`

### 4. Verify the Chart

After seeding, log in to the admin dashboard and you should see:
- Revenue bars in the "Revenue Overview (Last 12 Days)" chart
- Statistics populated with real data
- Recent activities showing bookings

## Troubleshooting

If the chart still doesn't show:

1. **Check MongoDB Connection**
   - Ensure MongoDB is running
   - Check the `.env` file has correct `MONGO_URI`

2. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for any API errors

3. **Verify Backend is Running**
   ```bash
   cd uc/backend
   npm run dev
   ```

4. **Check if Data was Created**
   - Use MongoDB Compass or CLI to verify bookings exist
   - The seed script should show success messages

## Chart Behavior

- **No Data:** Shows a message "No revenue data available for the last 12 days"
- **With Data:** Shows bars representing revenue for each of the last 12 days
- **Bar Height:** Calculated based on the maximum revenue value in the dataset
- **Minimum Height:** Bars with data have at least 15% height for visibility

## Need More Data?

Run the seed script multiple times or manually create bookings through the frontend to generate more chart data.
