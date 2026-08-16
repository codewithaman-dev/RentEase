export interface Product {
  id: string;
  title: string;
  name?: string;
  slug: string;
  category_slug: string;
  category_name: string;
  category_id?: string;
  vendor_id?: string;
  description: string;
  image: string;
  images?: string[];
  monthly_rate_3m: number;
  monthly_rate_6m: number;
  monthly_rate_12m: number;
  monthly_rent?: number;
  retail_price: number;
  deposit_amount: number;
  security_deposit?: number;
  stock: number;
  available_stock?: number;
  total_stock?: number;
  condition: 'Brand New' | 'Like New' | 'Refurbished Grade A' | string;
  rating: number;
  reviews_count: number;
  is_combo?: boolean;
  dimensions?: string;
  specifications?: any;
  tags?: string[];
  featured?: boolean;
  is_active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  image?: string;
  description: string;
  product_count: number;
  parent_id?: string | null;
  subcategories?: Category[];
}

export interface Rental {
  id: string;
  order_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  product_id: string;
  product_title: string;
  product_image: string;
  tenure_months: number;
  monthly_price: number;
  security_deposit: number;
  status: 'Active' | 'Delivering' | 'Completed' | 'Cancelled' | 'Return Scheduled' | 'RETURN_SCHEDULED' | string;
  start_date: string;
  end_date: string;
  next_billing_date: string;
  delivery_address: string;
  city: string;
  pincode: string;
  created_at: string;
}

export interface MaintenanceTicket {
  id: string;
  rental_id: string;
  product_title: string;
  user_email: string;
  user_name: string;
  issue_category: 'Electrical' | 'Mechanical' | 'Upholstery/Furniture' | 'Performance' | 'General Inquiry' | string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved' | string;
  technician_notes?: string;
  photo_url?: string;
  created_at: string;
  resolved_at?: string;
}

export interface RelocationRequest {
  id: string;
  rental_id: string;
  product_title: string;
  user_email: string;
  user_name: string;
  current_address: string;
  new_address: string;
  preferred_date: string;
  status: 'Pending' | 'Confirmed' | 'In Transit' | 'Completed' | string;
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  date?: string;
  verified_renter: boolean;
}

export interface CartItem {
  product: Product;
  tenureMonths: 3 | 6 | 12;
  quantity: number;
  monthlyPrice: number;
  deposit: number;
}

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  kyc_status?: 'Pending' | 'Verified' | 'Not Submitted';
}
