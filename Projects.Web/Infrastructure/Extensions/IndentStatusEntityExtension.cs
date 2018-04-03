using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class IndentStatusEntityExtension
    {
        public static void AddindentStatus(this tbl_indentstatus indentstatus, IndentStatusViewModel indentstatusVm)
        {
            indentstatus.indent_no = indentstatusVm.indent_no;
            indentstatus.tenant_id = indentstatusVm.tenant_id;
            indentstatus.project_id = indentstatusVm.project_id;
            indentstatus.date_recieved = indentstatusVm.date_recieved;
            indentstatus.SubContractor_id = indentstatusVm.SubContractor_id;
            indentstatus.date_required = indentstatusVm.date_required;
            indentstatus.material = indentstatusVm.material;
            indentstatus.indentstatus = indentstatusVm.indentstatus;
            indentstatus.recieved_by = indentstatusVm.recieved_by;


        }
    }
}