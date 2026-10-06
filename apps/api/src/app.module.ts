import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { EntitlementsModule } from './modules/entitlements/entitlements.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BoardsModule } from './modules/boards/boards.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { LabelsModule } from './modules/labels/labels.module';
import { GanttModule } from './modules/gantt/gantt.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ActivityModule } from './modules/activity/activity.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    EntitlementsModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ProjectsModule,
    BoardsModule,
    TasksModule,
    LabelsModule,
    GanttModule,
    CalendarModule,
    CommentsModule,
    ActivityModule,
    BillingModule,
    AdminModule,
    NotificationsModule,
    SearchModule,
  ],
})
export class AppModule {}
