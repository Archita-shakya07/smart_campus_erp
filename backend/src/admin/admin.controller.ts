import { Controller, Get } from '@nestjs/common';

@Controller('admin') // Base path: /api/admin
export class AdminController {
  @Get('stats')
  getAdminStats() {
    return {
      success: true,
      totalStudents: 120,
      totalTeachers: 15,
      activeNotices: 5,
    };
  }

  // NAYA ROUTE: Isko abhi add karein taaki 404 error chali jaye
  @Get('activities') // Isse URL banega: /api/admin/activities
  getAdminActivities() {
    // Frontend testing ke liye dummy array data bhej rahe hain
    return [
      { id: 1, action: 'New student registered', time: '5 mins ago' },
      { id: 2, action: 'Notice updated by Principal', time: '10 mins ago' },
      { id: 3, action: 'Timetable changed for Class 10', time: '1 hour ago' }    ];
  }
}
