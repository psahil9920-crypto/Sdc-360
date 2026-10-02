export type IssueCategory =
  | 'Equipment & Hardware'
  | 'Classroom Maintenance'
  | 'Wi-Fi & Network'
  | 'Electrical & AC'
  | 'Cleanliness & Sanitation'
  | 'Library Services';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export interface CampusTicket {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  block: string;
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy: string;
  studentRollNo: string;
  reportedAt: string;
  updatedAt: string;
  department: string;
  assignedTechnician?: string;
  technicianRole?: string;
  resolutionNotes?: string;
  estimatedResolutionHours?: number;
  upvotes: number;
  userUpvoted?: boolean;
}

export type LocationCategory = 'lab' | 'classroom' | 'office' | 'library' | 'amenity' | 'sports';

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  block: 'Block A' | 'Block B' | 'Block C' | 'Block D' | 'Block E' | 'Amenities';
  floor: 'Ground' | '1st Floor' | '2nd Floor' | '3rd Floor';
  category: LocationCategory;
  capacity: number;
  currentOccupancy: number;
  status: 'Available' | 'In Class' | 'Maintenance' | 'Reserved';
  currentActivity?: string;
  equipment: string[];
  inCharge: string;
  contact: string;
  description: string;
  coordinates: { x: number; y: number }; // percentage on campus canvas
}

export type NotificationCategory = 'Academic' | 'Exam' | 'Admin' | 'CodeCraft' | 'Urgent';

export interface CampusNotification {
  id: string;
  title: string;
  content: string;
  category: NotificationCategory;
  timestamp: string;
  pinned?: boolean;
  unread: boolean;
  department: string;
  actionUrl?: string;
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  programme: string;
  semester: string;
  section: string;
  email: string;
  avatarUrl?: string;
}

export interface DriveCampusFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
  source: 'google-drive' | 'campus-repository';
  category?: 'Syllabus' | 'Lecture Notes' | 'Question Bank' | 'Lab Manual' | 'Personal';
  semester?: string;
}
