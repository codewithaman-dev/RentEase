import type { Product, Category, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    "id": "cat_parent_furn",
    "name": "Furniture",
    "slug": "furniture",
    "parent_id": null,
    "icon_name": "Sofa",
    "description": "Home & Office Wooden Furniture",
    "product_count": 18
  },
  {
    "id": "cat_parent_app",
    "name": "Appliances",
    "slug": "appliances",
    "parent_id": null,
    "icon_name": "Tv",
    "description": "Smart Home & Kitchen Electrical Appliances",
    "product_count": 16
  },
  {
    "id": "cat_sub_bed",
    "name": "Bed",
    "slug": "bed",
    "parent_id": "cat_parent_furn",
    "icon_name": "Bed",
    "description": "Queen & King Solid Wood Beds with Mattresses",
    "product_count": 6
  },
  {
    "id": "cat_sub_sofa",
    "name": "Sofa",
    "slug": "sofa",
    "parent_id": "cat_parent_furn",
    "icon_name": "Sofa",
    "description": "Fabric & Leatherette Living Room Sofas",
    "product_count": 6
  },
  {
    "id": "cat_sub_table",
    "name": "Table",
    "slug": "table",
    "parent_id": "cat_parent_furn",
    "icon_name": "Laptop",
    "description": "Study Desks, WFH Tables & Dining Tables",
    "product_count": 6
  },
  {
    "id": "cat_sub_fridge",
    "name": "Fridge",
    "slug": "fridge",
    "parent_id": "cat_parent_app",
    "icon_name": "Tv",
    "description": "Single & Double Door Frost-Free Fridges",
    "product_count": 6
  },
  {
    "id": "cat_sub_washer",
    "name": "Washing Machine",
    "slug": "washing-machine",
    "parent_id": "cat_parent_app",
    "icon_name": "Tv",
    "description": "Fully Automatic Front & Top Load Washing Machines",
    "product_count": 5
  },
  {
    "id": "cat_sub_tv",
    "name": "TV",
    "slug": "tv",
    "parent_id": "cat_parent_app",
    "icon_name": "Tv",
    "description": "4K Smart Ultra HD Android TVs",
    "product_count": 5
  }
];

export const INITIAL_SERVICE_AREAS = [
  {
    "id": "sa_001",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincodes": [
      "560034",
      "560095",
      "560103",
      "560066",
      "560037",
      "560100",
      "560076",
      "560068"
    ],
    "is_active": true
  },
  {
    "id": "sa_002",
    "city": "Pune",
    "state": "Maharashtra",
    "pincodes": [
      "411014",
      "411057",
      "411045",
      "411028",
      "411006",
      "411038"
    ],
    "is_active": true
  },
  {
    "id": "sa_003",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincodes": [
      "500032",
      "500081",
      "500084",
      "500019",
      "500072",
      "500090"
    ],
    "is_active": true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "prod_app_008",
    "name": "OnePlus 43\" Full HD Smart Android TV",
    "title": "OnePlus 43\" Full HD Smart Android TV",
    "slug": "oneplus-43inch-fhd-smart-tv",
    "description": "OnePlus 43-Inch Full HD Smart Android LED TV with Gamma Engine, Bezel-less design, and Dolby Audio.",
    "images": [
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_tv",
    "category_slug": "tv",
    "category_name": "TV",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 499,
    "monthly_rate_3m": 799,
    "monthly_rate_6m": 649,
    "monthly_rate_12m": 499,
    "retail_price": 22000,
    "deposit_amount": 1000,
    "security_deposit": 1000,
    "total_stock": 18,
    "available_stock": 15,
    "stock": 15,
    "condition": "Brand New",
    "rating": 4.7,
    "reviews_count": 27,
    "is_combo": false,
    "dimensions": "38\" W x 22\" H x 3\" D",
    "specifications": {
      "audio": "20W Dolby Audio",
      "display": "Full HD 1080p"
    },
    "tags": [
      "tv",
      "oneplus",
      "appliance"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_app_004",
    "name": "IFB 7.5kg Front-Load Smart Washer",
    "title": "IFB 7.5kg Front-Load Smart Washer",
    "slug": "ifb-7-5kg-front-load-washer",
    "description": "IFB 7.5kg 5-Star Fully Automatic Front Load Washing Machine with Steam Wash, 3D Wash system, and built-in heater.",
    "images": [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_washer",
    "category_slug": "washing-machine",
    "category_name": "Washing Machine",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 799,
    "monthly_rate_3m": 1199,
    "monthly_rate_6m": 999,
    "monthly_rate_12m": 799,
    "retail_price": 28500,
    "deposit_amount": 1600,
    "security_deposit": 1600,
    "total_stock": 10,
    "available_stock": 8,
    "stock": 8,
    "condition": "Brand New",
    "rating": 4.7,
    "reviews_count": 29,
    "is_combo": false,
    "dimensions": "24\" W x 22\" D x 33\" H",
    "specifications": {
      "spin": "1400 RPM",
      "capacity": "7.5 kg"
    },
    "tags": [
      "washing machine",
      "ifb",
      "appliance"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_app_007",
    "name": "Mi 50\" 4K UHD Smart Android TV",
    "title": "Mi 50\" 4K UHD Smart Android TV",
    "slug": "mi-50inch-4k-smart-tv",
    "description": "Xiaomi Mi 50-Inch 4K Ultra HD Smart Android LED TV with Dolby Vision, PatchWall 4.0, and 30W Dolby Audio speakers.",
    "images": [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_tv",
    "category_slug": "tv",
    "category_name": "TV",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 699,
    "monthly_rate_3m": 1099,
    "monthly_rate_6m": 899,
    "monthly_rate_12m": 699,
    "retail_price": 32000,
    "deposit_amount": 1500,
    "security_deposit": 1500,
    "total_stock": 13,
    "available_stock": 11,
    "stock": 11,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 33,
    "is_combo": false,
    "dimensions": "44\" W x 26\" H x 3\" D",
    "specifications": {
      "audio": "30W Dolby Audio",
      "display": "4K Ultra HD"
    },
    "tags": [
      "tv",
      "4k",
      "appliance"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_app_009",
    "name": "Sony Bravia 55\" OLED 4K Cinema Smart TV",
    "title": "Sony Bravia 55\" OLED 4K Cinema Smart TV",
    "slug": "sony-bravia-55inch-oled-4k-tv",
    "description": "Sony Bravia 55-Inch 4K Ultra HD Smart OLED TV with Cognitive Processor XR and Acoustic Surface Audio+.",
    "images": [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_tv",
    "category_slug": "tv",
    "category_name": "TV",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 1499,
    "monthly_rate_3m": 2199,
    "monthly_rate_6m": 1799,
    "monthly_rate_12m": 1499,
    "retail_price": 125000,
    "deposit_amount": 3000,
    "security_deposit": 3000,
    "total_stock": 5,
    "available_stock": 4,
    "stock": 4,
    "condition": "Brand New",
    "rating": 5,
    "reviews_count": 18,
    "is_combo": false,
    "dimensions": "48\" W x 28\" H x 2\" D",
    "specifications": {
      "audio": "Acoustic Surface Audio+",
      "display": "4K OLED XR Processor"
    },
    "tags": [
      "tv",
      "sony",
      "oled"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_din_003",
    "name": "Breakfast Bar Counter Table with 2 Stools",
    "title": "Breakfast Bar Counter Table with 2 Stools",
    "slug": "breakfast-bar-table-stools",
    "description": "High-top breakfast bar counter table with 2 cushioned wooden bar stools, perfect for kitchen nooks and compact dining.",
    "images": [
      "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "dining",
    "category_name": "Dining",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 349,
    "monthly_rate_3m": 549,
    "monthly_rate_6m": 449,
    "monthly_rate_12m": 349,
    "retail_price": 12000,
    "deposit_amount": 800,
    "security_deposit": 800,
    "total_stock": 14,
    "available_stock": 12,
    "stock": 12,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 19,
    "is_combo": false,
    "dimensions": "40\" L x 20\" W x 36\" H",
    "specifications": {
      "type": "Breakfast Counter",
      "includes": "2 High Stools"
    },
    "tags": [
      "dining",
      "breakfast bar",
      "stools"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_din_004",
    "name": "Compact 2-Seater Sheesham Dining Table",
    "title": "Compact 2-Seater Sheesham Dining Table",
    "slug": "compact-2s-sheesham-dining-table",
    "description": "Compact 2-seater Sheesham wood breakfast dining table with 2 comfortable wooden chairs, space-saving design.",
    "images": [
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "dining",
    "category_name": "Dining",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 299,
    "monthly_rate_3m": 449,
    "monthly_rate_6m": 369,
    "monthly_rate_12m": 299,
    "retail_price": 9500,
    "deposit_amount": 700,
    "security_deposit": 700,
    "total_stock": 18,
    "available_stock": 15,
    "stock": 15,
    "condition": "Brand New",
    "rating": 4.7,
    "reviews_count": 15,
    "is_combo": false,
    "dimensions": "30\" L x 30\" W x 30\" H",
    "specifications": {
      "chairs": "2 Wooden Chairs",
      "material": "Solid Sheesham"
    },
    "tags": [
      "dining",
      "table",
      "2 seater"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_din_005",
    "name": "Marble Top 4-Seater Luxury Dining Set",
    "title": "Marble Top 4-Seater Luxury Dining Set",
    "slug": "marble-top-4s-luxury-dining-set",
    "description": "Luxury faux marble top 4-seater dining table with brass finish legs and velvet upholstered dining chairs.",
    "images": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "dining",
    "category_name": "Dining",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 899,
    "monthly_rate_3m": 1299,
    "monthly_rate_6m": 1099,
    "monthly_rate_12m": 899,
    "retail_price": 32000,
    "deposit_amount": 1800,
    "security_deposit": 1800,
    "total_stock": 7,
    "available_stock": 5,
    "stock": 5,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 21,
    "is_combo": false,
    "dimensions": "52\" L x 34\" W x 30\" H",
    "specifications": {
      "top": "Faux Italian Marble",
      "chairs": "4 Velvet Chairs"
    },
    "tags": [
      "dining",
      "marble",
      "luxury"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_combo_001",
    "name": "Ultimate 1BHK Apartment Complete Bundle",
    "title": "Ultimate 1BHK Apartment Complete Bundle",
    "slug": "ultimate-1bhk-apartment-bundle",
    "description": "The complete 1BHK apartment package: Queen Bed + Mattress + 2-Door Wardrobe + WFH Desk & Chair + 260L Fridge + 3-Seater Sofa.",
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 2499,
    "monthly_rate_3m": 3499,
    "monthly_rate_6m": 2999,
    "monthly_rate_12m": 2499,
    "retail_price": 75000,
    "deposit_amount": 4000,
    "security_deposit": 4000,
    "total_stock": 16,
    "available_stock": 14,
    "stock": 14,
    "condition": "Brand New",
    "rating": 5,
    "reviews_count": 72,
    "is_combo": true,
    "dimensions": "Full 1BHK Apartment Package",
    "specifications": {
      "includes": "Queen Bed, Sofa, Fridge, WFH Desk, Wardrobe"
    },
    "tags": [
      "combo",
      "1bhk",
      "package"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_din_002",
    "name": "Modern Glass Top 6-Seater Dining Set",
    "title": "Modern Glass Top 6-Seater Dining Set",
    "slug": "modern-glass-top-6s-dining-set",
    "description": "Modern 6-seater tempered glass top dining table with chrome stainless steel frame and 6 faux leather cushioned chairs.",
    "images": [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "dining",
    "category_name": "Dining",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 799,
    "monthly_rate_3m": 1199,
    "monthly_rate_6m": 999,
    "monthly_rate_12m": 799,
    "retail_price": 28000,
    "deposit_amount": 1600,
    "security_deposit": 1600,
    "total_stock": 9,
    "available_stock": 7,
    "stock": 7,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 24,
    "is_combo": false,
    "dimensions": "60\" L x 36\" W x 30\" H",
    "specifications": {
      "top": "Tempered Glass",
      "chairs": "6 Padded Chairs"
    },
    "tags": [
      "dining",
      "table",
      "glass"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_din_001",
    "name": "Solid Oak 4-Seater Compact Dining Set",
    "title": "Solid Oak 4-Seater Compact Dining Set",
    "slug": "solid-oak-4s-dining-set",
    "description": "4-seater solid oak wood dining table set with cushioned ergonomic chairs, compact design ideal for metro apartments.",
    "images": [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "dining",
    "category_name": "Dining",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 449,
    "monthly_rate_3m": 749,
    "monthly_rate_6m": 599,
    "monthly_rate_12m": 449,
    "retail_price": 15000,
    "deposit_amount": 900,
    "security_deposit": 900,
    "total_stock": 10,
    "available_stock": 9,
    "stock": 9,
    "condition": "Like New",
    "rating": 4.6,
    "reviews_count": 18,
    "is_combo": false,
    "dimensions": "45\" L x 32\" W x 30\" H",
    "specifications": {
      "chairs": "4 Padded Chairs Included",
      "material": "Solid Oak Wood"
    },
    "tags": [
      "dining",
      "table",
      "chairs"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_combo_002",
    "name": "Essential Studio Student Rental Pack",
    "title": "Essential Studio Student Rental Pack",
    "slug": "essential-studio-student-pack",
    "description": "Essential studio student package: Single Bed + Coir Mattress + Foldable Study Desk + Mesh Chair + LG 190L Fridge.",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 1199,
    "monthly_rate_3m": 1699,
    "monthly_rate_6m": 1399,
    "monthly_rate_12m": 1199,
    "retail_price": 38000,
    "deposit_amount": 2000,
    "security_deposit": 2000,
    "total_stock": 20,
    "available_stock": 18,
    "stock": 18,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 45,
    "is_combo": true,
    "dimensions": "Studio Package",
    "specifications": {
      "includes": "Single Bed, Mattress, Desk, Chair, 190L Fridge"
    },
    "tags": [
      "combo",
      "student",
      "studio"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_combo_003",
    "name": "Master Bedroom Complete Package",
    "title": "Master Bedroom Complete Package",
    "slug": "master-bedroom-complete-package",
    "description": "Master bedroom setup: Sheesham Queen Bed + Ortho Mattress + 3-Door Teak Wardrobe + Vanity Dressing Table.",
    "images": [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 1499,
    "monthly_rate_3m": 2199,
    "monthly_rate_6m": 1799,
    "monthly_rate_12m": 1499,
    "retail_price": 48000,
    "deposit_amount": 2500,
    "security_deposit": 2500,
    "total_stock": 12,
    "available_stock": 10,
    "stock": 10,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 31,
    "is_combo": true,
    "dimensions": "Master Bedroom Package",
    "specifications": {
      "includes": "Queen Bed, Mattress, 3-Door Wardrobe, Dressing Table"
    },
    "tags": [
      "combo",
      "bedroom",
      "package"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_combo_004",
    "name": "Living Room Entertainment Set",
    "title": "Living Room Entertainment Set",
    "slug": "living-room-entertainment-set",
    "description": "Living room entertainment pack: Nordic 3-Seater Velvet Sofa + Walnut Coffee Table + Minimalist TV Unit + Mi 50\" 4K Smart TV.",
    "images": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 1699,
    "monthly_rate_3m": 2399,
    "monthly_rate_6m": 1999,
    "monthly_rate_12m": 1699,
    "retail_price": 55000,
    "deposit_amount": 2800,
    "security_deposit": 2800,
    "total_stock": 10,
    "available_stock": 8,
    "stock": 8,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 29,
    "is_combo": true,
    "dimensions": "Living Room Package",
    "specifications": {
      "includes": "3-Seater Sofa, Coffee Table, TV Unit, 50\" 4K TV"
    },
    "tags": [
      "combo",
      "living room",
      "entertainment"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_combo_006",
    "name": "Executive WFH Workstation Bundle",
    "title": "Executive WFH Workstation Bundle",
    "slug": "executive-wfh-workstation-bundle",
    "description": "Executive WFH setup: Motorized Standing Desk + High-Back Mesh Ergonomic Chair + 5-Tier Industrial Display Bookshelf.",
    "images": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 899,
    "monthly_rate_3m": 1299,
    "monthly_rate_6m": 1099,
    "monthly_rate_12m": 899,
    "retail_price": 32000,
    "deposit_amount": 1200,
    "security_deposit": 1200,
    "total_stock": 18,
    "available_stock": 15,
    "stock": 15,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 41,
    "is_combo": true,
    "dimensions": "Workstation Package",
    "specifications": {
      "includes": "Motorized Standing Desk, Mesh Chair, Bookshelf"
    },
    "tags": [
      "combo",
      "wfh",
      "workstation"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_combo_005",
    "name": "Essential Home Appliances Trio Combo",
    "title": "Essential Home Appliances Trio Combo",
    "slug": "essential-home-appliances-trio",
    "description": "Essential kitchen & laundry appliances trio: Samsung 260L Fridge + IFB 7.5kg Front Load Washer + IFB 25L Microwave.",
    "images": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_combos",
    "category_slug": "student-combos",
    "category_name": "Combos",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 1799,
    "monthly_rate_3m": 2499,
    "monthly_rate_6m": 2099,
    "monthly_rate_12m": 1799,
    "retail_price": 58000,
    "deposit_amount": 3000,
    "security_deposit": 3000,
    "total_stock": 15,
    "available_stock": 12,
    "stock": 12,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 38,
    "is_combo": true,
    "dimensions": "Appliances Trio",
    "specifications": {
      "includes": "260L Fridge, 7.5kg Washer, 25L Convection Microwave"
    },
    "tags": [
      "combo",
      "appliances",
      "trio"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_app_001",
    "name": "Samsung 260L Frost-Free Fridge",
    "title": "Samsung 260L Frost-Free Fridge",
    "slug": "samsung-260l-fridge",
    "description": "Samsung 260L 3-Star Frost Free Refrigerator with Digital Inverter Compressor and convertible cooling modes.",
    "images": [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_fridge",
    "category_slug": "fridge",
    "category_name": "Fridge",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 899,
    "monthly_rate_3m": 1299,
    "monthly_rate_6m": 1099,
    "monthly_rate_12m": 899,
    "retail_price": 25000,
    "deposit_amount": 1800,
    "security_deposit": 1800,
    "total_stock": 16,
    "available_stock": 14,
    "stock": 14,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 56,
    "is_combo": false,
    "dimensions": "22\" W x 26\" D x 62\" H",
    "specifications": {
      "capacity": "260 Litres",
      "star_rating": "3-Star Inverter"
    },
    "tags": [
      "fridge",
      "appliance",
      "samsung"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_furn_001",
    "name": "Urban Sheesham Queen Bed & Ortho Mattress",
    "title": "Urban Sheesham Queen Bed & Ortho Mattress",
    "slug": "queen-bed-ortho-mattress",
    "description": "Solid Sheesham wood queen platform bed with built-in storage drawers and a 8-inch orthopaedic memory foam mattress.",
    "images": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 549,
    "monthly_rate_3m": 849,
    "monthly_rate_6m": 699,
    "monthly_rate_12m": 549,
    "retail_price": 29999,
    "deposit_amount": 1500,
    "security_deposit": 1500,
    "total_stock": 15,
    "available_stock": 12,
    "stock": 12,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 38,
    "is_combo": false,
    "dimensions": "62\" W x 82\" L x 40\" H",
    "specifications": {
      "finish": "Natural Sheesham",
      "mattress": "8-inch Orthopaedic Memory Foam"
    },
    "tags": [
      "bed",
      "furniture",
      "bedroom"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_furn_002",
    "name": "Teak Wood King Hydraulic Storage Bed",
    "title": "Teak Wood King Hydraulic Storage Bed",
    "slug": "teak-king-storage-bed",
    "description": "Premium King Size Teak wood bed frame with hydraulic under-bed storage lift mechanism and plush upholstered headboard.",
    "images": [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 749,
    "monthly_rate_3m": 1149,
    "monthly_rate_6m": 949,
    "monthly_rate_12m": 749,
    "retail_price": 38000,
    "deposit_amount": 2000,
    "security_deposit": 2000,
    "total_stock": 10,
    "available_stock": 8,
    "stock": 8,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 24,
    "is_combo": false,
    "dimensions": "74\" W x 84\" L x 44\" H",
    "specifications": {
      "finish": "Teak Wood Finish",
      "storage": "Hydraulic Underbed Lift"
    },
    "tags": [
      "bed",
      "furniture",
      "king"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_furn_003",
    "name": "Single Solid Pine Bed & Coir Mattress",
    "title": "Single Solid Pine Bed & Coir Mattress",
    "slug": "single-pine-bed-coir-mattress",
    "description": "Compact single wooden bed frame crafted from solid pine wood, bundled with a 6-inch coir spring mattress.",
    "images": [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 399,
    "monthly_rate_3m": 599,
    "monthly_rate_6m": 499,
    "monthly_rate_12m": 399,
    "retail_price": 16000,
    "deposit_amount": 1000,
    "security_deposit": 1000,
    "total_stock": 18,
    "available_stock": 15,
    "stock": 15,
    "condition": "Brand New",
    "rating": 4.7,
    "reviews_count": 19,
    "is_combo": false,
    "dimensions": "38\" W x 78\" L x 32\" H",
    "specifications": {
      "finish": "Pine Wood",
      "mattress": "6-inch Natural Coir"
    },
    "tags": [
      "bed",
      "single",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_furn_004",
    "name": "Solid Wood Twin Bunk Bed with Ladder",
    "title": "Solid Wood Twin Bunk Bed with Ladder",
    "slug": "solid-wood-twin-bunk-bed",
    "description": "Solid wood dual bunk bed with safety guard rails and built-in ladder, ideal for shared student rooms or kids.",
    "images": [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 599,
    "monthly_rate_3m": 899,
    "monthly_rate_6m": 749,
    "monthly_rate_12m": 599,
    "retail_price": 26000,
    "deposit_amount": 1400,
    "security_deposit": 1400,
    "total_stock": 8,
    "available_stock": 6,
    "stock": 6,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 14,
    "is_combo": false,
    "dimensions": "42\" W x 80\" L x 68\" H",
    "specifications": {
      "frame": "Solid Mango Wood",
      "safety": "Full Length Guard Rails"
    },
    "tags": [
      "bunk bed",
      "bed",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_furn_005",
    "name": "Nordic 3-Seater Velvet Plush Sofa",
    "title": "Nordic 3-Seater Velvet Plush Sofa",
    "slug": "nordic-3-seater-sofa",
    "description": "Ultra-comfortable 3-seater plush velvet fabric couch in dark teal grey with high resilience foam and stain-resistant fabric.",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_sofa",
    "category_slug": "sofa",
    "category_name": "Sofa",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 699,
    "monthly_rate_3m": 1099,
    "monthly_rate_6m": 899,
    "monthly_rate_12m": 699,
    "retail_price": 24999,
    "deposit_amount": 1500,
    "security_deposit": 1500,
    "total_stock": 12,
    "available_stock": 10,
    "stock": 10,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 42,
    "is_combo": false,
    "dimensions": "84\" W x 36\" D x 34\" H",
    "specifications": {
      "frame": "Solid Teak Wood",
      "fabric": "Stain-resistant velvet"
    },
    "tags": [
      "sofa",
      "velvet",
      "living",
      "furniture"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_furn_010",
    "name": "3-Door Teak Wardrobe with Dressing Mirror",
    "title": "3-Door Teak Wardrobe with Dressing Mirror",
    "slug": "3-door-teak-wardrobe-mirror",
    "description": "Spacious 3-door solid teak wardrobe with full-length dressing mirror, internal clothing hanging rod, and security drawer lock.",
    "images": [
      "https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 699,
    "monthly_rate_3m": 1099,
    "monthly_rate_6m": 899,
    "monthly_rate_12m": 699,
    "retail_price": 32000,
    "deposit_amount": 1800,
    "security_deposit": 1800,
    "total_stock": 10,
    "available_stock": 8,
    "stock": 8,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 35,
    "is_combo": false,
    "dimensions": "54\" W x 22\" D x 78\" H",
    "specifications": {
      "features": "Full Mirror, Security Lock",
      "material": "Teak Finished Engineered Wood"
    },
    "tags": [
      "wardrobe",
      "furniture",
      "bedroom"
    ],
    "featured": true,
    "is_active": true
  },
  {
    "id": "prod_furn_014",
    "name": "Modern Vanity Dressing Table with Mirror",
    "title": "Modern Vanity Dressing Table with Mirror",
    "slug": "vanity-dressing-table-mirror",
    "description": "Modern dressing table vanity with tall mirror, built-in LED frame light, and pull-out storage drawer.",
    "images": [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_bed",
    "category_slug": "bed",
    "category_name": "Bed",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 399,
    "monthly_rate_3m": 599,
    "monthly_rate_6m": 499,
    "monthly_rate_12m": 399,
    "retail_price": 14000,
    "deposit_amount": 1000,
    "security_deposit": 1000,
    "total_stock": 11,
    "available_stock": 9,
    "stock": 9,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 25,
    "is_combo": false,
    "dimensions": "28\" W x 16\" D x 68\" H",
    "specifications": {
      "features": "Built-In Mirror, Drawer",
      "material": "Teak Finished Wood"
    },
    "tags": [
      "dressing table",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_furn_015",
    "name": "Velvet Wingback Accent Lounge Chair",
    "title": "Velvet Wingback Accent Lounge Chair",
    "slug": "velvet-wingback-lounge-chair",
    "description": "Plush velvet wingback lounge chair with golden metal legs, perfect for reading corners or bedroom seating.",
    "images": [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_sofa",
    "category_slug": "sofa",
    "category_name": "Sofa",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 349,
    "monthly_rate_3m": 549,
    "monthly_rate_6m": 449,
    "monthly_rate_12m": 349,
    "retail_price": 13500,
    "deposit_amount": 900,
    "security_deposit": 900,
    "total_stock": 13,
    "available_stock": 11,
    "stock": 11,
    "condition": "Brand New",
    "rating": 4.9,
    "reviews_count": 30,
    "is_combo": false,
    "dimensions": "30\" W x 30\" D x 38\" H",
    "specifications": {
      "legs": "Gold Plated Steel",
      "fabric": "Emerald Velvet"
    },
    "tags": [
      "accent chair",
      "sofa",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_furn_012",
    "name": "5-Tier Industrial Display Bookshelf",
    "title": "5-Tier Industrial Display Bookshelf",
    "slug": "5-tier-industrial-bookshelf",
    "description": "5-tier industrial style display bookshelf with black metal frame and dark oak wooden shelves for books and decor.",
    "images": [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "table",
    "category_name": "Table",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 299,
    "monthly_rate_3m": 449,
    "monthly_rate_6m": 379,
    "monthly_rate_12m": 299,
    "retail_price": 9500,
    "deposit_amount": 700,
    "security_deposit": 700,
    "total_stock": 18,
    "available_stock": 15,
    "stock": 15,
    "condition": "Brand New",
    "rating": 4.8,
    "reviews_count": 17,
    "is_combo": false,
    "dimensions": "32\" W x 14\" D x 70\" H",
    "specifications": {
      "frame": "Powder-coated Iron",
      "shelves": 5
    },
    "tags": [
      "bookshelf",
      "table",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  },
  {
    "id": "prod_furn_013",
    "name": "Closed Wooden Shoe Cabinet with Seating",
    "title": "Closed Wooden Shoe Cabinet with Seating",
    "slug": "closed-wooden-shoe-cabinet",
    "description": "Closed wooden shoe cabinet with padded seating cushion on top, stores up to 12 pairs of footwear neatly.",
    "images": [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"
    ],
    "image": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    "category_id": "cat_sub_table",
    "category_slug": "table",
    "category_name": "Table",
    "vendor_id": "usr_vendor_001",
    "monthly_rent": 199,
    "monthly_rate_3m": 329,
    "monthly_rate_6m": 259,
    "monthly_rate_12m": 199,
    "retail_price": 6500,
    "deposit_amount": 500,
    "security_deposit": 500,
    "total_stock": 20,
    "available_stock": 16,
    "stock": 16,
    "condition": "Brand New",
    "rating": 4.7,
    "reviews_count": 14,
    "is_combo": false,
    "dimensions": "32\" W x 14\" D x 20\" H",
    "specifications": {
      "top": "Padded Cushion Bench",
      "capacity": "12 Pairs"
    },
    "tags": [
      "shoe rack",
      "furniture"
    ],
    "featured": false,
    "is_active": true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    product_id: 'prod_app_008',
    user_name: 'Vikram Mehta',
    rating: 5,
    comment: 'Super fast 48-hour delivery in Bangalore! The OnePlus TV picture quality is crystal clear.',
    date: '2025-02-14',
    verified_renter: true,
  },
  {
    id: 'rev_2',
    product_id: 'prod_app_008',
    user_name: 'Pooja Nair',
    rating: 4,
    comment: 'Sound quality and setup experience were great. Technician was polite and assisted with wall mounting.',
    date: '2025-02-28',
    verified_renter: true,
  },
  {
    id: 'rev_3',
    product_id: 'prod_furn_001',
    user_name: 'Arjun Verma',
    rating: 5,
    comment: 'Solid Sheesham wood bed. Very sturdy and the orthopedic mattress is super comfortable.',
    date: '2025-03-01',
    verified_renter: true,
  },
  {
    id: 'rev_4',
    product_id: 'prod_app_001',
    user_name: 'Sneha Patel',
    rating: 5,
    comment: 'The Samsung fridge arrived brand new without a single scratch. Completely satisfied.',
    date: '2025-03-05',
    verified_renter: true,
  },
  {
    id: 'rev_5',
    product_id: 'prod_combo_001',
    user_name: 'Rohan Deshmukh',
    rating: 5,
    comment: 'Saved me so much money for my 1BHK apartment in Pune! Smooth onboarding.',
    date: '2025-03-10',
    verified_renter: true,
  }
];
