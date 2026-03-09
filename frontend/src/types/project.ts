export interface Project {
  id:            string;       
  orgId:         string;       
  name:          string;
  description:   string | null;
  createdById:   string | null; 
  createdAt:     string;       
  updatedAt:     string;        
}

export interface CreateProjectBody {
  name:        string;
  description: string | null;
}
