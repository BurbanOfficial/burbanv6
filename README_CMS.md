# Burban E-Commerce CMS Setup Guide

## 📋 Overview
This is a complete e-commerce system with a GitHub-based CMS for managing products.

## 🚀 Setup Instructions

### 1. Create GitHub Repository
1. Create a new **private** repository on GitHub (e.g., `burban-cms`)
2. Upload the `products.json` file to this repository

### 2. Generate GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Burban CMS")
4. Select scopes: `repo` (Full control of private repositories)
5. Generate and **copy the token**

### 3. Configure the CMS

#### In `shop.js`:
```javascript
const GITHUB_REPO = 'your-username/burban-cms'; // Replace with your repo
```

#### In `admin.js`:
```javascript
const ADMIN_PASSWORD = 'your-secure-password'; // Change this!
const GITHUB_TOKEN = 'your_github_token_here'; // Paste your token
const GITHUB_REPO = 'your-username/burban-cms'; // Replace with your repo
```

### 4. Deploy
Upload all files to your web hosting or use GitHub Pages for the shop (not the admin).

## 📁 Files Structure

```
/
├── index.html          # Homepage
├── shop.html           # Products listing page
├── shop.css            # Shop styles
├── shop.js             # Shop functionality
├── admin.html          # CMS admin panel
├── admin.css           # Admin styles
├── admin.js            # Admin functionality
├── products.json       # Products database (on GitHub)
└── README_CMS.md       # This file
```

## 🔐 Security

### Admin Access
- URL: `https://yoursite.com/admin.html`
- Default password: `burban2024` (CHANGE THIS!)
- The admin panel is password-protected
- GitHub token is required for saving products

### Important Security Notes
1. **Never commit your GitHub token to a public repository**
2. Change the default admin password immediately
3. Keep your GitHub repository private
4. Consider using environment variables for production

## 🛍️ Product Management

### Product Fields
- **Name**: Product name
- **Category**: tshirt, hoodie, pants, accessories
- **Price**: Regular price in euros
- **Sale Price**: Optional discounted price
- **Image URL**: Direct link to product image
- **Description**: Product description
- **Sizes**: Comma-separated (e.g., XS,S,M,L,XL)
- **Colors**: Comma-separated hex codes (e.g., #000000,#FFFFFF)
- **Stock**: Available quantity
- **Publish Date**: Optional scheduled publish date
- **Unpublish Date**: Optional scheduled removal date
- **Badges**: New, Sale, Back in Stock

### Automatic Features
1. **Scheduled Publishing**: Products appear/disappear based on dates
2. **Sale Badges**: Automatically shown when sale price is set
3. **Price Display**: Original price is crossed out when on sale
4. **Stock Management**: Track inventory in real-time
5. **Filters**: Automatic filtering by category, size, color, price

## 🎨 Customization

### Colors
Edit CSS variables in `shop.css` and `admin.css`

### Categories
Add new categories in:
- `admin.html` (select options)
- `shop.html` (filter checkboxes)

### Badges
Customize badge styles in `shop.css` (.badge class)

## 📱 Features

### Shop Page
- ✅ Responsive product grid
- ✅ Real-time filters (category, size, color, price)
- ✅ Product modal with variants
- ✅ Sale badges and pricing
- ✅ "New" and "Back in Stock" badges
- ✅ Mobile-optimized

### Admin Panel
- ✅ Secure login
- ✅ Add/Edit/Delete products
- ✅ Schedule publishing
- ✅ Manage variations (sizes, colors)
- ✅ Stock management
- ✅ Sale pricing
- ✅ Image management

## 🔄 Workflow

1. Login to admin panel (`admin.html`)
2. Add or edit products
3. Set prices, variations, and stock
4. Schedule publish dates if needed
5. Save changes (automatically syncs to GitHub)
6. Products appear on shop page immediately

## 🐛 Troubleshooting

### Products not loading
- Check GitHub token permissions
- Verify repository name in config
- Check browser console for errors

### Can't save products
- Verify GitHub token is valid
- Check repository permissions
- Ensure products.json exists in repo

### Images not showing
- Use direct image URLs (not Google Drive links)
- Use HTTPS URLs
- Consider using image hosting (Imgur, Cloudinary)

## 📞 Support

For issues or questions, check:
1. Browser console for errors
2. GitHub repository permissions
3. Token expiration date

## 🚀 Next Steps

1. Replace demo products with your actual products
2. Add your product images
3. Customize colors and branding
4. Set up payment integration (Stripe, PayPal)
5. Add shopping cart functionality
6. Implement order management

---

**Made for Burban Official** 🖤
