using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class WorkAssignEntityExtension
    {
        public static void AddAssignment(this tbl_workassigns workAssign, WorkAssignmentViewModel workAssignVM)
        {
            workAssign.tenant_id = workAssignVM.tenant_id;
            workAssign.project_id = workAssignVM.project_id;
            workAssign.ps_id = workAssignVM.ps_id;
            workAssign.junction_id = workAssignVM.junction_id;
            workAssign.isAssigned = workAssignVM.isAssigned;
            // workAssign.assigned_date = workAssignVM.assigned_date;
            // workAssign.assigned_date = TimeZoneInfo.ConvertTimeFromUtc(workAssignVM.assigned_date, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
            workAssign.assigned_date= DateTime.Now;
            workAssign.subcontractor_id = workAssignVM.subcontractor_id;
            workAssign.created_date = DateTime.Now;
            workAssign.modified_date = DateTime.Now;
            

        }
    }
}