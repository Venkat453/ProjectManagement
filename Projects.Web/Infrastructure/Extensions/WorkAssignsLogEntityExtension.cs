using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class WorkAssignsLogEntityExtension
    {
        public static void AddWorkAssignmentLog(this tbl_workassigns_log workAssignLog, WorkAssignsLogViewModel workAssignLogVM)
        {
            workAssignLog.project_id = workAssignLogVM.project_id;
            workAssignLog.ps_id = workAssignLogVM.ps_id;
            workAssignLog.junction_id = workAssignLogVM.junction_id;
            workAssignLog.assigned_date = workAssignLogVM.assigned_date;
            workAssignLog.deassigned_date = workAssignLogVM.deassigned_date;
            workAssignLog.subcontractor_id = workAssignLogVM.subcontractor_id;
            workAssignLog.created_date = DateTime.Now;


        }
    }
}