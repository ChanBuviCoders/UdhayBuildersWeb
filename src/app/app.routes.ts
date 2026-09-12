import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PropertiesComponent } from './properties.component';
import { ProjectsComponent } from './projects.component';
import { PropertyDetailComponent } from './property-detail.component';
import { ProjectDetailComponent } from './project-detail.component';
import { AdminComponent } from './admin.component';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Uday Builders | Building spaces. Creating futures.' },
  { path: 'projects', component: ProjectsComponent, title: 'Projects | Uday Builders' },
  { path: 'project/:id', component: ProjectDetailComponent, title: 'Project | Uday Builders' },
  { path: 'properties', component: PropertiesComponent, title: 'Properties | Uday Builders' },
  { path: 'property/:id', component: PropertyDetailComponent, title: 'Property | Uday Builders' },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard], title: 'Admin | Uday Builders' },
  { path: 'admin/login', component: AdminComponent, title: 'Admin login | Uday Builders' },
  { path: '**', redirectTo: '' }
];
