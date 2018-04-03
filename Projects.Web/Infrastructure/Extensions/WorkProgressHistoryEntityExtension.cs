using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class WorkProgressHistoryEntityExtension
    {
        public static void AddWorkprogressHistory(this tbl_Workprogress_History workprogress, WorkProgressHistoryViewModel workprogressVm)
        {
            workprogress.id = workprogressVm.id;
            workprogress.tenant_id = workprogressVm.tenant_id;
            workprogress.project_id = workprogressVm.project_id;
            workprogress.junction_component = workprogressVm.junction_component;
            workprogress.update_date = workprogressVm.update_date;
            workprogress.junction_id = workprogressVm.junction_id;
            workprogress.subcontractor_id = workprogressVm.subcontractor_id;
            workprogress.total = workprogressVm.total;
            workprogress.completed = workprogressVm.completed;
            workprogress.pending = workprogressVm.pending;
            workprogress.progress = workprogressVm.progress;
        }
    }
}