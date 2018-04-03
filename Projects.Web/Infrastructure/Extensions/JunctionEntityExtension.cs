using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Web.Models;
using Projects.Entities.Projects;
using Projects.Data.Repositories;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class JunctionEntityExtension
    {
        public static void AddJunction(this tbl_junction junction, JunctionViewModel junctionVm)
        {
            junction.tenant_id = junctionVm.tenant_id;
            junction.project_id = junctionVm.project_id;
            junction.ps_id = junctionVm.ps_id;
            junction.junction_name = junctionVm.junction_name;            
            junction.created_date = DateTime.Now;
            junction.created_by = junctionVm.created_by;
            junction.modified_date = DateTime.Now;
            junction.modified_by = junctionVm.modified_by;
        }

        public static void AddWorkprogress(this tbl_workprogress workprogress, JunctionViewModel junctionVm)
        {
            workprogress.project_id = junctionVm.project_id;
            workprogress.ps_id = junctionVm.ps_id;
            workprogress.subcontractor_id = 0;            
            workprogress.update_date = DateTime.Now;
        }
    }
}