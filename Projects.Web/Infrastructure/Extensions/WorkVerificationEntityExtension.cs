using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class WorkVerificationEntityExtension
    {
        public static void Addvehicle(this tbl_workverification workverification, WorkVerificationViewModel workverificationVm)
        {
            workverification.project_id = workverificationVm.project_id;
            workverification.ps_id = workverificationVm.ps_id;
            workverification.junction_id = workverificationVm.junction_id;
            workverification.subcontractor_id = workverificationVm.subcontractor_id;
            workverification.assigned_date = workverificationVm.assigned_date;
            workverification.jun_component = workverificationVm.jun_component;
            workverification.total = workverificationVm.total;
            workverification.completed = workverificationVm.completed;
            workverification.verification_status = workverificationVm.verification_status;
            workverification.verified_quantity = workverificationVm.verified_quantity;
            workverification.nc_quantity = workverificationVm.nc_quantity;
            workverification.verified_by = workverificationVm.verified_by;
            workverification.comments = workverificationVm.comments;
            workverification.created_date = workverificationVm.created_date;
        }
        //public static void AddWorkVerification(this tbl_workverification workverification, JunctionViewModel junctionVm)
        //{
        //    workverification.project_id = junctionVm.project_id;
        //    workverification.ps_id = junctionVm.ps_id;
        //    workverification.subcontractor_id = 0;
        //    workverification.created_date = DateTime.Now;
        //}
    }
}