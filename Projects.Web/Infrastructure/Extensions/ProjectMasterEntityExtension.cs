using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class ProjectMasterEntityExtension
    {
        public static void AddProjectMaster(this tbl_project_master projectMaster , ProjectMasterViewModel projectMasterVm)
        {
            projectMaster.tenant_id = projectMasterVm.tenant_id;
            projectMaster.Project_Code = projectMasterVm.Project_Code;
            projectMaster.Project_Name = projectMasterVm.Project_Name;
            projectMaster.Project_Client = projectMasterVm.Project_Client;
            projectMaster.Project_DeliveryDate = projectMasterVm.Project_DeliveryDate;
            projectMaster.CompID = projectMasterVm.CompID;
            projectMaster.Project_Description = projectMasterVm.Project_Description;
            projectMaster.Project_Equp_Name = projectMasterVm.Project_Equp_Name;
            projectMaster.Maker_No = projectMasterVm.Maker_No;
            projectMaster.Created_On = DateTime.Now;
            projectMaster.Created_By = projectMasterVm.Created_By;
            projectMaster.Modified_On = DateTime.Now;
            projectMaster.Modified_By = projectMasterVm.Modified_By;
        }
    }
}