using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class IndentExtensions
    {
        public static void Addindent(this tbl_indent_header indent, IndentHeadViewModel indentVm)
        {
            indent.tenant_id = indentVm.tenant_id;
            indent.indent_no = indentVm.indent_no;
            indent.SubContractor_id = indentVm.SubContractor_id;
            indent.project_id = indentVm.project_id;
            indent.authorized_by = indentVm.authorized_by;
            indent.recieved_by = indentVm.recieved_by;
            indent.recieved_from = indentVm.recieved_from;
            indent.indent_encode = indentVm.indent_encode;
            indent.indent_encode_file_type = indentVm.indent_encode_file_type;
            indent.date_recieved = indentVm.date_recieved;
            indent.date_required = indentVm.date_required;


        }
    }
}
