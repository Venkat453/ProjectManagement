using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class ProjectMasterExtension
    {
        public static void AddProjectMaster(this tbl_project_master project, ProjectMasterViewModel ProjectVm)
        {
            project.id = ProjectVm.id;
            project.tenant_id = ProjectVm.tenant_id;
            project.project_name = ProjectVm.project_name;
            project.project_description = ProjectVm.project_description;
            project.project_customer = ProjectVm.project_customer;



        }
    }
}