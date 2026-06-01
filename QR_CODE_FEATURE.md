# QR Code Feature for Tables

## What Was Added

A QR code generation and download feature has been added to the Table Editor page.

## How It Works

1. **Navigate to Tables Page**: Go to `http://localhost:3000/dashboard?tab=settings&subTab=tables`

2. **Create a Table**: Add a new table using the input field (e.g., "Table 1")

3. **Generate QR Code**: Click the "QR" button next to any table

4. **Download**: The QR code will automatically download as a PNG file (e.g., `Table_1_QR.png`)

5. **Customer Scanning**: When a customer scans the QR code, they will be directed to:
   - Format: `http://localhost:3000/{restaurantID}?table={tableUsername}`
   - Example: `http://localhost:3000/gemelli?table=table1`

## Features

- **High Quality**: QR codes are generated at 800x800 pixels for print quality
- **Automatic Naming**: Downloaded files are named after the table (e.g., `Table_1_QR.png`)
- **Direct Link**: QR codes contain the full URL with the table parameter
- **Loading State**: Shows loading indicator while generating QR code
- **Success Notification**: Toast notification confirms successful download

## Technical Details

- **Library Used**: `qrcode` npm package
- **QR Code Settings**:
  - Width: 800px
  - Margin: 2
  - Colors: Black on white background
  - Format: PNG (Data URL)

## Usage Example

1. Create "Table 1" in the dashboard
2. Click the "QR" button
3. Print the downloaded QR code
4. Place it on the physical table
5. Customers scan it and are taken directly to your menu with Table 1 pre-selected

## Benefits

- **Contactless Ordering**: Customers can order without touching physical menus
- **Table Tracking**: Orders are automatically associated with the correct table
- **Easy Setup**: One-click QR code generation for each table
- **Professional**: High-quality QR codes suitable for printing
