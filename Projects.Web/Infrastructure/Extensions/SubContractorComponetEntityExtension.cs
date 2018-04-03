using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class SubContractorComponetEntityExtension
    {
        public static void AddSubcontractorcompnent(this tbl_subcontractor_components subcontractorcomp, SubcontractorCoponentViewModel subcontractorcompVm)
        {
            //subcontractorcomp.tenant_id = subcontractorcompVm.tenant_id; 
            //subcontractorcomp.project_id = subcontractorcompVm.project_id;
            //subcontractorcomp.subcontractor_id = subcontractorcompVm.subcontractor_id;
            //subcontractorcomp.subcontractor_name = subcontractorcompVm.subcontractor_name;
            //subcontractorcomp.component_id = subcontractorcompVm.component_id;
        }
    }
}