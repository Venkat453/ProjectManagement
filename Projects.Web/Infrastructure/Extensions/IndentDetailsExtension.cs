using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class IndentDetailsExtension
    {
        public static void AddindentDetails(this tbl_indent_details indent, IndentDetailsViewModel indentVm)
        {
            indent.tenant_id = indentVm.tenant_id;
            indent.project_id = indentVm.project_id;
            indent.SubContractor_id = indentVm.SubContractor_id;
            indent.indent_no = indentVm.indent_no;
            indent.material_name = indentVm.material_name;
            indent.material_description = indentVm.material_description;
            indent.quantity = indentVm.quantity;
            indent.unit_of_measurement = indentVm.unit_of_measurement;
            indent.material_price = indentVm.material_price;
            indent.total_price = indentVm.total_price;
            indent.given_quantity = indentVm.given_quantity;
            indent.material_released_status = indentVm.material_released_status;
            indent.released_material_Cost = indentVm.released_material_Cost;
            indent.material_released_date = indentVm.material_released_date;
        }
    }
}